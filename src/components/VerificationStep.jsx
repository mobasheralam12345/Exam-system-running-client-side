import { useState, useEffect } from "react";
import {
  Camera,
  CheckCircle,
  Upload,
  AlertCircle,
  Smartphone,
} from "lucide-react";
import Swal from "sweetalert2";
import { useWebcamCapture } from "../hooks/useWebcamCapture";
import useProfile from "../hooks/useProfile";

const VerificationStep = ({ onVerificationComplete }) => {
  const { submitVerification } = useProfile();
  const {
    videoRef,
    canvasRef,
    cameraAccessGranted,
    cameraError,
    capturedImages,
    currentAngle,
    isCapturing,
    startCamera,
    stopCamera,
    captureImage,
    clearCapturedImage,
    areAllAnglesCaptured,
    setCurrentAngle,
  } = useWebcamCapture();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const angles = [
    { key: "front", label: "Front", icon: "📷", instruction: "Face forward" },
    { key: "left", label: "Left", icon: "←", instruction: "Turn left" },
    { key: "right", label: "Right", icon: "→", instruction: "Turn right" },
    { key: "up", label: "Up", icon: "↑", instruction: "Tilt up" },
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

  // Auto-start camera on component mount
  useEffect(() => {
    const timer = setTimeout(() => {
      if (videoRef.current && !cameraAccessGranted && !isCapturing) {
        startCamera();
      }
    }, 200);

    return () => {
      clearTimeout(timer);
      stopCamera();
    };
  }, [cameraAccessGranted, isCapturing, startCamera, stopCamera, videoRef]);

  const handleCapture = async (angle) => {
    if (!cameraAccessGranted) {
      Swal.fire({
        icon: "warning",
        title: "Camera Not Ready",
        text: "Please enable camera access first",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    try {
      setCurrentAngle(angle);
      await captureImage(angle);

      Swal.fire({
        icon: "success",
        title: "Photo Captured",
        text: `${
          angles.find((a) => a.key === angle)?.label
        } angle captured successfully`,
        confirmButtonColor: "#10B981",
        timer: 1500,
        showConfirmButton: false,
      });
    } catch (error) {
      console.error("Capture error:", error);
      Swal.fire({
        icon: "error",
        title: "Capture Failed",
        text: error.message || "Failed to capture photo. Please try again.",
        confirmButtonColor: "#EF4444",
      });
    }
  };

  const handleSubmit = async () => {
    if (!areAllAnglesCaptured()) {
      Swal.fire({
        icon: "warning",
        title: "Incomplete Verification",
        text: "Please capture all four angles before submitting",
        confirmButtonColor: "#F59E0B",
      });
      return;
    }

    try {
      setIsSubmitting(true);

      const formData = new FormData();
      const angleKeys = ["front", "left", "right", "up"];

      for (const angle of angleKeys) {
        const imageData = capturedImages[angle];

        if (imageData?.blob) {
          const file = new File(
            [imageData.blob],
            `${angle}-${Date.now()}.webp`,
            { type: "image/webp" }
          );

          formData.append(angle, file);
        } else {
          throw new Error(`Missing image for ${angle} angle`);
        }
      }

      const response = await submitVerification(formData);
      stopCamera();

      Swal.fire({
        icon: "success",
        title: "Verification Submitted!",
        html: `
          <p>Your verification photos have been uploaded successfully.</p>
          <p class="text-sm text-gray-600 mt-2">
            Status: <strong>Pending Review</strong>
          </p>
          <p class="text-sm text-gray-600">
            You will be notified once your verification is reviewed.
          </p>
        `,
        confirmButtonColor: "#10B981",
        confirmButtonText: "Got it!",
      });

      if (onVerificationComplete) {
        onVerificationComplete(response);
      }
    } catch (error) {
      console.error("Submission error:", error);

      const errorMessage =
        error.response?.data?.message ||
        error.message ||
        "Failed to submit verification. Please try again.";

      Swal.fire({
        icon: "error",
        title: "Submission Failed",
        text: errorMessage,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-3 sm:space-y-4 px-2 sm:px-0">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <h4 className="text-base sm:text-lg font-semibold text-gray-800">
            Identity Verification
          </h4>
          <p className="text-xs sm:text-sm text-gray-600 mt-1">
            Capture your face from 4 different angles
          </p>
        </div>
      </div>

      {/* Mobile Instructions */}
      {isMobile && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-start gap-2">
            <Smartphone className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <div className="text-xs text-blue-800">
              <strong>Mobile Tips:</strong> Hold your device steady, ensure good
              lighting, and rotate your head (not your phone) for different
              angles.
            </div>
          </div>
        </div>
      )}

      {/* Camera Error */}
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

      {/* Video Preview */}
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video max-h-[60vh] sm:max-h-[400px]">
        <video
          ref={videoRef}
          autoPlay
          playsInline
          muted
          className="w-full h-full object-cover"
        />
        <canvas ref={canvasRef} className="hidden" />

        {/* Current Angle Indicator */}
        {cameraAccessGranted && currentAngle && (
          <div className="absolute top-2 left-2 sm:top-4 sm:left-4 bg-black bg-opacity-60 text-white px-3 py-1.5 rounded-full text-xs sm:text-sm font-medium z-20">
            {angles.find((a) => a.key === currentAngle)?.instruction ||
              currentAngle}
          </div>
        )}

        {!cameraAccessGranted && !isCapturing && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 text-white z-10">
            <div className="text-center p-4">
              <Camera className="w-10 h-10 sm:w-12 sm:h-12 mx-auto mb-2" />
              <p className="mb-2 text-sm sm:text-base">
                Camera access required
              </p>
              <button
                onClick={startCamera}
                disabled={isCapturing}
                className="btn btn-sm sm:btn-md btn-primary mt-4 text-white disabled:opacity-50"
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
              <p className="mt-2 text-sm sm:text-base">Starting camera...</p>
            </div>
          </div>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center justify-center gap-1.5 sm:gap-2 px-2">
        {angles.map((angle) => (
          <div
            key={angle.key}
            className="flex-1 flex flex-col items-center gap-1"
          >
            <div
              className={`h-1.5 sm:h-2 w-full rounded-full transition-colors ${
                capturedImages[angle.key] ? "bg-green-500" : "bg-gray-300"
              }`}
              title={`${angle.label} - ${
                capturedImages[angle.key] ? "Captured" : "Pending"
              }`}
            />
            <span className="text-[10px] sm:text-xs text-gray-600 hidden sm:block">
              {angle.label}
            </span>
          </div>
        ))}
      </div>

      {/* Angle Selection and Capture - Mobile Optimized Grid */}
      <div
        className={`grid ${
          isMobile ? "grid-cols-2" : "grid-cols-2 sm:grid-cols-4"
        } gap-2 sm:gap-3`}
      >
        {angles.map((angle) => {
          const isCaptured = capturedImages[angle.key] !== null;
          const isCurrent = currentAngle === angle.key;

          return (
            <div
              key={angle.key}
              className={`border-2 rounded-lg p-2 sm:p-3 transition-all ${
                isCaptured
                  ? "border-green-500 bg-green-50"
                  : isCurrent
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium text-xs sm:text-sm">
                  {angle.label}
                </span>
                {isCaptured ? (
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-green-600 flex-shrink-0" />
                ) : (
                  <span className="text-xl sm:text-2xl">{angle.icon}</span>
                )}
              </div>

              {isCaptured ? (
                <div className="space-y-2">
                  <img
                    src={capturedImages[angle.key].url}
                    alt={`${angle.label} angle`}
                    className="w-full h-16 sm:h-20 object-cover rounded border border-gray-200"
                  />
                  <button
                    onClick={() => clearCapturedImage(angle.key)}
                    className="btn btn-xs sm:btn-sm btn-ghost w-full"
                    disabled={isSubmitting}
                  >
                    Retake
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => handleCapture(angle.key)}
                  disabled={!cameraAccessGranted || isCapturing || isSubmitting}
                  className="btn btn-xs sm:btn-sm btn-outline w-full disabled:opacity-50"
                >
                  <Camera className="w-3 h-3 sm:w-4 sm:h-4 mr-1" />
                  <span className="text-xs sm:text-sm">Capture</span>
                </button>
              )}
            </div>
          );
        })}
      </div>

      {/* Submit Button */}
      <button
        onClick={handleSubmit}
        disabled={!areAllAnglesCaptured() || isSubmitting}
        className="btn btn-primary w-full text-white gap-2 disabled:opacity-50 text-sm sm:text-base"
      >
        {isSubmitting ? (
          <>
            <span className="loading loading-spinner loading-sm"></span>
            <span className="hidden sm:inline">Uploading to Cloudinary...</span>
            <span className="sm:hidden">Uploading...</span>
          </>
        ) : (
          <>
            <Upload className="w-4 h-4 sm:w-5 sm:h-5" />
            Submit Verification
          </>
        )}
      </button>

      {/* Tips Section */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-2.5 sm:p-3">
        <p className="text-[11px] sm:text-xs text-blue-800">
          📸 <strong>Tips:</strong> Ensure good lighting, face the camera
          directly, and keep your full face visible in all angles for best
          results.
        </p>
      </div>
    </div>
  );
};

export default VerificationStep;
