const ExamReview = ({ examData, answers }) => {
  // Calculate statistics
  const calculateStats = () => {
    let totalCorrect = 0;
    let totalWrong = 0;
    let totalSkipped = 0;
    let totalQuestions = 0;

    examData.subjects.forEach((subject, subjectIndex) => {
      subject.questions.forEach((question, questionIndex) => {
        const questionKey = `${subjectIndex}-${questionIndex}`;
        const userAnswer = answers[questionKey];
        totalQuestions++;

        if (userAnswer === undefined) {
          totalSkipped++;
        } else if (userAnswer === question.correctAnswer) {
          totalCorrect++;
        } else {
          totalWrong++;
        }
      });
    });

    const percentage = ((totalCorrect / totalQuestions) * 100).toFixed(2);

    return {
      totalCorrect,
      totalWrong,
      totalSkipped,
      totalQuestions,
      percentage,
    };
  };

  const stats = calculateStats();

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold mb-6">
          Exam Review: {examData.title}
        </h2>

        {/* Performance Summary */}
        <div className="mb-8 p-6 bg-blue-50 rounded-lg border border-blue-200">
          <h3 className="text-lg font-semibold mb-4 text-blue-900">
            Performance Summary
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-600">
                {stats.percentage}%
              </div>
              <div className="text-sm text-gray-600">Accuracy</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-green-600">
                {stats.totalCorrect}
              </div>
              <div className="text-sm text-gray-600">Correct</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-red-600">
                {stats.totalWrong}
              </div>
              <div className="text-sm text-gray-600">Wrong</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-gray-600">
                {stats.totalSkipped}
              </div>
              <div className="text-sm text-gray-600">Skipped</div>
            </div>
          </div>
        </div>

        {/* Questions Review */}
        {examData.subjects.map((subject, subjectIndex) => (
          <div key={subject._id} className="mb-8">
            <h3 className="text-xl font-semibold mb-4 bg-blue-100 p-3 rounded">
              {subject.name}
            </h3>

            {subject.questions.map((question, questionIndex) => {
              const questionKey = `${subjectIndex}-${questionIndex}`;
              const userAnswer = answers[questionKey];
              const isCorrect = userAnswer === question.correctAnswer;
              const isSkipped = userAnswer === undefined;

              return (
                <div
                  key={question._id}
                  className={`mb-6 p-4 border-2 rounded-lg ${
                    isSkipped
                      ? "border-gray-300 bg-gray-50"
                      : isCorrect
                      ? "border-green-300 bg-green-50"
                      : "border-red-300 bg-red-50"
                  }`}
                >
                  {/* Question Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="font-medium text-gray-700">
                      Question {questionIndex + 1}
                    </div>
                    {isSkipped ? (
                      <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-semibold rounded-full">
                        Not Answered
                      </span>
                    ) : isCorrect ? (
                      <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-semibold rounded-full">
                        ✓ Correct
                      </span>
                    ) : (
                      <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-semibold rounded-full">
                        ✗ Incorrect
                      </span>
                    )}
                  </div>

                  {/* Question Text */}
                  <div
                    className="mb-4 text-gray-800 font-medium"
                    dangerouslySetInnerHTML={{ __html: question.text }}
                  />

                  {/* Options */}
                  <div className="space-y-2">
                    {question.options.map((option, optionIndex) => {
                      const isUserAnswer = userAnswer === optionIndex;
                      const isCorrectAnswer =
                        question.correctAnswer === optionIndex;

                      let optionClass = "p-3 rounded border-2 ";

                      if (isCorrectAnswer) {
                        optionClass += "border-green-500 bg-green-100 ";
                      } else if (isUserAnswer && !isCorrect) {
                        optionClass += "border-red-500 bg-red-100 ";
                      } else if (isUserAnswer) {
                        optionClass += "border-blue-500 bg-blue-100 ";
                      } else {
                        optionClass += "border-gray-300 bg-white ";
                      }

                      return (
                        <div key={optionIndex} className={optionClass}>
                          <div className="flex items-center justify-between">
                            <div className="flex-1">
                              <span className="font-bold mr-2">
                                {String.fromCharCode(65 + optionIndex)}.
                              </span>
                              <span
                                dangerouslySetInnerHTML={{ __html: option }}
                              />
                            </div>
                            <div className="flex items-center space-x-2 ml-2">
                              {isUserAnswer && (
                                <span className="text-xs px-2 py-1 bg-blue-200 text-blue-800 rounded-full font-semibold">
                                  Your Answer
                                </span>
                              )}
                              {isCorrectAnswer && (
                                <span className="text-xs px-2 py-1 bg-green-200 text-green-800 rounded-full font-semibold">
                                  Correct Answer
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  {/* Explanation (if available) */}
                  {question.explanation && (
                    <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="font-semibold text-yellow-800 mb-1">
                        💡 Explanation:
                      </div>
                      <div
                        className="text-sm text-yellow-900"
                        dangerouslySetInnerHTML={{
                          __html: question.explanation,
                        }}
                      />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExamReview;
