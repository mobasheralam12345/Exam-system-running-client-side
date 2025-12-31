const ExamHeader = ({
  examData,
  currentSubjectIndex,
  currentQuestionIndex,
  onSubmit,
  showSubmit = false,
  commonViolationCount = 0,
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
      <div className="flex items-center gap-6">
        <div>
          <h1 className="text-lg lg:text-xl font-semibold">
            Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
          </h1>
          <p className="text-sm text-gray-600">
            {examData.subjects[currentSubjectIndex].name}
          </p>
        </div>
        
        {/* Common Violation Counter */}
        <div className={`px-4 py-2 rounded-lg font-bold text-sm ${
          commonViolationCount === 0 
            ? "bg-green-100 text-green-700 border border-green-300" 
            : commonViolationCount >= 3
            ? "bg-red-100 text-red-700 border border-red-300"
            : "bg-yellow-100 text-yellow-700 border border-yellow-300"
        }`}>
          Violations: {commonViolationCount}
        </div>
      </div>

      {showSubmit && (
        <button
          onClick={onSubmit}
          className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold transition-colors"
        >
          Submit Exam
        </button>
      )}
    </div>
  );
};

export default ExamHeader;
