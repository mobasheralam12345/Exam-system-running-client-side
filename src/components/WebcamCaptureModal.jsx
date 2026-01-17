import React, { useState, useEffect, useRef } from "react";
import { X, AlertCircle, CheckCircle } from "lucide-react";
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
  const faceCanvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);

  const angles = [
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
    { key: "down", label: "Look DOWN", description: "Look downward" },
  ];

  // Load face-api library
  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        // Load face-api models
        const script = document.createElement("script");
        script.src =
          "https://cdn.jsdelivr.net/npm/face-api.js@0.22.2/dist/face-api.min.js";
        document.head.appendChild(script);
      } catch (error) {
        console.error("Error loading face-api:", error);
      }
    };

    loadFaceApi();
  }, []);

  // Initialize camera
  useEffect(() => {
    if (isOpen && !cameraAccessGranted && !isCapturing) {
      startCamera();
    }

    return () => {
      if (detectionIntervalRef.current) {
        clearInterval(detectionIntervalRef.current);
      }
    };
  }, [isOpen]);

  // Update angle instructions
  useEffect(() => {
    setAngleInstructions(angles[currentAngleIndex].description);
  }, [currentAngleIndex]);

  // Start auto-capture sequence
  useEffect(() => {
    if (cameraAccessGranted && !isAutoCapturing) {
      startAutoCapture();
    }
  }, [cameraAccessGranted]);

  const startAutoCapture = async () => {
    setIsAutoCapturing(true);

    for (let i = 0; i < angles.length; i++) {
      setCurrentAngleIndex(i);

      // Wait for face to be in correct position
      await waitForCorrectPosition(angles[i].key);

      // Capture image
      try {
        await captureWithFaceDetection(angles[i].key);
        Swal.fire({
          icon: "success",
          title: "Captured!",
          text: `${angles[i].label} captured successfully`,
          timer: 1500,
          showConfirmButton: false,
          position: "top",
        });
      } catch (error) {
        console.error("Capture error:", error);
        Swal.fire({
          icon: "error",
          title: "Capture Failed",
          text: `Failed to capture ${angles[i].label}. Please try again.`,
          confirmButtonColor: "#EF4444",
        });
        i--; // Retry this angle
      }

      // Wait between captures
      if (i < angles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    setIsAutoCapturing(false);
  };

  const waitForCorrectPosition = (angle) => {
    return new Promise((resolve) => {
      let correctPositionCount = 0;
      const requiredCount = 10; // Require 10 consecutive frames in correct position

      const checkPosition = async () => {
        if (!videoRef.current || !window.faceapi) {
          return;
        }

        try {
          const detections = await window.faceapi
            .detectAllFaces(videoRef.current)
            .withFaceLandmarks()
            .withFaceExpressions();

          if (detections.length === 0) {
            setFaceDetected(false);
            correctPositionCount = 0;
            return;
          }

          setFaceDetected(true);
          const detection = detections[0];
          const isCorrectPosition = checkHeadPosition(detection, angle);

          setHeadPosition({
            isCorrect: isCorrectPosition,
            landmarks: detection.landmarks,
          });

          if (isCorrectPosition) {
            correctPositionCount++;
            if (correctPositionCount >= requiredCount) {
              clearInterval(detectionIntervalRef.current);
              resolve();
            }
          } else {
            correctPositionCount = 0;
          }
        } catch (error) {
          console.error("Face detection error:", error);
        }
      };

      detectionIntervalRef.current = setInterval(checkPosition, 100);
      checkPosition();
    });
  };

  const checkHeadPosition = (detection, angle) => {
    const landmarks = detection.landmarks.positions;
    if (!landmarks || landmarks.length < 2) return false;

    // Get facial landmarks for position calculation
    const nose = landmarks[30]; // Nose tip
    const leftEye = landmarks[36]; // Left eye
    const rightEye = landmarks[45]; // Right eye

    if (!nose || !leftEye || !rightEye) return false;

    // Calculate head position based on eye and nose alignment
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    const noseToLeftEye = nose.x - leftEye.x;
    const noseToRightEye = rightEye.x - nose.x;

    // Horizontal position (left/right)
    const horizontalRatio = noseToLeftEye / eyeDistance;
    // Vertical position (up/down)
    const verticalRatio = (nose.y - (leftEye.y + rightEye.y) / 2) / eyeDistance;

    switch (angle) {
      case "left":
        return horizontalRatio > 0.55; // Nose closer to right eye
      case "right":
        return horizontalRatio < 0.45; // Nose closer to left eye
      case "up":
        return verticalRatio < -0.1; // Nose above eye level
      case "down":
        return verticalRatio > 0.1; // Nose below eye level
      default:
        return false;
    }
  };

  // Draw face detection visualization
  useEffect(() => {
    const drawFaceOval = async () => {
      if (
        !videoRef.current ||
        !faceCanvasRef.current ||
        !window.faceapi ||
        !cameraAccessGranted
      ) {
        return;
      }

      try {
        const detections = await window.faceapi
          .detectAllFaces(videoRef.current)
          .withFaceLandmarks();

        const ctx = faceCanvasRef.current.getContext("2d");
        const video = videoRef.current;

        // Clear canvas
        ctx.clearRect(
          0,
          0,
          faceCanvasRef.current.width,
          faceCanvasRef.current.height
        );

        // Set canvas size to match video
        faceCanvasRef.current.width = video.videoWidth;
        faceCanvasRef.current.height = video.videoHeight;

        if (detections.length > 0) {
          const detection = detections[0];
          const landmarks = detection.landmarks.positions;

          // Draw face oval
          const minX = Math.min(...landmarks.map((p) => p.x));
          const maxX = Math.max(...landmarks.map((p) => p.x));
          const minY = Math.min(...landmarks.map((p) => p.y));
          const maxY = Math.max(...landmarks.map((p) => p.y));

          const centerX = (minX + maxX) / 2;
          const centerY = (minY + maxY) / 2;
          const radiusX = (maxX - minX) / 2 + 20;
          const radiusY = (maxY - minY) / 2 + 40;

          // Draw oval border
          ctx.strokeStyle = faceDetected ? "#10B981" : "#EF4444";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
          ctx.stroke();

          // Draw direction indicator
          if (headPosition?.isCorrect) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
            ctx.fill();
          }
        }
      } catch (error) {
        console.error("Face drawing error:", error);
      }

      requestAnimationFrame(drawFaceOval);
    };

    if (cameraAccessGranted) {
      drawFaceOval();
    }
  }, [cameraAccessGranted, faceDetected, headPosition]);

  const handleClose = () => {
    stopCamera();
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    clearAllImages();
    setCurrentAngleIndex(0);
    onClose();
  };

  const handleComplete = () => {
    stopCamera();
    if (detectionIntervalRef.current) {
      clearInterval(detectionIntervalRef.current);
    }
    onComplete(capturedImages);
  };

  if (!isOpen) return null;

  const allCaptured = Object.values(capturedImages).every(
    (img) => img !== null
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b sticky top-0 bg-white">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Exam Verification
            </h2>
            <p className="text-sm text-gray-600 mt-1">
              Capture your face from four angles for monitoring
            </p>
          </div>
          <button onClick={handleClose} className="btn btn-circle btn-ghost">
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {cameraError && (
            <div className="alert alert-error">
              <AlertCircle className="w-5 h-5" />
              <div className="flex-1">
                <span>{cameraError}</span>
                <button
                  onClick={startCamera}
                  className="btn btn-sm btn-outline ml-4"
                >
                  Retry Camera
                </button>
              </div>
            </div>
          )}

          {/* Progress Steps */}
          <div className="flex gap-2 justify-between mb-4">
            {angles.map((angle, idx) => (
              <div key={angle.key} className="flex-1 text-center">
                <div
                  className={`h-2 rounded-full mb-2 transition-all ${
                    capturedImages[angle.key]
                      ? "bg-green-500"
                      : idx === currentAngleIndex
                      ? "bg-blue-500"
                      : "bg-gray-300"
                  }`}
                />
                <p className="text-xs font-medium">{angle.label}</p>
              </div>
            ))}
          </div>

          {/* Video Feed with Face Detection */}
          <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
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
            />

            {/* Status Overlay */}
            {isAutoCapturing && (
              <div className="absolute bottom-4 left-4 right-4 bg-blue-600 text-white rounded-lg p-4 text-center">
                <p className="font-semibold text-lg mb-2">
                  {angleInstructions}
                </p>
                <p className="text-sm">
                  {faceDetected
                    ? headPosition?.isCorrect
                      ? "✓ Position correct - Capturing..."
                      : "Adjust your head position..."
                    : "Face not detected"}
                </p>
              </div>
            )}

            {!cameraAccessGranted && !isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white z-10">
                <div className="text-center p-4">
                  <p className="mb-4 text-lg font-semibold">
                    Camera access required
                  </p>
                  <button
                    onClick={startCamera}
                    disabled={isCapturing}
                    className="btn btn-primary text-white disabled:opacity-50"
                  >
                    {isCapturing ? "Starting Camera..." : "Enable Camera"}
                  </button>
                </div>
              </div>
            )}

            {isCapturing && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white z-10">
                <div className="text-center">
                  <div className="loading loading-spinner loading-lg"></div>
                  <p className="mt-2">Starting camera...</p>
                </div>
              </div>
            )}
          </div>

          {/* Instructions */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-semibold text-blue-900 mb-2">Instructions:</h3>
            <ul className="text-sm text-blue-800 space-y-1 list-disc list-inside">
              <li>Position your face within the oval border</li>
              <li>Follow the on-screen instructions for head movements</li>
              <li>Keep good lighting and clear view of your face</li>
              <li>
                Photos will be captured automatically when in correct position
              </li>
            </ul>
          </div>

          {/* Captured Images Preview */}
          {allCaptured && (
            <div className="grid grid-cols-4 gap-2">
              {angles.map((angle) => (
                <div key={angle.key} className="text-center">
                  <img
                    src={capturedImages[angle.key].url}
                    alt={angle.label}
                    className="w-full h-24 object-cover rounded-lg border-2 border-green-500"
                  />
                  <p className="text-xs font-medium mt-1">
                    <CheckCircle className="w-4 h-4 text-green-500 inline mr-1" />
                    {angle.label}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button onClick={handleClose} className="btn btn-outline flex-1">
              Cancel
            </button>
            <button
              onClick={handleComplete}
              disabled={!allCaptured}
              className="btn btn-primary flex-1 text-white disabled:opacity-50"
            >
              {allCaptured ? "Continue" : "Capturing..."}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WebcamCaptureModal;
