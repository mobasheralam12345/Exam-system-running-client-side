const ExamCompletedScreen = ({ loading }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Exam Completed</h2>
        <p className="text-gray-600">
          {loading
            ? "Submitting your exam..."
            : "Your exam has been submitted successfully."}
        </p>
      </div>
    </div>
  );
};

export default ExamCompletedScreen;
