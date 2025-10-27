const StartConfirmation = ({ examData, onStart, isLive = true }) => {
  return (
    <div
      className={`min-h-screen bg-gradient-to-br ${
        isLive ? "from-gray-50 to-blue-50" : "from-gray-50 to-green-50"
      } flex items-center justify-center p-4`}
    >
      <div className="bg-white p-8 rounded-2xl shadow-xl max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4 text-gray-800">
          {examData.title}
        </h2>
        <p className="text-xl text-gray-700 mb-6">Are you ready to start?</p>
        <button
          onClick={onStart}
          className={`px-12 py-3 ${
            isLive
              ? "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
              : "bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700"
          } text-white rounded-lg font-bold text-lg transition-all`}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

export default StartConfirmation;
