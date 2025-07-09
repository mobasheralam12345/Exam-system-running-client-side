import React from "react";

const ExamModeSelectionStep = ({ examData, setExamData }) => {
  const examModes = [
    {
      id: "live",
      title: "Live Exam",
      description: "Real-time exam with scheduled start/end times",
      icon: "🔴",
      features: [
        "Scheduled timing",
        "Password protection",
        "Premium access",
        "All difficulty levels",
      ],
      color: "green",
    },
    {
      id: "previous",
      title: "Previous Year Papers",
      description: "Historical exam papers for practice",
      icon: "📚",
      features: [
        "Year-based organization",
        "No time restrictions",
        "Free access",
        "Standard difficulty",
      ],
      color: "green",
    },
    {
      id: "practice",
      title: "Practice Test",
      description: "Unlimited practice sessions",
      icon: "💪",
      features: [
        "Flexible timing",
        "Instant feedback",
        "Multiple attempts",
        "All difficulty levels",
      ],
      color: "green",
    },
  ];

  const selectMode = (mode) => {
    setExamData({ type: "SET_EXAM_MODE", payload: mode });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">
          Choose Exam Mode
        </h2>
        <p className="text-base sm:text-lg text-gray-600">
          Select the type of exam you want to create
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
        {examModes.map((mode) => (
          <div
            key={mode.id}
            onClick={() => selectMode(mode.id)}
            className={`relative cursor-pointer rounded-xl border-2 p-4 sm:p-6 transition-all duration-200 hover:shadow-lg ${
              examData.examMode === mode.id
                ? `border-${mode.color}-500 bg-${mode.color}-50 shadow-md`
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            {examData.examMode === mode.id && (
              <div
                className={`absolute -top-2 -right-2 w-5 h-5 sm:w-6 sm:h-6 bg-${mode.color}-500 rounded-full flex items-center justify-center`}
              >
                <svg
                  className="w-3 h-3 sm:w-4 sm:h-4 text-white"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
            )}

            <div className="text-center">
              <div className="text-3xl sm:text-4xl mb-3 sm:mb-4">
                {mode.icon}
              </div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2">
                {mode.title}
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-3 sm:mb-4">
                {mode.description}
              </p>

              <div className="space-y-2">
                {mode.features.map((feature, index) => (
                  <div
                    key={index}
                    className="flex items-center text-xs sm:text-sm text-gray-700"
                  >
                    <svg
                      className="w-3 h-3 sm:w-4 sm:h-4 text-green-500 mr-2 flex-shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                        clipRule="evenodd"
                      />
                    </svg>
                    {feature}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>

      {examData.examMode && (
        <div className="mt-6 sm:mt-8 p-3 sm:p-4 bg-blue-50 rounded-lg border border-blue-200">
          <div className="flex items-center">
            <svg
              className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600 mr-2 flex-shrink-0"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-sm sm:text-base text-blue-800 font-medium">
              {examModes.find((m) => m.id === examData.examMode)?.title} mode
              selected
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ExamModeSelectionStep;
