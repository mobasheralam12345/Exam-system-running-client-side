const ExpelledScreen = ({ onOk }) => {
  return (
    <div className="min-h-screen bg-gray-900 bg-opacity-90 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-2xl max-w-md text-center">
        <div className="text-red-600 text-6xl mb-4">⚠️</div>
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          You Have Violated Rules
        </h2>
        <p className="text-gray-700 mb-6">You're expelled from this exam.</p>
        <button
          onClick={onOk}
          className="px-12 py-3 bg-red-600 text-white rounded-lg font-bold hover:bg-red-700 transition-colors"
        >
          OK
        </button>
      </div>
    </div>
  );
};

export default ExpelledScreen;
