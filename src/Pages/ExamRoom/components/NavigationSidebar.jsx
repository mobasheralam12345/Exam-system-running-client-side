import { useState } from "react";
import TimerDisplay from "./TimerDisplay";
import QuestionNavButton from "./QuestionNavButton";

const NavigationSidebar = ({
  examData,
  currentSubjectIndex,
  currentQuestionIndex,
  answers,
  reviewMarked,
  visitedQuestions,
  timeLeft,
  goToQuestion,
}) => {
  // Track pagination state for each subject separately
  const [subjectPages, setSubjectPages] = useState({});
  const questionsPerPage = 10;

  const getQuestionStatus = (subjectIndex, questionIndex) => {
    const questionKey = `${subjectIndex}-${questionIndex}`;
    const isCurrent =
      subjectIndex === currentSubjectIndex &&
      questionIndex === currentQuestionIndex;
    const isAnswered = answers.hasOwnProperty(questionKey);
    const isMarkedForReview = reviewMarked.has(questionKey);
    const isVisited = visitedQuestions.has(questionKey);

    if (isCurrent) return "current";
    if (isMarkedForReview) return "review";
    if (isAnswered) return "answered";
    if (isVisited) return "visited";
    return "not-visited";
  };

  // Get current page for a subject (default to 0)
  const getCurrentPage = (subjectIndex) => {
    return subjectPages[subjectIndex] || 0;
  };

  // Set page for a specific subject
  const setSubjectPage = (subjectIndex, page) => {
    setSubjectPages((prev) => ({
      ...prev,
      [subjectIndex]: page,
    }));
  };

  // Navigate to next page for a subject
  const goToNextPage = (subjectIndex, totalPages) => {
    const currentPage = getCurrentPage(subjectIndex);
    if (currentPage < totalPages - 1) {
      setSubjectPage(subjectIndex, currentPage + 1);
    }
  };

  // Navigate to previous page for a subject
  const goToPreviousPage = (subjectIndex) => {
    const currentPage = getCurrentPage(subjectIndex);
    if (currentPage > 0) {
      setSubjectPage(subjectIndex, currentPage - 1);
    }
  };

  return (
    <div className="lg:w-80 bg-gray-100 border-r flex flex-col overflow-hidden h-full">
      <TimerDisplay timeLeft={timeLeft} />

      {/* Scrollable subjects area */}
      <div className="flex-1 overflow-y-auto p-4">
        <h3 className="font-semibold mb-3 text-sm">Subjects</h3>
        <div className="space-y-4">
          {examData.subjects.map((subject, subjectIndex) => {
            const totalQuestions = subject.questions.length;
            const totalPages = Math.ceil(totalQuestions / questionsPerPage);
            const currentPage = getCurrentPage(subjectIndex);
            const startIndex = currentPage * questionsPerPage;
            const endIndex = Math.min(
              startIndex + questionsPerPage,
              totalQuestions
            );

            // Get global question number start for this subject
            const globalStartNumber = examData.subjects
              .slice(0, subjectIndex)
              .reduce((acc, s) => acc + s.questions.length, 0);

            return (
              <div
                key={subject._id}
                className="bg-white rounded-lg p-3 shadow-sm"
              >
                {/* Subject Header */}
                <div className="flex items-center justify-between mb-2">
                  <h4 className="text-sm font-medium text-gray-900">
                    {subject.name}
                  </h4>
                  {totalPages > 1 && (
                    <span className="text-xs text-gray-500">
                      {startIndex + 1}-{endIndex} of {totalQuestions}
                    </span>
                  )}
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-1 mb-2">
                  {subject.questions
                    .slice(startIndex, endIndex)
                    .map((_, questionIndex) => {
                      const actualQuestionIndex = startIndex + questionIndex;
                      const status = getQuestionStatus(
                        subjectIndex,
                        actualQuestionIndex
                      );
                      const questionNumber =
                        globalStartNumber + actualQuestionIndex + 1;

                      return (
                        <QuestionNavButton
                          key={actualQuestionIndex}
                          questionNumber={questionNumber}
                          status={status}
                          onClick={() =>
                            goToQuestion(subjectIndex, actualQuestionIndex)
                          }
                        />
                      );
                    })}
                </div>

                {/* Pagination Controls (only if more than 10 questions) */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                    <button
                      onClick={() => goToPreviousPage(subjectIndex)}
                      disabled={currentPage === 0}
                      className={`p-1.5 rounded transition-colors ${
                        currentPage === 0
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                      title="Previous"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M15 19l-7-7 7-7"
                        />
                      </svg>
                    </button>
                    <span className="text-xs text-gray-600">
                      {currentPage + 1}/{totalPages}
                    </span>
                    <button
                      onClick={() => goToNextPage(subjectIndex, totalPages)}
                      disabled={currentPage === totalPages - 1}
                      className={`p-1.5 rounded transition-colors ${
                        currentPage === totalPages - 1
                          ? "text-gray-300 cursor-not-allowed"
                          : "text-blue-600 hover:bg-blue-50"
                      }`}
                      title="Next"
                    >
                      <svg
                        className="w-4 h-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M9 5l7 7-7 7"
                        />
                      </svg>
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Fixed Legend at Bottom */}
      <div className="border-t border-gray-300 bg-gray-50 p-4">
        <h4 className="text-xs font-semibold text-gray-700 mb-3">
          Status Legend
        </h4>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-blue-600 ring-2 ring-blue-300 flex-shrink-0"></div>
            <span className="text-xs text-gray-700">Current</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-green-600 flex-shrink-0"></div>
            <span className="text-xs text-gray-700">Answered</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-orange-500 flex-shrink-0"></div>
            <span className="text-xs text-gray-700">Marked for Review</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-blue-400 flex-shrink-0"></div>
            <span className="text-xs text-gray-700">Visited</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded bg-white border border-gray-300 flex-shrink-0"></div>
            <span className="text-xs text-gray-700">Not Visited</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NavigationSidebar;
