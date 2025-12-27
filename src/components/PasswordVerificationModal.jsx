import { useState } from "react";
import { Lock, AlertCircle, X, Loader } from "lucide-react";
import Swal from "sweetalert2";
import useProfile from "../hooks/useProfile";

const PasswordVerificationModal = ({ isOpen, onVerified, onClose }) => {
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const { verifyPassword } = useProfile();

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPasswordError("");

    if (!password.trim()) {
      setPasswordError("Password is required");
      return;
    }

    try {
      setIsVerifying(true);
      await verifyPassword(password);

      Swal.fire({
        icon: "success",
        title: "Password Verified",
        text: "You can now proceed with image verification.",
        confirmButtonColor: "#10B981",
        timer: 1200,
        showConfirmButton: false,
      });

      setPassword("");
      if (onVerified) {
        onVerified();
      }
    } catch (err) {
      const errorMsg = err.response?.data?.message || "Password is incorrect";
      setPasswordError(errorMsg);

      Swal.fire({
        icon: "error",
        title: "Password Error",
        text: errorMsg,
        confirmButtonColor: "#EF4444",
      });
    } finally {
      setIsVerifying(false);
    }
  };

  const handleCancel = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setPassword("");
    setPasswordError("");
    if (onClose) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={handleCancel} // Click outside to close
    >
      <div
        className="bg-white rounded-xl shadow-2xl max-w-md w-full animate-in"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Lock className="w-6 h-6 text-blue-600" />
            Verify Password
          </h2>
          <button
            onClick={handleCancel}
            disabled={isVerifying}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors disabled:opacity-50 text-gray-600 hover:text-gray-900"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content - NO FORM WRAPPER */}
        <div className="p-6">
          {/* Info Alert */}
          <div className="bg-blue-50 border-l-4 border-blue-500 p-4 mb-6 rounded">
            <p className="text-blue-700 text-sm">
              <strong>Security:</strong> For your account security, please enter
              your password before proceeding with image verification.
            </p>
          </div>

          {/* Password Input */}
          <div className="mb-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="w-5 h-5 text-gray-400" />
              </div>
              <input
                type="password"
                placeholder="Enter your password"
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none disabled:bg-gray-100 disabled:cursor-not-allowed"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                disabled={isVerifying}
                autoFocus
              />
            </div>
            {passwordError && (
              <p className="mt-2 text-sm text-red-600 flex items-center gap-1">
                <AlertCircle className="w-4 h-4" />
                {passwordError}
              </p>
            )}
          </div>

          {/* Action Buttons - NO FORM */}
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleCancel}
              disabled={isVerifying}
              className="flex-1 py-3 px-4 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handlePasswordSubmit}
              disabled={isVerifying || !password.trim()}
              className="flex-1 py-3 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-colors"
            >
              {isVerifying ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Verifying...
                </>
              ) : (
                <>
                  <Lock className="w-4 h-4" />
                  Verify
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordVerificationModal;
