import React from "react";
import { CheckCircleIcon } from "@heroicons/react/24/outline";

const SubjectSelectionStep = ({ examData, setExamData }) => {
  // HSC Group-specific subjects
  const hscSubjects = {
    Science: [
      "বাংলা ১ম পত্র",
      "বাংলা ২য় পত্র",
      "English 1st Paper",
      "English 2nd Paper",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "Physics 1st Paper",
      "Physics 2nd Paper",
      "Chemistry 1st Paper",
      "Chemistry 2nd Paper",
      "Biology 1st Paper",
      "Biology 2nd Paper",
      "Higher Mathematics 1st Paper",
      "Higher Mathematics 2nd Paper",
    ],
    "Business Studies": [
      "বাংলা ১ম পত্র",
      "বাংলা ২য় পত্র",
      "English 1st Paper",
      "English 2nd Paper",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "হিসাববিজ্ঞান ১ম পত্র",
      "হিসাববিজ্ঞান ২য় পত্র",
      "ব্যবসায় সংগঠন ও ব্যবস্থাপনা ১ম পত্র",
      "ব্যবসায় সংগঠন ও ব্যবস্থাপনা ২য় পত্র",
      "ফিন্যান্স, ব্যাংকিং ও বিমা ১ম পত্র",
      "ফিন্যান্স, ব্যাংকিং ও বিমা ২য় পত্র",
      "উৎপাদন ব্যবস্থাপনা ও বিপণন ১ম পত্র",
      "উৎপাদন ব্যবস্থাপনা ও বিপণন ২য় পত্র",
    ],
    Humanities: [
      "বাংলা ১ম পত্র",
      "বাংলা ২য় পত্র",
      "English 1st Paper",
      "English 2nd Paper",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "পৌরনীতি ও সুশাসন ১ম পত্র",
      "পৌরনীতি ও সুশাসন ২য় পত্র",
      "অর্থনীতি ১ম পত্র",
      "অর্থনীতি ২য় পত্র",
      "ইতিহাস ১ম পত্র",
      "ইতিহাস ২য় পত্র",
      "ইসলামের ইতিহাস ও সংস্কৃতি ১ম পত্র",
      "ইসলামের ইতিহাস ও সংস্কৃতি ২য় পত্র",
      "সমাজবিজ্ঞান ১ম পত্র",
      "সমাজবিজ্ঞান ২য় পত্র",
      "সমাজকর্ম ১ম পত্র",
      "সমাজকর্ম ২য় পত্র",
      "যুক্তিবিদ্যা ১ম পত্র",
      "যুক্তিবিদ্যা ২য় পত্র",
      "ভূগোল ১ম পত্র",
      "ভূগোল ২য় পত্র",
      "মনোবিজ্ঞান ১ম পত্র",
      "মনোবিজ্ঞান ২য় পত্র",
      "কৃষি শিক্ষা ১ম পত্র",
      "কৃষি শিক্ষা ২য় পত্র",
      "ইসলাম শিক্ষা ১ম পত্র",
      "ইসলাম শিক্ষা ২য় পত্র",
    ],
  };

  // Define subject sets for different exam types
  const subjectSets = {
    BCS: [
      "বাংলা ভাষা ও সাহিত্য",
      "English Language and Literature",
      "গাণিতিক যুক্তি",
      "সাধারণ বিজ্ঞান",
      "কম্পিউটার ও তথ্যপ্রযুক্তি",
      "বাংলাদেশ বিষয়াবলি",
      "আন্তর্জাতিক বিষয়াবলি",
      "ভূগোল (বাংলাদেশ ও বিশ্ব), পরিবেশ ও দুর্যোগ ব্যবস্থাপনা",
      "মানসিক দক্ষতা",
      "নৈতিকতা, মূল্যবোধ ও সুশাসন",
    ],
    Science: [
      "বাংলা ১ম পত্র",
      "বাংলা ২য় পত্র",
      "English 1st Paper",
      "English 2nd Paper",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "Physics 1st Paper",
      "Physics 2nd Paper",
      "Chemistry 1st Paper",
      "Chemistry 2nd Paper",
      "Biology 1st Paper",
      "Biology 2nd Paper",
      "Higher Mathematics 1st Paper",
      "Higher Mathematics 2nd Paper",
    ],
    "Business Studies": [
      "বাংলা ১ম পত্র",
      "বাংলা ২য় পত্র",
      "English 1st Paper",
      "English 2nd Paper",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "হিসাববিজ্ঞান ১ম পত্র",
      "হিসাববিজ্ঞান ২য় পত্র",
      "ব্যবসায় সংগঠন ও ব্যবস্থাপনা ১ম পত্র",
      "ব্যবসায় সংগঠন ও ব্যবস্থাপনা ২য় পত্র",
      "ফিন্যান্স, ব্যাংকিং ও বিমা ১ম পত্র",
      "ফিন্যান্স, ব্যাংকিং ও বিমা ২য় পত্র",
      "উৎপাদন ব্যবস্থাপনা ও বিপণন ১ম পত্র",
      "উৎপাদন ব্যবস্থাপনা ও বিপণন ২য় পত্র",
    ],
    Humanities: [
      "বাংলা ১ম পত্র",
      "বাংলা ২য় পত্র",
      "English 1st Paper",
      "English 2nd Paper",
      "তথ্য ও যোগাযোগ প্রযুক্তি",
      "পৌরনীতি ও সুশাসন ১ম পত্র",
      "পৌরনীতি ও সুশাসন ২য় পত্র",
      "অর্থনীতি ১ম পত্র",
      "অর্থনীতি ২য় পত্র",
      "ইতিহাস ১ম পত্র",
      "ইতিহাস ২য় পত্র",
      "ইসলামের ইতিহাস ও সংস্কৃতি ১ম পত্র",
      "ইসলামের ইতিহাস ও সংস্কৃতি ২য় পত্র",
      "সমাজবিজ্ঞান ১ম পত্র",
      "সমাজবিজ্ঞান ২য় পত্র",
      "সমাজকর্ম ১ম পত্র",
      "সমাজকর্ম ২য় পত্র",
      "যুক্তিবিদ্যা ১ম পত্র",
      "যুক্তিবিদ্যা ২য় পত্র",
      "ভূগোল ১ম পত্র",
      "ভূগোল ২য় পত্র",
      "মনোবিজ্ঞান ১ম পত্র",
      "মনোবিজ্ঞান ২য় পত্র",
      "কৃষি শিক্ষা ১ম পত্র",
      "কৃষি শিক্ষা ২য় পত্র",
      "ইসলাম শিক্ষা ১ম পত্র",
      "ইসলাম শিক্ষা ২য় পত্র",
    ],
    Bank: [
      "Bangla",
      "English",
      "Mathematics",
      "General Knowledge",
      "Computer Knowledge",
      "Accounting",
      "Economics",
    ],
  };

  // Color schemes for different exam types
  const colorSchemes = {
    BCS: {
      light: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-150",
      selected: "bg-blue-600 text-white border-blue-700 shadow-md",
      selectedBg: "bg-blue-50 border-blue-200",
    },
    HSC: {
      light: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-150",
      selected: "bg-blue-600 text-white border-blue-700 shadow-md",
      selectedBg: "bg-blue-50 border-blue-200",
    },
    Bank: {
      light: "bg-blue-100 text-blue-700 border-blue-200 hover:bg-blue-150",
      selected: "bg-blue-600 text-white border-blue-700 shadow-md",
      selectedBg: "bg-blue-50 border-blue-200",
    },
  };

  // Get available subjects based on exam type and HSC group
  const getAvailableSubjects = () => {
    if (examData.examType === "HSC" && examData.hscGroup) {
      return hscSubjects[examData.hscGroup] || [];
    }
    return subjectSets[examData.examType] || [];
  };

  const availableSubjects = getAvailableSubjects();

  const currentColorScheme =
    colorSchemes[examData.examType] || colorSchemes["BCS"];

  const addSubject = (subjectName) => {
    setExamData({
      type: "ADD_SUBJECT",
      payload: { name: subjectName, questionCount: 10 },
    });
  };

  const removeSubject = (subjectName) => {
    setExamData({
      type: "REMOVE_SUBJECT",
      payload: subjectName,
    });
  };

  const updateQuestionCount = (subjectName, count) => {
    setExamData({
      type: "UPDATE_QUESTION_COUNT",
      payload: { subjectName, count: parseInt(count) || 0 },
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
          Subject Selection
        </h2>
        <p className="text-sm sm:text-base text-gray-600">
          Choose subjects for{" "}
          <span className="font-semibold text-blue-600">
            {examData.examType}
            {examData.examType === "HSC" &&
              examData.hscGroup &&
              ` (${examData.hscGroup})`}
          </span>{" "}
          exam and set question counts for each
        </p>
      </div>

      {/* Show exam type warning if not selected */}
      {!examData.examType && (
        <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-yellow-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-yellow-800 font-medium">
              Please select an exam type in the previous step to see available
              subjects.
            </span>
          </div>
        </div>
      )}

      {/* HSC Group warning if HSC selected but no group */}
      {examData.examType === "HSC" && !examData.hscGroup && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-center">
            <svg
              className="w-5 h-5 text-amber-600 mr-2"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
            <span className="text-amber-800 font-medium">
              Please select an HSC group in the previous step to see
              group-specific subjects.
            </span>
          </div>
        </div>
      )}

      {/* HSC Group info display */}
      {examData.examType === "HSC" && examData.hscGroup && (
        <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-center">
            <CheckCircleIcon className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <h3 className="text-sm font-medium text-blue-800">
                HSC {examData.hscGroup} Group Selected
              </h3>
              <p className="text-xs text-blue-600 mt-1">
                Showing subjects specific to {examData.hscGroup} group
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Available Subjects */}
      {examData.examType && availableSubjects.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
            Available Subjects for {examData.examType}
            {examData.examType === "HSC" &&
              examData.hscGroup &&
              ` (${examData.hscGroup} Group)`}{" "}
            Exam
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-3">
            {availableSubjects.map((subject) => {
              const isSelected = examData.subjects?.some(
                (s) => s.name === subject
              );

              return (
                <button
                  key={subject}
                  onClick={() =>
                    isSelected ? removeSubject(subject) : addSubject(subject)
                  }
                  className={`p-2 sm:p-3 text-xs sm:text-sm font-medium rounded-lg border-2 transition-all duration-200 ${
                    isSelected
                      ? currentColorScheme.selected
                      : currentColorScheme.light
                  }`}
                >
                  <div className="flex items-center justify-center">
                    <span className="truncate text-center">{subject}</span>
                    {isSelected && (
                      <CheckCircleIcon className="w-3 h-3 sm:w-4 sm:h-4 ml-1 flex-shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Selected Subjects */}
      {examData.subjects && examData.subjects.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-4">
            Selected Subjects
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {examData.subjects.map((subject) => (
              <div
                key={subject.name}
                className={`flex flex-col sm:flex-row sm:items-center justify-between p-3 sm:p-4 rounded-lg border space-y-2 sm:space-y-0 ${currentColorScheme.selectedBg}`}
              >
                <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
                  <span
                    className={`font-medium ${
                      examData.examType === "BCS"
                        ? "text-blue-900"
                        : examData.examType === "HSC"
                        ? "text-blue-900"
                        : examData.examType === "Bank"
                        ? "text-teal-900"
                        : examData.examType === "University"
                        ? "text-indigo-900"
                        : "text-emerald-900"
                    }`}
                  >
                    {subject.name}
                  </span>
                  <div className="flex items-center space-x-2">
                    <label
                      className={`text-xs sm:text-sm ${
                        examData.examType === "BCS"
                          ? "text-blue-700"
                          : examData.examType === "HSC"
                          ? "text-blue-700"
                          : examData.examType === "Bank"
                          ? "text-teal-700"
                          : examData.examType === "University"
                          ? "text-indigo-700"
                          : "text-emerald-700"
                      }`}
                    >
                      Questions:
                    </label>
                    <input
                      type="number"
                      value={subject.questionCount || ""}
                      onChange={(e) =>
                        updateQuestionCount(subject.name, e.target.value)
                      }
                      min="1"
                      max="100"
                      className={`w-16 sm:w-20 px-2 py-1 text-xs sm:text-sm border rounded focus:outline-none focus:ring-2 ${
                        examData.examType === "BCS"
                          ? "border-blue-300 focus:ring-blue-500"
                          : examData.examType === "HSC"
                          ? "border-blue-300 focus:ring-blue-500"
                          : examData.examType === "Bank"
                          ? "border-teal-300 focus:ring-teal-500"
                          : examData.examType === "University"
                          ? "border-indigo-300 focus:ring-indigo-500"
                          : "border-emerald-300 focus:ring-emerald-500"
                      }`}
                    />
                  </div>
                </div>
                <button
                  onClick={() => removeSubject(subject.name)}
                  className="text-red-600 hover:text-red-800 font-medium text-xs sm:text-sm self-start sm:self-center transition-colors"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="mt-4 sm:mt-6 p-3 sm:p-4 bg-gray-50 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">Exam Summary</h4>
            <div className="text-xs sm:text-sm text-gray-600 space-y-1">
              <p>
                Exam Type:{" "}
                <span className="font-medium">
                  {examData.examType}
                  {examData.examType === "HSC" &&
                    examData.hscGroup &&
                    ` (${examData.hscGroup})`}
                </span>
              </p>
              <p>
                Total Subjects:{" "}
                <span className="font-medium">{examData.subjects.length}</span>
              </p>
              <p>
                Total Questions:{" "}
                <span className="font-medium">
                  {examData.subjects.reduce(
                    (sum, subject) => sum + (subject.questionCount || 0),
                    0
                  )}
                </span>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SubjectSelectionStep;
