const ExamHeader = ({
  examData,
  currentSubjectIndex,
  currentQuestionIndex,
  onSubmit,
  showSubmit = false,
}) => {
  const getTotalQuestions = () => {
    return examData.subjects.reduce(
      (total, subject) => total + subject.questions.length,
      0
    );
  };

  const getCurrentQuestionNumber = () => {
    let count = 0;
    for (let i = 0; i < currentSubjectIndex; i++) {
      count += examData.subjects[i].questions.length;
    }
    return count + currentQuestionIndex + 1;
  };

  return (
    <div className="bg-white border-b p-4 flex items-center justify-between">
      <div>
        <h1 className="text-lg lg:text-xl font-semibold">
          Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
        </h1>
        <p className="text-sm text-gray-600">
          {examData.subjects[currentSubjectIndex].name}
        </p>
      </div>

      {showSubmit && (
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-semibold transition-colors"
        >
          Submit Exam
        </button>
      )}
    </div>
  );
};

export default ExamHeader;
