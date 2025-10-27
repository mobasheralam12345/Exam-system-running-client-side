const SubmitConfirmation = ({ onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-8 rounded-lg max-w-md text-center shadow-2xl">
        <div className="text-blue-500 text-5xl mb-4">📝</div>
        <h3 className="text-xl font-bold text-gray-800 mb-4">Submit Exam?</h3>
        <p className="text-gray-700 mb-6">
          Are you sure you want to submit all answers?
        </p>
        <div className="flex gap-4 justify-center">
          <button
            onClick={onCancel}
            className="px-8 py-3 bg-gray-500 text-white rounded-lg font-semibold hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="px-8 py-3 bg-green-600 text-white rounded-lg font-semibold hover:bg-green-700 transition-colors"
          >
            Yes, Submit
          </button>
        </div>
      </div>
    </div>
  );
};

export default SubmitConfirmation;
