import { useState } from "react";
import Swal from "sweetalert2";

const ExamRegistrationModal = ({ isOpen, onClose, exam, onRegister }) => {
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  if (!isOpen) return null;

  const handleRegister = async () => {
    if (!agreedToTerms) {
      await Swal.fire({
        icon: "warning",
        title: "Terms Required",
        text: "Please agree to the terms and conditions to register.",
        confirmButtonText: "OK",
      });
      return;
    }

    setIsRegistering(true);
    try {
      await onRegister();
      onClose();
    } catch (error) {
      console.error("Registration error:", error);
    } finally {
      setIsRegistering(false);
    }
  };

  const termsAndConditions = [
    {
      title: "No Cheating Policy",
      description:
        "I understand that any form of cheating, including but not limited to using unauthorized materials, receiving help from others, or attempting to access external resources, will result in immediate disqualification.",
    },
    {
      title: "Webcam Monitoring",
      description:
        "I consent to webcam monitoring during the exam. My webcam will be activated and monitored throughout the examination period to ensure exam integrity.",
    },
    {
      title: "No Tab Switching",
      description:
        "I agree not to switch tabs, open new windows, or use any other applications during the exam. Violations will be detected and may result in exam termination.",
    },
    {
      title: "Fullscreen Mode",
      description:
        "I understand that the exam must be taken in fullscreen mode and I will not attempt to exit fullscreen during the examination.",
    },
    {
      title: "Time Restrictions",
      description:
        "I understand that the exam has a strict time limit and I must complete it within the allocated time. The exam will auto-submit when time expires.",
    },
    {
      title: "Violation Consequences",
      description:
        "I understand that violations of any exam rules may result in immediate expulsion, disqualification, and potential ban from future exams.",
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black bg-opacity-50"
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="relative bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold mb-1">Exam Registration</h2>
              <p className="text-blue-100">{exam?.title}</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Terms and Conditions */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Terms and Conditions
            </h3>
            <p className="text-sm text-gray-600 mb-6">
              Please read and agree to the following terms and conditions before
              registering for this exam:
            </p>

            <div className="space-y-4">
              {termsAndConditions.map((term, index) => (
                <div
                  key={index}
                  className="border border-gray-200 rounded-lg p-4 hover:border-blue-300 transition-colors"
                >
                  <div className="flex items-start">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-3 mt-0.5">
                      <span className="text-blue-600 font-bold text-sm">
                        {index + 1}
                      </span>
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 mb-1">
                        {term.title}
                      </h4>
                      <p className="text-sm text-gray-600">{term.description}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Agreement Checkbox */}
          <div className="border-t border-gray-200 pt-6">
            <label className="flex items-start cursor-pointer group">
              <input
                type="checkbox"
                checked={agreedToTerms}
                onChange={(e) => setAgreedToTerms(e.target.checked)}
                className="mt-1 h-5 w-5 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <span className="ml-3 text-sm text-gray-700 group-hover:text-gray-900">
                <span className="font-semibold">
                  I have read and agree to all the terms and conditions
                </span>
                <span className="text-red-600"> *</span>
                <br />
                <span className="text-gray-500">
                  By checking this box, I confirm that I understand and will
                  comply with all exam rules and regulations.
                </span>
              </span>
            </label>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-700 hover:text-gray-900 font-medium transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleRegister}
            disabled={!agreedToTerms || isRegistering}
            className={`px-6 py-2 rounded-lg font-semibold transition-all ${
              agreedToTerms && !isRegistering
                ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:shadow-lg hover:scale-105 active:scale-95"
                : "bg-gray-300 text-gray-500 cursor-not-allowed"
            }`}
          >
            {isRegistering ? "Registering..." : "Register for Exam"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamRegistrationModal;

