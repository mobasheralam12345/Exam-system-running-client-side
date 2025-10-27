import OptionItem from "./OptionItem";

const QuestionDisplay = ({
  question,
  answers,
  currentSubjectIndex,
  currentQuestionIndex,
  onAnswerSelect,
  onToggleReview,
  onNext,
  onPrevious,
  reviewMarked,
  isLastQuestion = false,
}) => {
  const questionKey = `${currentSubjectIndex}-${currentQuestionIndex}`;
  const selectedAnswer = answers[questionKey];
  const isReviewMarked = reviewMarked.has(questionKey);

  return (
    <div className="flex-1 overflow-y-auto p-4 lg:p-6">
      <div className="max-w-4xl mx-auto">
        <div
          className="text-lg mb-6"
          dangerouslySetInnerHTML={{ __html: question?.text || "" }}
        />

        <div className="space-y-3 mb-6">
          {question?.options.map((option, index) => (
            <OptionItem
              key={index}
              option={option}
              index={index}
              isSelected={selectedAnswer === index}
              onSelect={() => onAnswerSelect(index)}
            />
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 justify-between">
          <button
            onClick={onPrevious}
            className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
          >
            Previous
          </button>

          <button
            onClick={onToggleReview}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isReviewMarked
                ? "bg-orange-500 text-white"
                : "bg-orange-100 text-orange-700"
            }`}
          >
            {isReviewMarked ? "Unmark Review" : "Mark for Review"}
          </button>

          <button
            onClick={onNext}
            disabled={isLastQuestion}
            className={`px-6 py-2 rounded-lg transition-colors ${
              isLastQuestion
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            Save & Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default QuestionDisplay;
