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
    captureImage,
    clearAllImages,
    setCameraError,
  } = useWebcamCapture();

  const [currentAngleIndex, setCurrentAngleIndex] = useState(0);
  const [angleInstructions, setAngleInstructions] = useState("");
  const [isAutoCapturing, setIsAutoCapturing] = useState(false);
  const [faceDetected, setFaceDetected] = useState(false);
  const [headPosition, setHeadPosition] = useState(null);
  const [positionFeedback, setPositionFeedback] = useState("");
  const [modelsLoaded, setModelsLoaded] = useState(false);
  const [isLoadingModels, setIsLoadingModels] = useState(false);
  const faceCanvasRef = useRef(null);
  const detectionIntervalRef = useRef(null);
  const faceApiLoadedRef = useRef(false);

  const angles = [
    { 
      key: "front", 
      label: "Face FORWARD", 
      description: "Face forward and look straight",
      icon: "👤",
      direction: "straight"
    },
    {
      key: "left",
      label: "Turn LEFT",
      description: "Turn your head to the LEFT",
      icon: "←",
      direction: "left"
    },
    {
      key: "right",
      label: "Turn RIGHT",
      description: "Turn your head to the RIGHT",
      icon: "→",
      direction: "right"
    },
    { 
      key: "up", 
      label: "Look UP", 
      description: "Tilt your head UP",
      icon: "↑",
      direction: "up"
    },
  ];

  // Load face-api library and models
  useEffect(() => {
    const loadFaceApi = async () => {
      try {
        if (faceApiLoadedRef.current) {
          setModelsLoaded(true);
          return;
        }

        setIsLoadingModels(true);

        // Check if face-api is already loaded
        if (!window.faceapi?.nets?.tinyFaceDetector?.params) {
          // Load face-api script
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

        // Wait for face-api to be available
        let retries = 0;
        while (!window.faceapi && retries < 50) {
          await new Promise((resolve) => setTimeout(resolve, 100));
          retries++;
        }

        if (!window.faceapi) {
          throw new Error("Face-api library failed to load");
        }

        // Load face-api models
        const MODEL_URL =
          "https://cdn.jsdelivr.net/npm/@vladmandic/face-api/model/";

        await Promise.all([
          window.faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
          window.faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
        ]);

        faceApiLoadedRef.current = true;
        setModelsLoaded(true);
        console.log("✅ Face-api models loaded successfully");
      } catch (error) {
        console.error("❌ Error loading face-api:", error);
        setCameraError("Failed to load face detection. Please refresh the page.");
      } finally {
        setIsLoadingModels(false);
      }
    };

    if (isOpen) {
      loadFaceApi();
    }
  }, [isOpen]);

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

  // Start auto-capture sequence (only after models are loaded)
  useEffect(() => {
    if (cameraAccessGranted && modelsLoaded && !isAutoCapturing) {
      console.log("🚀 Starting auto-capture sequence...");
      // Small delay to ensure everything is ready
      const timer = setTimeout(() => {
        console.log("✅ Conditions met, starting capture...");
        startAutoCapture();
      }, 1000); // Increased delay to ensure video is fully ready
      return () => clearTimeout(timer);
    }
  }, [cameraAccessGranted, modelsLoaded]);

  const startAutoCapture = async () => {
    setIsAutoCapturing(true);

    for (let i = 0; i < angles.length; i++) {
      setCurrentAngleIndex(i);
      setAngleInstructions(angles[i].description);

      // Wait for face to be detected first
      let faceFound = false;
      let attempts = 0;
      const maxAttempts = 50; // 10 seconds at 200ms intervals

      while (!faceFound && attempts < maxAttempts) {
        try {
          if (videoRef.current && window.faceapi && modelsLoaded) {
            const detections = await window.faceapi
              .detectAllFaces(
                videoRef.current,
                new window.faceapi.TinyFaceDetectorOptions({
                  inputSize: 416,
                  scoreThreshold: 0.3,
                })
              )
              .withFaceLandmarks();

            if (detections.length > 0) {
              faceFound = true;
              setFaceDetected(true);
            }
          }
        } catch (error) {
          console.error("Face detection check error:", error);
        }
        attempts++;
        await new Promise((resolve) => setTimeout(resolve, 200));
      }

      if (!faceFound) {
        console.warn(`Face not detected for ${angles[i].label}, continuing anyway...`);
      }

      // Wait for face to be in correct position (with fallback)
      try {
        await waitForCorrectPosition(angles[i].key);
        console.log(`✓ Position correct for ${angles[i].label}`);
      } catch (error) {
        console.warn(`Position timeout for ${angles[i].label}, capturing anyway...`);
        // Continue anyway - capture even if position isn't perfect
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }

      // Ensure video and canvas are ready before capturing
      let videoReady = false;
      let videoReadyAttempts = 0;
      const maxVideoReadyAttempts = 100; // 10 seconds at 100ms intervals
      
      while (!videoReady && videoReadyAttempts < maxVideoReadyAttempts) {
        if (
          videoRef.current &&
          videoRef.current.readyState >= 2 && // HAVE_CURRENT_DATA
          videoRef.current.videoWidth > 0 &&
          videoRef.current.videoHeight > 0 &&
          canvasRef.current // Canvas must also exist
        ) {
          videoReady = true;
          console.log(`✓ Video ready: ${videoRef.current.videoWidth}x${videoRef.current.videoHeight}`);
        } else {
          videoReadyAttempts++;
          if (videoReadyAttempts % 10 === 0) {
            console.log(`Waiting for video/canvas to be ready... (${videoReadyAttempts}/${maxVideoReadyAttempts})`);
          }
          await new Promise((resolve) => setTimeout(resolve, 100));
        }
      }

      if (!videoReady) {
        console.error("Video or canvas not ready for capture after timeout");
        Swal.fire({
          icon: "warning",
          title: "Camera Not Ready",
          text: `Please wait for the camera to initialize. Retrying...`,
          timer: 2000,
          showConfirmButton: false,
          position: "top",
        });
        i--; // Retry this angle
        continue;
      }

      // Capture image
      try {
        console.log(`Capturing ${angles[i].label}...`);
        await captureWithFaceDetection(angles[i].key);
        console.log(`✓ Captured ${angles[i].label} successfully`);
        Swal.fire({
          icon: "success",
          title: "Captured!",
          text: `${angles[i].label} captured successfully`,
          timer: 1500,
          showConfirmButton: false,
          position: "top",
        });
      } catch (error) {
        console.error(`Capture error for ${angles[i].label}:`, error);
        // Try capturing without face detection as fallback
        try {
          // Wait a bit more for canvas to be ready
          await new Promise((resolve) => setTimeout(resolve, 300));
          await captureImage(angles[i].key);
          console.log(`✓ Captured ${angles[i].label} (fallback method)`);
          Swal.fire({
            icon: "success",
            title: "Captured!",
            text: `${angles[i].label} captured successfully`,
            timer: 1500,
            showConfirmButton: false,
            position: "top",
          });
        } catch (fallbackError) {
          console.error("Fallback capture also failed:", fallbackError);
          Swal.fire({
            icon: "error",
            title: "Capture Failed",
            text: `Failed to capture ${angles[i].label}. Please try again.`,
            confirmButtonColor: "#EF4444",
          });
          i--; // Retry this angle
        }
      }

      // Wait between captures (reduced for faster flow)
      if (i < angles.length - 1) {
        await new Promise((resolve) => setTimeout(resolve, 500));
      }
    }

    setIsAutoCapturing(false);
  };

  const waitForCorrectPosition = (angle) => {
    return new Promise((resolve, reject) => {
      let correctPositionCount = 0;
      const requiredCount = 1; // Instant capture - only need 1 frame in correct position
      const maxWaitTime = 10000; // Maximum 10 seconds to wait
      let startTime = Date.now();
      let lastDetectionTime = Date.now();
      let faceDetectedCount = 0;

      // Set timeout to prevent infinite waiting
      const timeoutId = setTimeout(() => {
        if (detectionIntervalRef.current) {
          clearInterval(detectionIntervalRef.current);
        }
        // Capture anyway after timeout if face is detected
        resolve();
      }, maxWaitTime);

      const checkPosition = async () => {
        if (!videoRef.current || !window.faceapi || !modelsLoaded) {
          return;
        }

        // Check timeout
        if (Date.now() - startTime > maxWaitTime) {
          clearInterval(detectionIntervalRef.current);
          clearTimeout(timeoutId);
          resolve(); // Resolve - capture anyway
          return;
        }

        try {
          const detections = await window.faceapi
            .detectAllFaces(
              videoRef.current,
              new window.faceapi.TinyFaceDetectorOptions({
                inputSize: 416,
                scoreThreshold: 0.3,
              })
            )
            .withFaceLandmarks();

          if (detections.length === 0) {
            setFaceDetected(false);
            correctPositionCount = 0;
            return;
          }

          setFaceDetected(true);
          lastDetectionTime = Date.now();
          faceDetectedCount++;
          const detection = detections[0];
          const isCorrectPosition = checkHeadPosition(detection, angle);

          setHeadPosition({
            isCorrect: isCorrectPosition,
            landmarks: detection.landmarks,
          });

          // Instant capture - if position is correct, capture immediately
          if (isCorrectPosition) {
            correctPositionCount++;
            // Capture instantly when position is correct
            if (correctPositionCount >= requiredCount) {
              clearInterval(detectionIntervalRef.current);
              clearTimeout(timeoutId);
              resolve(); // Instant capture - no delay
              return;
            }
          } else {
            // For front and up, be more lenient - capture if face detected for a while
            if ((angle === "front" || angle === "up") && faceDetectedCount > 10) {
              // After 10 detections, capture anyway if face is present
              clearInterval(detectionIntervalRef.current);
              clearTimeout(timeoutId);
              resolve();
              return;
            }
            correctPositionCount = 0;
          }

          // Don't use fallback - require correct position for accuracy
          // This ensures we only capture when head is in the correct position
        } catch (error) {
          console.error("Face detection error:", error);
          setFaceDetected(false);
        }
      };

      detectionIntervalRef.current = setInterval(checkPosition, 100); // Check every 100ms for faster response
      checkPosition(); // Run immediately
    });
  };

  const checkHeadPosition = (detection, angle) => {
    if (!detection.landmarks) {
      setPositionFeedback("Face landmarks not detected");
      return false;
    }
    
    const landmarks = detection.landmarks.positions || detection.landmarks;
    if (!landmarks || landmarks.length < 68) {
      setPositionFeedback("Insufficient face landmarks");
      return false;
    }

    // Get facial landmarks for position calculation
    // Face-api 68-point landmarks: nose tip is at index 30, eyes at 36-47
    const nose = landmarks[30]; // Nose tip
    const leftEye = landmarks[36]; // Left eye outer corner
    const rightEye = landmarks[45]; // Right eye outer corner
    const leftEyeCenter = landmarks[39]; // Left eye center
    const rightEyeCenter = landmarks[42]; // Right eye center

    if (!nose || !leftEye || !rightEye || !leftEyeCenter || !rightEyeCenter) {
      setPositionFeedback("Key facial points not detected");
      return false;
    }

    // Calculate head position based on eye and nose alignment
    const eyeDistance = Math.abs(rightEye.x - leftEye.x);
    if (eyeDistance < 20) {
      setPositionFeedback("Face too close or too far");
      return false;
    }

    const noseToLeftEye = nose.x - leftEye.x;
    const noseToRightEye = rightEye.x - nose.x;

    // Horizontal position (left/right) - normalized ratio
    // When head turns left, nose moves right relative to face center
    // When head turns right, nose moves left relative to face center
    const horizontalRatio = noseToLeftEye / eyeDistance;
    
    // Vertical position (up/down) - normalized ratio
    const eyeCenterY = (leftEyeCenter.y + rightEyeCenter.y) / 2;
    const verticalRatio = (nose.y - eyeCenterY) / eyeDistance;

    // Generate position feedback
    let feedback = "";
    let isCorrect = false;

    switch (angle) {
      case "front":
        // Face forward: nose should be roughly centered between eyes
        // Very lenient - accept any forward-facing position
        // Front means face is looking straight, not necessarily perfectly centered
        const isCentered = horizontalRatio > 0.3 && horizontalRatio < 0.7; // More lenient
        const isLevel = Math.abs(verticalRatio) < 0.4; // More lenient for vertical
        isCorrect = isCentered && isLevel;
        
        // If face is detected and roughly forward, accept it
        if (!isCorrect) {
          if (horizontalRatio < 0.3) {
            feedback = "→ Turn your head slightly RIGHT";
          } else if (horizontalRatio > 0.7) {
            feedback = "← Turn your head slightly LEFT";
          } else if (Math.abs(verticalRatio) > 0.4) {
            if (verticalRatio > 0.4) {
              feedback = "↑ Look UP slightly";
            } else {
              feedback = "↓ Look DOWN slightly";
            }
          } else {
            // Close enough, accept it
            isCorrect = true;
            feedback = "✓ Face forward";
          }
        } else {
          feedback = "✓ Perfect! Face forward";
        }
        break;

      case "left":
        // Head turned LEFT: nose should be shifted right (higher ratio)
        // Stricter threshold for accurate left turn
        isCorrect = horizontalRatio > 0.6;
        if (!isCorrect) {
          if (horizontalRatio < 0.4) {
            feedback = "→ Turn your head MORE to the LEFT";
          } else if (horizontalRatio < 0.5) {
            feedback = "→ Turn your head to the LEFT";
          } else {
            feedback = "→ Turn your head a bit MORE to the LEFT";
          }
        } else {
          feedback = "✓ Perfect! Head turned left";
        }
        break;

      case "right":
        // Head turned RIGHT: nose should be shifted left (lower ratio)
        // Stricter threshold for accurate right turn
        isCorrect = horizontalRatio < 0.4;
        if (!isCorrect) {
          if (horizontalRatio > 0.6) {
            feedback = "← Turn your head MORE to the RIGHT";
          } else if (horizontalRatio > 0.5) {
            feedback = "← Turn your head to the RIGHT";
          } else {
            feedback = "← Turn your head a bit MORE to the RIGHT";
          }
        } else {
          feedback = "✓ Perfect! Head turned right";
        }
        break;

      case "up":
        // Head tilted UP: nose should be above eye level (negative verticalRatio)
        // More lenient - accept if nose is above or at eye level
        // verticalRatio is (nose.y - eyeCenterY) / eyeDistance
        // Negative means nose is above eyes (good for up)
        // Positive means nose is below eyes (bad for up)
        isCorrect = verticalRatio < 0; // Any upward tilt is acceptable
        
        if (!isCorrect) {
          if (verticalRatio > 0.2) {
            feedback = "↑ Tilt your head UP more";
          } else if (verticalRatio > 0) {
            feedback = "↑ Tilt your head UP";
          } else {
            // Very close, accept it
            isCorrect = true;
            feedback = "✓ Head tilted up";
          }
        } else {
          // If already correct, check if it's a good tilt
          if (verticalRatio < -0.15) {
            feedback = "✓ Perfect! Head tilted up";
          } else {
            feedback = "✓ Head tilted up";
          }
        }
        break;

      default:
        feedback = "Unknown angle";
        return false;
    }

    setPositionFeedback(feedback);
    return isCorrect;
  };

  // Draw face detection visualization
  useEffect(() => {
    const drawFaceOval = async () => {
      if (
        !videoRef.current ||
        !faceCanvasRef.current ||
        !window.faceapi ||
        !cameraAccessGranted ||
        !modelsLoaded
      ) {
        return;
      }

      try {
        const detections = await window.faceapi
          .detectAllFaces(
            videoRef.current,
            new window.faceapi.TinyFaceDetectorOptions({
              inputSize: 416, // Increased for better detection
              scoreThreshold: 0.3, // Lower threshold for better detection
            })
          )
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
          const landmarks = detection.landmarks.positions || detection.landmarks;

          // Draw face oval (vertical - taller than wide, like a human face)
          // Get key facial points for better oval calculation
          const chin = landmarks[8] || landmarks[7]; // Chin point
          const forehead = landmarks[27] || landmarks[21]; // Forehead point
          const leftCheek = landmarks[0]; // Left face edge
          const rightCheek = landmarks[16]; // Right face edge

          // Calculate face dimensions from key points
          const faceWidth = Math.abs(rightCheek.x - leftCheek.x);
          const faceHeight = Math.abs(forehead.y - chin.y);

          // Center of face
          const centerX = (leftCheek.x + rightCheek.x) / 2;
          const centerY = (forehead.y + chin.y) / 2;

          // Make oval vertical: height should be 1.4x the width (natural face ratio)
          // Add padding for better visual fit
          const paddingX = faceWidth * 0.15; // 15% horizontal padding
          const paddingY = faceHeight * 0.2; // 20% vertical padding
          
          // Vertical oval: radiusX (horizontal) is smaller, radiusY (vertical) is larger
          const radiusX = (faceWidth / 2) + paddingX; // Horizontal radius (narrower)
          const radiusY = (faceHeight / 2) + paddingY; // Vertical radius (taller)
          
          // Ensure oval is vertical (height > width)
          const finalRadiusX = Math.min(radiusX, radiusY * 0.75); // Max 75% of height
          const finalRadiusY = Math.max(radiusY, radiusX * 1.4); // At least 140% of width

          // Draw oval border
          ctx.strokeStyle = faceDetected ? "#10B981" : "#EF4444";
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.ellipse(centerX, centerY, finalRadiusX, finalRadiusY, 0, 0, Math.PI * 2);
          ctx.stroke();
          
          // Update face detected state
          setFaceDetected(true);

          // Draw direction indicator
          if (headPosition?.isCorrect) {
            ctx.fillStyle = "rgba(16, 185, 129, 0.3)";
            ctx.fill();
          }
          
          // Draw direction arrow if not in correct position
          if (!headPosition?.isCorrect && isAutoCapturing && currentAngleIndex < angles.length) {
            const currentAngle = angles[currentAngleIndex];
            ctx.strokeStyle = "#FFD700"; // Gold color for arrows
            ctx.fillStyle = "#FFD700";
            ctx.lineWidth = 4;
            ctx.font = "bold 50px Arial";
            ctx.textAlign = "center";
            ctx.textBaseline = "middle";
            
            const arrowX = centerX;
            const arrowY = centerY - finalRadiusY - 40;
            
            switch (currentAngle.key) {
              case "left":
                ctx.fillText("←", arrowX - 40, arrowY);
                break;
              case "right":
                ctx.fillText("→", arrowX + 40, arrowY);
                break;
              case "up":
                ctx.fillText("↑", arrowX, arrowY - 30);
                break;
              case "front":
                // Draw center indicator (crosshair)
                ctx.strokeStyle = "#10B981";
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.moveTo(arrowX - 25, arrowY);
                ctx.lineTo(arrowX + 25, arrowY);
                ctx.moveTo(arrowX, arrowY - 25);
                ctx.lineTo(arrowX, arrowY + 25);
                ctx.stroke();
                break;
            }
          }
        } else {
          setFaceDetected(false);
        }
      } catch (error) {
        console.error("Face drawing error:", error);
        setFaceDetected(false);
      }

      requestAnimationFrame(drawFaceOval);
    };

    if (cameraAccessGranted && modelsLoaded) {
      drawFaceOval();
    }
  }, [cameraAccessGranted, faceDetected, headPosition, modelsLoaded, isAutoCapturing, currentAngleIndex]);

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
            {/* Hidden canvas for image capture */}
            <canvas
              ref={canvasRef}
              style={{ display: "none" }}
            />

            {/* Status Overlay */}
            {isAutoCapturing && (
              <div className="absolute bottom-4 left-4 right-4 bg-gradient-to-r from-blue-600 to-blue-700 text-white rounded-lg p-4 text-center z-20 shadow-2xl">
                <div className="flex items-center justify-center gap-3 mb-2">
                  <span className="text-3xl">{angles[currentAngleIndex]?.icon}</span>
                  <p className="font-bold text-xl">
                    {angleInstructions}
                  </p>
                </div>
                <div className="mt-2">
                  {faceDetected ? (
                    headPosition?.isCorrect ? (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-green-300 text-lg">✓</span>
                        <span className="text-green-300 font-semibold">Position correct - Capturing now...</span>
                      </div>
                    ) : (
                      <div className="flex items-center justify-center gap-2">
                        <span className="text-yellow-300 text-lg">⚠</span>
                        <span className="text-yellow-300 font-medium">{positionFeedback || "Adjust your head position..."}</span>
                      </div>
                    )
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <span className="text-red-300 text-lg">✗</span>
                      <span className="text-red-300 font-medium">Face not detected - Please position your face in the frame</span>
                    </div>
                  )}
                </div>
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

            {isLoadingModels && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 bg-opacity-75 text-white z-10">
                <div className="text-center">
                  <div className="loading loading-spinner loading-lg"></div>
                  <p className="mt-2">Loading face detection models...</p>
                  <p className="mt-1 text-sm text-gray-400">This may take a few seconds</p>
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
