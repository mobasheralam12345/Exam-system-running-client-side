import React from "react";

const ExamSetupStep = ({ examData, setExamData }) => {
  const examTypes = ["BCS", "HSC", "Bank", "University", "Job"];
  const hscGroups = ["Science", "Business Studies", "Humanities"];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 20 }, (_, i) => currentYear - i);

  const renderLiveExamFields = () => (
    <>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Start Date & Time *
        </label>
        <input
          type="datetime-local"
          value={examData.startTime || ""}
          onChange={(e) => {
            console.log("Start time changed:", e.target.value);
            setExamData({ type: "SET_START_TIME", payload: e.target.value });
          }}
          min={new Date().toISOString().slice(0, 16)}
          className="w-full px-3 py-2 border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Select when the exam should start
        </p>
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration (minutes) *
        </label>
        <input
          type="number"
          value={examData.duration || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            console.log("Duration changed:", value);
            setExamData({ type: "SET_DURATION", payload: value });
          }}
          min="1"
          max="600"
          placeholder="Enter duration in minutes"
          className="w-full px-3 py-2 border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
        <p className="text-xs text-gray-500 mt-1">
          Exam will automatically end after this duration (1-600 minutes)
        </p>
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Access Password (Optional)
        </label>
        <input
          type="text"
          value={examData.password || ""}
          onChange={(e) =>
            setExamData({ type: "SET_PASSWORD", payload: e.target.value })
          }
          placeholder="Leave empty for no password"
          className="w-full px-3 py-2 border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* Premium/Free as Radio Buttons */}
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-3">
          Access Type *
        </label>
        <div className="space-y-3">
          <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              id="free"
              name="accessType"
              checked={!examData.isPremium}
              onChange={() => {
                console.log("Access type changed to: Free");
                setExamData({ type: "SET_PREMIUM", payload: false });
              }}
              className="h-4 w-4 text-blue-600 text-black bg-gray-50 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="free"
              className="ml-3 flex items-center text-sm text-gray-700 cursor-pointer"
            >
              <span className="text-lg mr-2">🆓</span>
              <div>
                <div className="font-medium">Free Access</div>
                <div className="text-xs text-gray-500">
                  Available to all users
                </div>
              </div>
            </label>
          </div>
          <div className="flex items-center p-3 border rounded-lg hover:bg-gray-50 transition-colors">
            <input
              type="radio"
              id="premium"
              name="accessType"
              checked={examData.isPremium}
              onChange={() => {
                console.log("Access type changed to: Premium");
                setExamData({ type: "SET_PREMIUM", payload: true });
              }}
              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label
              htmlFor="premium"
              className="ml-3 flex items-center text-sm text-gray-700 cursor-pointer"
            >
              <span className="text-lg mr-2">👑</span>
              <div>
                <div className="font-medium">Premium Only</div>
                <div className="text-xs text-gray-500">
                  Only premium subscribers can access
                </div>
              </div>
            </label>
          </div>
        </div>
      </div>
    </>
  );

  const renderPreviousYearFields = () => (
    <>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Exam Year *
        </label>
        <select
          value={examData.examYear || ""}
          onChange={(e) => {
            console.log("Exam year changed:", e.target.value);
            setExamData({ type: "SET_EXAM_YEAR", payload: e.target.value });
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">Select year</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Session/Batch (Optional)
        </label>
        <input
          type="text"
          value={examData.session || ""}
          onChange={(e) =>
            setExamData({ type: "SET_SESSION", payload: e.target.value })
          }
          placeholder="e.g., 43rd BCS, HSC 2023"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
    </>
  );

  const renderPracticeFields = () => (
    <>
      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Duration (minutes) - Optional
        </label>
        <input
          type="number"
          value={examData.duration || ""}
          onChange={(e) => {
            const value = parseInt(e.target.value) || 0;
            setExamData({ type: "SET_DURATION", payload: value });
          }}
          min="1"
          placeholder="Leave empty for unlimited"
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div className="col-span-1 sm:col-span-2">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Practice Type
        </label>
        <select
          value={examData.practiceType || "unlimited"}
          onChange={(e) =>
            setExamData({ type: "SET_PRACTICE_TYPE", payload: e.target.value })
          }
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="unlimited">Unlimited Attempts</option>
          <option value="timed">Timed Practice</option>
          <option value="mock">Mock Test</option>
        </select>
      </div>

      <div className="col-span-1 sm:col-span-4">
        <div className="flex items-center p-3 border rounded-lg">
          <input
            type="checkbox"
            id="showResults"
            checked={examData.showResults || false}
            onChange={(e) =>
              setExamData({
                type: "SET_SHOW_RESULTS",
                payload: e.target.checked,
              })
            }
            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
          />
          <label
            htmlFor="showResults"
            className="ml-3 block text-sm text-gray-700"
          >
            <div className="font-medium">Show results immediately</div>
            <div className="text-xs text-gray-500">
              Display results right after exam completion
            </div>
          </label>
        </div>
      </div>
    </>
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          {examData.examMode === "live" && "Live Exam Configuration"}
          {examData.examMode === "previous" && "Previous Year Paper Setup"}
          {examData.examMode === "practice" && "Practice Test Configuration"}
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          {examData.examMode === "live" &&
            "Set up your live exam with timing and access controls"}
          {examData.examMode === "previous" &&
            "Configure historical exam paper details"}
          {examData.examMode === "practice" &&
            "Set up practice test parameters"}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Common Fields */}
        <div className="col-span-1 sm:col-span-2 lg:col-span-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Title *
          </label>
          <input
            type="text"
            value={examData.title || ""}
            onChange={(e) => {
              console.log("Title changed:", e.target.value);
              setExamData({ type: "SET_TITLE", payload: e.target.value });
            }}
            placeholder={
              examData.examMode === "live"
                ? "e.g., BCS Preliminary Live Test 2024"
                : examData.examMode === "previous"
                ? "e.g., 43rd BCS Preliminary 2022"
                : "e.g., BCS Math Practice Test"
            }
            className="w-full px-3 py-2 border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div className="col-span-1 sm:col-span-2">
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Exam Type *
          </label>
          <select
            value={examData.examType || ""}
            onChange={(e) => {
              console.log("Exam type changed:", e.target.value);
              setExamData({ type: "SET_EXAM_TYPE", payload: e.target.value });
              // Clear HSC group when exam type changes
              if (e.target.value !== "HSC") {
                setExamData({ type: "SET_HSC_GROUP", payload: "" });
              }
            }}
            className="w-full px-3 py-2 border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Select exam type</option>
            {examTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>
        </div>

        {/* HSC Group Field - Only show when HSC is selected */}
        {examData.examType === "HSC" && (
          <div className="col-span-1 sm:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              HSC Group *
            </label>
            <select
              value={examData.hscGroup || ""}
              onChange={(e) => {
                console.log("HSC group changed:", e.target.value);
                setExamData({ type: "SET_HSC_GROUP", payload: e.target.value });
              }}
              className="w-full px-3 py-2 border border-gray-300 text-black bg-gray-50 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select HSC group</option>
              {hscGroups.map((group) => (
                <option key={group} value={group}>
                  {group}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              Select the HSC group for this exam
            </p>
          </div>
        )}

        {/* Mode-specific fields */}
        {examData.examMode === "live" && renderLiveExamFields()}
        {examData.examMode === "previous" && renderPreviousYearFields()}
        {examData.examMode === "practice" && renderPracticeFields()}
      </div>
    </div>
  );
};

export default ExamSetupStep;
