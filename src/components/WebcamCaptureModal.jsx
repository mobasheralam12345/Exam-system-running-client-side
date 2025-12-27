import React, { useState, useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle, Smartphone } from "lucide-react";
import Swal from "sweetalert2";
import { useWebcamCapture } from "../hooks/useWebcamCapture";

const WebcamCaptureModal = ({ isOpen, onClose, onComplete }) => {
  const {
    videoRef,
    canvasRef,
    cameraAccessGranted,
    cameraError,
    capturedImages,
    isCapturing,
    startCamera,
    stopCamera,
    captureWithFaceDetection,
    clearAllImages,
    setCameraError,
  } = useWebcamCapture();

  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [angleInstructions, setAngleInstructions] = useState("");
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [headPosition, setHeadPosition] = useState(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [faceApiReady, setFaceApiReady] = useState(false);
  const [debugInfo, setDebugInfo] = useState("");
  const [cancelled, setCancelled] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const faceCanvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const animationFrameRef = useRef(null);

  const angles = [
    {
      key: "front",
      label: "Look FRONT",
      description: "Look straight at the camera",
    },
    {
      key: "left",
      label: "Turn LEFT",
      description: "Turn your head to the left",
    },
    {
      key: "right",
      label: "Turn RIGHT",
      description: "Turn your head to the right",
    },
    { key: "up", label: "Look UP", description: "Look upward" },
  ];

  // Detect mobile device
  useEffect(() => {
    const checkMobile = () => {
      const mobile =
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
          navigator.userAgent
        ) || window.innerWidth < 768;
      setIsMobile(mobile);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Load face-api + models
  useEffect(() => {
    let timeoutId;

    const loadFaceApi = async () => {
      try {
        if (window.faceapi?.nets?.tinyFaceDetector?.params) {
          setFaceApiReady(true);
          setModelsLoaded(true);
          return;
        }

        if (!window.faceapi) {
          const script = document.createElement("script");
          script.src =
            "https://cdn.jsdelivr.net/npm/@vladmandic/face-api@1.7.12/dist/face-api.js";
          script.async = true;
          await new Promise((resolve, reject) => {
            script.onload = resolve;
            script.onerror = reject;
            document.head.appendChild(script);
          });
        }

        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

        await window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
        await window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);

        setFaceApiReady(true);
        setModelsLoaded(true);
      } catch (err) {
        console.error("face-api load error", err);
        setCameraError("Could not load face detection: " + err.message);
      }
    };

    if (!modelsLoaded && !faceApiReady) loadFaceApi();

    timeoutId = setTimeout(() => {
      if (!modelsLoaded) {
        setCameraError("Face detection is taking too long. Please refresh.");
      }
    }, 20000);

    return () => {
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, [modelsLoaded, faceApiReady, setCameraError]);

  // Camera initialization
  useEffect(() => {
    if (isOpen && !cameraAccessGranted && !isCapturing) {
      startCamera();
    }
    return () => {
      if (detectionIntervalRef.current)
        clearInterval(detectionIntervalRef.current);
    };
  }, [isOpen, cameraAccessGranted, isCapturing, startCamera]);

  // Angle instructions
  useEffect(() => {
    setAngleInstructions(angles[currentAngleIndex].description);
  }, [currentAngleIndex]);

  // Auto capture trigger
  useEffect(() => {
    if (
      cameraAccessGranted &&
      !isAutoCapturing &&
      modelsLoaded &&
      faceApiReady
    ) {
      setTimeout(() => startAutoCapture(), 800);
    }
  }, [cameraAccessGranted, modelsLoaded, faceApiReady]);

  // Head angles calculation
  const getHeadAngles = (landmarks) => {
    if (!landmarks || landmarks.length < 46) return null;

    const nose = landmarks[30];
    const leftEye = landmarks[36];
    const rightEye = landmarks[45];

    if (!nose || !leftEye || !rightEye) return null;

    const eyeCenterX = (leftEye.x + rightEye.x) / 2;
    const eyeCenterY = (leftEye.y + rightEye.y) / 2;

    const eyeDist = Math.hypot(rightEye.x - leftEye.x, rightEye.y - leftEye.y);
    if (!eyeDist) return null;

    const nx = (nose.x - eyeCenterX) / eyeDist;
    const ny = (nose.y - eyeCenterY) / eyeDist;

    const yawDeg = nx * 40;
    const pitchDeg = (ny - 0.5) * 60;

    return { yaw: yawDeg, pitch: pitchDeg };
  };

  const checkHeadPosition = (detection, angleKey) => {
    const landmarks = detection.landmarks.positions;
    const ang = getHeadAngles(landmarks);
    if (!ang) return false;

    const { yaw, pitch } = ang;

    const msg = `[${angleKey}] yaw=${yaw.toFixed(1)}°, pitch=${pitch.toFixed(
      1
    )}°`;
    console.log(msg);
    setDebugInfo(msg);

    const FRONT_MAX_YAW = 6;
    const FRONT_MAX_PITCH = 6;

    const LEFT_MIN_YAW = -8;
    const LEFT_MAX_YAW = -35;
    const LEFT_MIN_PITCH = -10;
    const LEFT_MAX_PITCH = 35;

    const RIGHT_MIN_YAW = 8;
    const RIGHT_MAX_YAW = 35;
    const RIGHT_MIN_PITCH = -10;
    const RIGHT_MAX_PITCH = 35;

    const UP_MAX_PITCH = -8;

    switch (angleKey) {
      case "front":
        return (
          Math.abs(yaw) <= FRONT_MAX_YAW && Math.abs(pitch) <= FRONT_MAX_PITCH
        );

      case "left":
        return (
          yaw <= LEFT_MIN_YAW &&
          yaw >= LEFT_MAX_YAW &&
          pitch >= LEFT_MIN_PITCH &&
          pitch <= LEFT_MAX_PITCH
        );

      case "right":
        return (
          yaw >= RIGHT_MIN_YAW &&
          yaw <= RIGHT_MAX_YAW &&
          pitch >= RIGHT_MIN_PITCH &&
          pitch <= RIGHT_MAX_PITCH
        );

      case "up":
        return pitch <= UP_MAX_PITCH && Math.abs(yaw) < 18;

      default:
        return false;
    }
  };

  const waitForCorrectPosition = (angleKey) => {
    return new Promise((resolve) => {
      let correct = 0;
      const required = 4;
      let last = Date.now();

      const check = async () => {
        if (cancelled) return;

        const now = Date.now();
        if (now - last < 120) return;
        last = now;

        if (!videoRef.current || !window.faceapi || !faceApiReady) return;

        try {
          const detections = await window.faceapi
            .detectAllFaces(
              videoRef.current,
              new window.faceapi.TinyFaceDetectorOptions({
                inputSize: 320,
                scoreThreshold: 0.5,
              })
            )
            .withFaceLandmarks();

          if (!detections.length) {
            setFaceDetected(false);
            correct = 0;
            return;
          }

          setFaceDetected(true);
          const det = detections[0];
          const ok = checkHeadPosition(det, angleKey);

          setHeadPosition({
            isCorrect: ok,
            angle: angleKey,
          });

          if (ok) {
            correct++;
            if (correct >= required) {
              if (detectionIntervalRef.current)
                clearInterval(detectionIntervalRef.current);
              resolve();
            }
          } else {
            correct = 0;
          }
        } catch (e) {
          console.error("waitForCorrectPosition error", e);
        }
      };

      detectionIntervalRef.current = setInterval(check, 120);
      check();
    });
  };

  // Auto capture sequence
  const startAutoCapture = async () => {
    if (!cameraAccessGranted || !videoRef.current) return;

    setCancelled(false);
    setIsAutoCapturing(true);

    for (let i = 0; i < angles.length; i++) {
      if (cancelled) break;
      const angle = angles[i];
      setCurrentAngleIndex(i);

      await waitForCorrectPosition(angle.key);
      if (cancelled) break;

      try {
        const video = videoRef.current;
        if (!cameraAccessGranted) throw new Error("Camera not granted");
        if (!video || !video.srcObject)
          throw new Error("Camera not initialized");

        const result = await captureWithFaceDetection(angle.key);
        if (!result) {
          setIsAutoCapturing(false);
          return;
        }

        Swal.fire({
          icon: "success",
          title: "Captured!",
          text: `${angle.label} captured successfully`,
          timer: 1200,
          showConfirmButton: false,
          position: isMobile ? "top" : "top-end",
          toast: isMobile ? false : true,
        });
      } catch (err) {
        console.error("capture error", err);
        if (String(err.message || "").includes("Camera not")) {
          setIsAutoCapturing(false);
          return;
        }
        i--;
      }

      if (i < angles.length - 1) {
        await new Promise((r) => setTimeout(r, 800));
      }
    }

    setIsAutoCapturing(false);
  };

  // Vertical oval overlay with BLUR effect
  useEffect(() => {
    if (!cameraAccessGranted) return;

    const drawOverlay = () => {
      const video = videoRef.current;
      const canvas = faceCanvasRef.current;
      if (!video || !canvas) {
        animationFrameRef.current = requestAnimationFrame(drawOverlay);
        return;
      }

      const w = video.offsetWidth;
      const h = video.offsetHeight;
      if (!w || !h) {
        animationFrameRef.current = requestAnimationFrame(drawOverlay);
        return;
      }

      if (canvas.width !== w || canvas.height !== h) {
        canvas.width = w;
        canvas.height = h;
      }

      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, w, h);

      const cx = w / 2;
      const cy = h / 2;

      // Adjust oval size for mobile
      const rx = w * (isMobile ? 0.28 : 0.22);
      const ry = h * (isMobile ? 0.35 : 0.4);

      const color = headPosition?.isCorrect
        ? "#10B981"
        : faceDetected
        ? "#F59E0B"
        : "#9CA3AF";

      // Draw semi-transparent dark overlay everywhere (blur effect)
      ctx.fillStyle = "rgba(0, 0, 0, 0.65)";
      ctx.fillRect(0, 0, w, h);

      // Cut out the oval (make it transparent - this creates the focus area)
      ctx.globalCompositeOperation = "destination-out";
      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.fill();

      // Reset to draw the border on top
      ctx.globalCompositeOperation = "source-over";

      // Draw glowing oval border
      ctx.strokeStyle = color;
      ctx.lineWidth = isMobile ? 3 : 4;
      ctx.shadowBlur = isMobile ? 15 : 20;
      ctx.shadowColor = color;

      ctx.beginPath();
      ctx.ellipse(cx, cy, rx, ry, 0, 0, Math.PI * 2);
      ctx.stroke();

      // Add inner subtle glow when correct position
      if (headPosition?.isCorrect) {
        ctx.shadowBlur = 0;
        ctx.strokeStyle = "rgba(16, 185, 129, 0.3)";
        ctx.lineWidth = isMobile ? 2 : 3;
        ctx.stroke();
      }

      // Add subtle fill inside oval
      ctx.shadowBlur = 0;
      ctx.fillStyle = headPosition?.isCorrect
        ? "rgba(16,185,129,0.08)"
        : "rgba(148,163,184,0.04)";
      ctx.fill();

      animationFrameRef.current = requestAnimationFrame(drawOverlay);
    };

    animationFrameRef.current = requestAnimationFrame(drawOverlay);
    return () => {
      if (animationFrameRef.current)
        cancelAnimationFrame(animationFrameRef.current);
    };
  }, [cameraAccessGranted, headPosition, faceDetected, isMobile]);

  // Close and complete handlers
  const handleClose = () => {
    setCancelled(true);
    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    stopCamera();
    clearAllImages();
    setCurrentAngleIndex(0);
    setIsAutoCapturing(false);
    onClose();
  };

  const handleComplete = () => {
    setCancelled(true);
    stopCamera();
    if (detectionIntervalRef.current)
      clearInterval(detectionIntervalRef.current);
    if (animationFrameRef.current)
      cancelAnimationFrame(animationFrameRef.current);
    onComplete(capturedImages);
  };

  if (!isOpen) return null;
  const allCaptured = Object.values(capturedImages).every(
    (img) => img !== null
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[95vh] sm:max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b sticky top-0 bg-white z-20">
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center gap-2">
              {isMobile && (
                <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0" />
              )}
              <h2 className="text-lg sm:text-2xl font-bold text-gray-800 truncate">
                Exam Verification
              </h2>
            </div>
            <p className="text-xs sm:text-sm text-gray-600 mt-1">
              Position your face within the frame
            </p>
          </div>
          <button
            onClick={handleClose}
            className="btn btn-sm sm:btn-md btn-circle btn-ghost flex-shrink-0"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Body */}
        <div className="p-3 sm:p-6 space-y-3 sm:space-y-4">
          {/* Mobile Instructions Banner */}
          {isMobile && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-xs text-blue-800">
                  <strong>Mobile Tip:</strong> Hold your device steady and
                  rotate your head (not your phone) for different angles.
                </div>
              </div>
            </div>
          )}

          {cameraError && (
            <div className="alert alert-error text-sm">
              <AlertCircle className="w-5 h-5 flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <span className="text-xs sm:text-sm">{cameraError}</span>
              </div>
              <button
                onClick={startCamera}
                className="btn btn-sm btn-outline flex-shrink-0"
              >
                Retry
              </button>
            </div>
          )}

          {/* Steps Progress */}
          <div className="flex gap-1.5 sm:gap-2 justify-between mb-2">
            {angles.map((angle, idx) => (
              <div key={angle.key} className="flex-1 text-center">
                <div
                  className={`h-1.5 sm:h-2 rounded-full mb-1.5 sm:mb-2 ${
                    capturedImages[angle.key]
                      ? "bg-green-500"
                      : idx === currentAngleIndex
                      ? "bg-blue-500 animate-pulse"
                      : "bg-gray-300"
                  }`}
                />
                <p className="text-[10px] sm:text-xs font-medium truncate">
                  {isMobile ? angle.key.toUpperCase() : angle.label}
                </p>
              </div>
            ))}
          </div>

          {/* Video Container */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-h-[50vh] sm:max-h-[400px]">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            <canvas
              ref={faceCanvasRef}
              className="absolute inset-0 w-full h-full"
              style={{ pointerEvents: "none" }}
            />
            <canvas ref={canvasRef} className="hidden" />

            {/* Debug Info */}
            {debugInfo && !isMobile && (
              <div className="absolute top-2 left-2 bg-black/75 text-white text-xs px-2 py-1 rounded font-mono z-10">
                {debugInfo}
              </div>
            )}

            {/* Loading Overlay */}
            {!modelsLoaded && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900/80 text-white z-30">
                <div className="text-center p-4">
                  <div className="loading loading-spinner loading-lg mb-2"></div>
                  <p className="font-semibold text-sm sm:text-base">
                    Loading face detection…
                  </p>
                </div>
              </div>
            )}

            {/* Instruction Overlay */}
            {isAutoCapturing && modelsLoaded && (
              <div
                className={`absolute ${
                  isMobile
                    ? "bottom-2 left-2 right-2"
                    : "bottom-4 left-4 right-4"
                } text-white text-center rounded-lg px-3 py-2 sm:px-4 sm:py-3 z-20 ${
                  headPosition?.isCorrect
                    ? "bg-green-600"
                    : faceDetected
                    ? "bg-orange-500"
                    : "bg-red-500"
                }`}
              >
                <p className="font-semibold text-sm sm:text-lg">
                  {angles[currentAngleIndex].label}
                </p>
                <p className="text-xs sm:text-sm mt-0.5">
                  {faceDetected
                    ? headPosition?.isCorrect
                      ? "Hold still, capturing…"
                      : angleInstructions
                    : "Face not detected – center your face in the oval"}
                </p>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 sm:p-4">
            <h3 className="font-semibold text-blue-900 mb-1 text-sm sm:text-base">
              Instructions
            </h3>
            <ul className="text-xs sm:text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Align your face inside the vertical oval frame.</li>
              <li>Follow the prompts: FRONT, LEFT, RIGHT, then UP.</li>
              <li>Keep your head steady when the border turns green.</li>
              <li>Photos are captured automatically for each angle.</li>
            </ul>
          </div>

          {/* Previews */}
          {allCaptured && (
            <div
              className={`grid ${
                isMobile ? "grid-cols-2" : "grid-cols-4"
              } gap-2`}
            >
              {angles.map((angle) => (
                <div key={angle.key} className="text-center">
                  <img
                    src={capturedImages[angle.key].url}
                    alt={angle.label}
                    className="w-full h-20 sm:h-24 object-cover rounded-lg border-2 border-green-500"
                  />
                  <p className="text-[10px] sm:text-xs font-medium mt-1 flex items-center justify-center gap-1">
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4 text-green-500" />
                    <span className="truncate">
                      {isMobile ? angle.key : angle.label}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Buttons */}
          <div className="flex gap-2 sm:gap-3 pt-2">
            <button
              onClick={handleClose}
              className="btn btn-sm sm:btn-md btn-outline flex-1"
            >
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={!allCaptured}
              className="btn btn-sm sm:btn-md btn-primary flex-1 text-white disabled:opacity-50"
            >
              {allCaptured ? "Continue" : "Capturing…"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamCaptureModal;
