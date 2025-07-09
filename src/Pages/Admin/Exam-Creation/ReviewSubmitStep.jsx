import React, { useState } from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  CheckCircleIcon,
  XCircleIcon,
} from "@heroicons/react/24/outline";

const ReviewSubmitStep = ({ examData }) => {
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const totalQuestions = examData.subjects.reduce(
    (sum, subject) => sum + subject.questionCount,
    0
  );
  const completedQuestions = examData.subjects.reduce(
    (sum, subject) => sum + (subject.questions?.length || 0),
    0
  );
  const isComplete = completedQuestions === totalQuestions;

  const currentSubject = examData.subjects[currentSubjectIndex];
  const currentQuestion = currentSubject?.questions?.[currentQuestionIndex];
  const hasQuestions = currentSubject?.questions?.length > 0;

  const getModeIcon = (mode) => {
    switch (mode) {
      case "live":
        return "🔴";
      case "previous":
        return "📚";
      case "practice":
        return "💪";
      default:
        return "📝";
    }
  };

  const getModeTitle = (mode) => {
    switch (mode) {
      case "live":
        return "Live Exam";
      case "previous":
        return "Previous Year Paper";
      case "practice":
        return "Practice Test";
      default:
        return "Exam";
    }
  };

  // Calculate end time based on start time and duration
  const getEndTime = () => {
    if (examData.startTime && examData.duration) {
      const startTime = new Date(examData.startTime);
      const endTime = new Date(startTime.getTime() + examData.duration * 60000);
      return endTime.toLocaleString();
    }
    return "Will be calculated";
  };

  // Navigation functions
  const nextSubject = () => {
    if (currentSubjectIndex < examData.subjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const prevSubject = () => {
    if (currentSubjectIndex > 0) {
      setCurrentSubjectIndex(currentSubjectIndex - 1);
      setCurrentQuestionIndex(0);
    }
  };

  const nextQuestion = () => {
    const maxQuestions = currentSubject?.questions?.length || 0;
    if (currentQuestionIndex < maxQuestions - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else if (currentSubjectIndex < examData.subjects.length - 1) {
      setCurrentSubjectIndex(currentSubjectIndex + 1);
      setCurrentQuestionIndex(0);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubject = examData.subjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex(currentSubjectIndex - 1);
      setCurrentQuestionIndex(
        Math.max(0, (prevSubject.questions?.length || 1) - 1)
      );
    }
  };

  const navigateToQuestion = (questionIndex) => {
    setCurrentQuestionIndex(questionIndex);
  };

  const navigateToSubject = (subjectIndex) => {
    setCurrentSubjectIndex(subjectIndex);
    setCurrentQuestionIndex(0);
  };

  // Helper component for exam details
  const InfoCard = ({ label, value }) => (
    <div className="flex flex-col rounded-lg bg-white/60 p-4 shadow-inner">
      <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
        {label}
      </span>
      <span className="mt-0.5 font-semibold text-gray-800">{value}</span>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
          Review & Submit
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Final review before publishing your exam
        </p>
      </div>

      {/* Professional Exam Details Card */}
      <div className="rounded-xl border border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50 p-6 shadow-sm">
        {/* Header */}
        <div className="mb-6 flex items-center gap-4">
          <span className="text-3xl">{getModeIcon(examData.examMode)}</span>
          <div className="space-y-0.5">
            <h3 className="text-xl font-semibold text-gray-900">
              {examData.title}
            </h3>
            <p className="text-sm text-gray-600">
              {getModeTitle(examData.examMode)} • {examData.examType}
            </p>
          </div>
        </div>

        {/* Body - Conditional fields based on exam mode */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 text-[15px]">
          {/* Live Exam Fields Only */}
          {examData.examMode === "live" && (
            <>
              <InfoCard
                label="Duration"
                value={`${examData.duration} minutes`}
              />
              <InfoCard
                label="Start Time"
                value={
                  examData.startTime
                    ? new Date(examData.startTime).toLocaleString()
                    : "Not set"
                }
              />
              <InfoCard label="End Time" value={getEndTime()} />
              <InfoCard
                label="Password"
                value={examData.password ? "Protected" : "Open Access"}
              />
              <InfoCard
                label="Access"
                value={examData.isPremium ? "Premium Only" : "Free"}
              />
            </>
          )}

          {/* Previous Year Fields */}
          {examData.examMode === "previous" && (
            <>
              <InfoCard label="Year" value={examData.examYear} />
              {examData.session && (
                <InfoCard label="Session" value={examData.session} />
              )}
            </>
          )}

          {/* Practice Test Fields */}
          {examData.examMode === "practice" && (
            <>
              <InfoCard label="Type" value={examData.practiceType} />
              <InfoCard
                label="Results"
                value={
                  examData.showResults ? "Show Immediately" : "Hide Results"
                }
              />
            </>
          )}
        </div>
      </div>

      {/* Subject Navigation */}
      <div className="bg-white border border-gray-200 rounded-lg p-4">
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={prevSubject}
            disabled={currentSubjectIndex === 0}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeftIcon className="w-4 h-4 mr-2" />
            Previous Subject
          </button>

          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900">
              {currentSubject?.name}
            </h3>
            <p className="text-sm text-gray-600">
              Subject {currentSubjectIndex + 1} of {examData.subjects.length}
            </p>
          </div>

          <button
            onClick={nextSubject}
            disabled={currentSubjectIndex === examData.subjects.length - 1}
            className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next Subject
            <ChevronRightIcon className="w-4 h-4 ml-2" />
          </button>
        </div>

        {/* Subject Tabs */}
        <div className="flex space-x-1 sm:space-x-2 overflow-x-auto pb-2">
          {examData.subjects.map((subject, index) => {
            const completedQuestions = subject.questions?.length || 0;
            const totalQuestions = subject.questionCount;
            const isActive = index === currentSubjectIndex;
            const isSubjectComplete = completedQuestions === totalQuestions;

            return (
              <button
                key={subject.name}
                onClick={() => navigateToSubject(index)}
                className={`flex-shrink-0 px-3 py-2 sm:px-4 sm:py-3 rounded-lg text-xs sm:text-sm font-medium transition-colors border-2 ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-700"
                    : isSubjectComplete
                    ? "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                    : "bg-gray-100 text-gray-700 border-gray-300 hover:bg-gray-200"
                }`}
              >
                <div className="text-center">
                  <div className="flex items-center justify-center space-x-1">
                    <span>{subject.name}</span>
                    {isSubjectComplete && (
                      <CheckCircleIcon className="w-3 h-3" />
                    )}
                  </div>
                  <div className="text-xs mt-1">
                    {completedQuestions}/{totalQuestions}
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Question Navigation */}
      {hasQuestions && (
        <div className="bg-white border border-gray-200 rounded-lg p-4">
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={prevQuestion}
              disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-4 h-4 mr-2" />
              Previous Question
            </button>

            <div className="text-center">
              <h4 className="text-lg font-semibold text-gray-900">
                Question {currentQuestionIndex + 1}
              </h4>
              <p className="text-sm text-gray-600">
                {currentQuestionIndex + 1} of{" "}
                {currentSubject?.questions?.length || 0}
              </p>
            </div>

            <button
              onClick={nextQuestion}
              disabled={
                currentSubjectIndex === examData.subjects.length - 1 &&
                currentQuestionIndex ===
                  (currentSubject?.questions?.length || 1) - 1
              }
              className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Question
              <ChevronRightIcon className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Question Number Grid */}
          <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
            {Array.from(
              { length: currentSubject?.questions?.length || 0 },
              (_, index) => {
                const isCurrentQuestion = index === currentQuestionIndex;

                return (
                  <button
                    key={index}
                    onClick={() => navigateToQuestion(index)}
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors border-2 ${
                      isCurrentQuestion
                        ? "bg-blue-600 text-white border-blue-700"
                        : "bg-green-100 text-green-800 border-green-300 hover:bg-green-200"
                    }`}
                  >
                    {index + 1}
                  </button>
                );
              }
            )}
          </div>
        </div>
      )}

      {/* Question Preview */}
      {currentQuestion ? (
        <div className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm">
          <div className="mb-6">
            <div className="flex items-center justify-between mb-2">
              {/* Question name on the left */}
              <h3 className="text-xl font-semibold text-gray-900">
                Question {currentQuestionIndex + 1}
              </h3>

              {/* Subject name in the middle */}
              <h3 className="text-xl font-semibold text-blue-600">
                {currentSubject?.name}
              </h3>

              {/* Difficulty badge on the right - Only for Live and Practice */}
              {currentQuestion.difficulty &&
              examData.examMode !== "previous" ? (
                <span
                  className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                    currentQuestion.difficulty === "easy"
                      ? "bg-green-100 text-green-800"
                      : currentQuestion.difficulty === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-red-100 text-red-800"
                  }`}
                >
                  {currentQuestion.difficulty.charAt(0).toUpperCase() +
                    currentQuestion.difficulty.slice(1)}
                </span>
              ) : (
                <div></div> // Empty div to maintain spacing when no difficulty
              )}
            </div>
            <div className="flex items-center text-sm text-green-600">
              <CheckCircleIcon className="w-4 h-4 mr-1" />
              Saved Question
            </div>
          </div>

          {/* Question Text */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Question:
            </h4>
            <div className="bg-gray-50 p-4 rounded-lg border">
              <div dangerouslySetInnerHTML={{ __html: currentQuestion.text }} />
            </div>
          </div>

          {/* Options */}
          <div className="mb-6">
            <h4 className="text-lg font-semibold text-gray-800 mb-3">
              Options:
            </h4>
            <div className="space-y-3">
              {currentQuestion.options?.map((option, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border-2 ${
                    currentQuestion.correctAnswer === index
                      ? "bg-green-50 border-green-300"
                      : "bg-gray-50 border-gray-200"
                  }`}
                >
                  <div className="flex items-start space-x-3">
                    <span
                      className={`font-medium ${
                        currentQuestion.correctAnswer === index
                          ? "text-green-700"
                          : "text-gray-700"
                      }`}
                    >
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <div className="flex-1">
                      <div dangerouslySetInnerHTML={{ __html: option }} />
                      {currentQuestion.correctAnswer === index && (
                        <span className="inline-flex items-center mt-2 text-sm text-green-600">
                          <CheckCircleIcon className="w-4 h-4 mr-1" />
                          Correct Answer
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Explanation */}
          {currentQuestion.explanation && (
            <div className="mb-6">
              <h4 className="text-lg font-semibold text-gray-800 mb-3">
                Explanation:
              </h4>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <div
                  dangerouslySetInnerHTML={{
                    __html: currentQuestion.explanation,
                  }}
                />
              </div>
            </div>
          )}

          {/* Bottom Navigation Buttons */}
          <div className="flex justify-between items-center pt-6 border-t-2 border-gray-200">
            <button
              onClick={prevQuestion}
              disabled={currentSubjectIndex === 0 && currentQuestionIndex === 0}
              className="flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeftIcon className="w-5 h-5 mr-2" />
              Previous Question
            </button>

            <div className="text-center">
              <p className="text-sm text-gray-600">
                Question {currentQuestionIndex + 1} of{" "}
                {currentSubject?.questions?.length || 0}
              </p>
              <p className="text-xs text-gray-500">{currentSubject?.name}</p>
            </div>

            <button
              onClick={nextQuestion}
              disabled={
                currentSubjectIndex === examData.subjects.length - 1 &&
                currentQuestionIndex ===
                  (currentSubject?.questions?.length || 1) - 1
              }
              className="flex items-center px-6 py-3 text-base font-medium text-gray-700 bg-white border-2 border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next Question
              <ChevronRightIcon className="w-5 h-5 ml-2" />
            </button>
          </div>
        </div>
      ) : hasQuestions ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 text-center">
          <XCircleIcon className="w-12 h-12 text-yellow-600 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-yellow-800 mb-2">
            No Question Selected
          </h3>
          <p className="text-yellow-700">
            Please select a question to preview.
          </p>
        </div>
      ) : (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
          <XCircleIcon className="w-12 h-12 text-gray-400 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-600 mb-2">
            No Questions Added
          </h3>
          <p className="text-gray-500">
            No questions have been added to this subject yet.
          </p>
        </div>
      )}

      {/* Overall Status */}
      <div
        className={`rounded-lg p-4 sm:p-6 ${
          isComplete
            ? "bg-green-50 border border-green-200"
            : "bg-yellow-50 border border-yellow-200"
        }`}
      >
        <div className="flex items-center">
          <span className={`text-2xl mr-3 ${isComplete ? "✅" : "⚠️"}`}></span>
          <div>
            <h4
              className={`font-semibold ${
                isComplete ? "text-green-800" : "text-yellow-800"
              }`}
            >
              {isComplete ? "Exam Ready for Submission" : "Exam Incomplete"}
            </h4>
            <p
              className={`text-sm ${
                isComplete ? "text-green-600" : "text-yellow-600"
              }`}
            >
              {isComplete
                ? `All ${totalQuestions} questions have been added across ${examData.subjects.length} subjects.`
                : `${completedQuestions}/${totalQuestions} questions completed. Please add remaining questions.`}
            </p>
          </div>
        </div>
      </div>

      {/* Submit Button */}
      {isComplete && (
        <div className="text-center">
          <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-lg">
            🎯 Submit Exam for Publication
          </button>
        </div>
      )}
    </div>
  );
};

export default ReviewSubmitStep;
