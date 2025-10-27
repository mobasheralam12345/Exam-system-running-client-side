const EscapeWarning = ({ onCancel, onProceed }) => {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center"
      style={{
        zIndex: 9999,
        backgroundColor: "rgba(0, 0, 0, 0.95)",
      }}
    >
      <div className="bg-white p-8 rounded-xl max-w-md w-full mx-4 shadow-2xl">
        <div className="text-center">
          {/* Warning Icon */}
          <div className="text-red-600 text-8xl mb-4">🚨</div>

          {/* Title */}
          <h3 className="text-3xl font-bold text-red-600 mb-4">
            Critical Warning!
          </h3>

          {/* Message */}
          <div className="bg-red-50 border-2 border-red-300 rounded-lg p-5 mb-4">
            <p className="text-gray-800 font-bold text-lg mb-2">
              Are you sure you want to exit fullscreen?
            </p>
            <p className="text-red-700 font-semibold text-base">
              This will cause immediate expulsion from the exam!
            </p>
          </div>

          <p className="text-gray-600 mb-6 text-sm">
            Your exam will be automatically submitted and marked as expelled.
          </p>

          {/* Buttons */}
          <div className="flex flex-col gap-3">
            <button
              onClick={onCancel}
              className="w-full px-6 py-4 bg-green-600 text-white rounded-lg font-bold text-lg hover:bg-green-700 transition-colors shadow-lg"
            >
              ✓ Cancel - Stay in Exam
            </button>
            <button
              onClick={onProceed}
              className="w-full px-6 py-4 bg-red-600 text-white rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg"
            >
              ✗ Proceed - Accept Expulsion
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EscapeWarning;
