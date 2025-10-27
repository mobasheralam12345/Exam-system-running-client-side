const ViolationWarning = ({ violationType, onReturn }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg max-w-md text-center shadow-2xl">
        <div className="text-yellow-500 text-5xl mb-4">⚠️</div>
        <h3 className="text-xl font-bold text-red-600 mb-4">Warning!</h3>
        <p className="text-gray-700 mb-2">
          Violation detected:{" "}
          <span className="font-semibold">{violationType}</span>
        </p>
        <p className="text-gray-600 mb-6 text-sm">
          This violation has been recorded. You must return to the exam in
          fullscreen mode to continue.
        </p>
        <button
          onClick={onReturn}
          className="w-full px-8 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
        >
          Return to Exam
        </button>
      </div>
    </div>
  );
};

export default ViolationWarning;
