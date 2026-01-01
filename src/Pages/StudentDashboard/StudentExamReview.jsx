import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiMinusCircle,
  FiClock,
  FiAward,
  FiTrendingUp,
  FiTarget,
  FiChevronDown,
  FiChevronUp,
} from "react-icons/fi";
import axios from "axios";

const StudentExamReview = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [examType, setExamType] = useState("live");

  useEffect(() => {
    fetchReviewData();
  }, [submissionId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);
      
      // Determine exam type from localStorage or check both
      const storedType = localStorage.getItem(`exam_${submissionId}_type`);
      const typeToUse = storedType || examType;

      // Get authentication token
      const token = localStorage.getItem("userToken");
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Use different endpoints for live vs practice exams
      let apiUrl;
      if (typeToUse === "live") {
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/liveExam/student/exam-review/${submissionId}?examType=live`;
      } else {
        // Practice exam uses dedicated endpoint
        apiUrl = `${import.meta.env.VITE_BACKEND_URL}/practice-exam/review/${submissionId}`;
      }

      console.log(`[StudentExamReview] Fetching review from: ${apiUrl}`);

      const response = await axios.get(apiUrl, { headers });

      if (response.data.success) {
        console.log(`[StudentExamReview] Review data received:`, response.data.reviewData);
        console.log(`[StudentExamReview] Subjects count:`, response.data.reviewData.subjects?.length || 0);
        setReviewData(response.data.reviewData);
        // Expand all subjects by default
        const expanded = {};
        response.data.reviewData.subjects.forEach((_, index) => {
          expanded[index] = true;
        });
        setExpandedSubjects(expanded);
      }
    } catch (err) {
      console.error("Error fetching review data:", err);
      setError("Failed to load exam review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (index) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "from-green-500 to-emerald-600";
    if (percentage >= 60) return "from-blue-500 to-cyan-600";
    if (percentage >= 40) return "from-amber-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90) return { text: "Excellent", color: "bg-green-100 text-green-700" };
    if (percentage >= 80) return { text: "Very Good", color: "bg-blue-100 text-blue-700" };
    if (percentage >= 70) return { text: "Good", color: "bg-cyan-100 text-cyan-700" };
    if (percentage >= 60) return { text: "Average", color: "bg-amber-100 text-amber-700" };
    if (percentage >= 40) return { text: "Below Average", color: "bg-orange-100 text-orange-700" };
    return { text: "Needs Improvement", color: "bg-red-100 text-red-700" };
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 font-bold text-xl">Loading exam review...</p>
        </div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Review</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const { examInfo, overallStats, timeAnalysis, subjectWisePerformance, subjects } = reviewData;
  const performanceBadge = getPerformanceBadge(overallStats.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <button
              onClick={() => navigate("/student/dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
            >
              <FiArrowLeft size={20} />
              <span>Back to Dashboard</span>
            </button>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-2xl font-bold text-gray-900">{examInfo.title}</h1>
              <p className="text-sm text-gray-600">{examInfo.examType} • {examInfo.totalQuestions} Questions</p>
            </div>
            <div className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getPerformanceColor(overallStats.percentage)}`}>
              {overallStats.percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Statistics */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Overall Performance</h2>
            <span className={`px-4 py-2 rounded-full font-bold ${performanceBadge.color}`}>
              {performanceBadge.text}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiAward className="text-blue-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Total Marks</span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.totalMarksObtained.toFixed(1)} / {overallStats.totalPossibleMarks}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Correct</span>
              </div>
              <p className="text-2xl font-bold text-green-600">{overallStats.correctAnswers}</p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border border-red-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiXCircle className="text-red-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Wrong</span>
              </div>
              <p className="text-2xl font-bold text-red-600">{overallStats.wrongAnswers}</p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiMinusCircle className="text-gray-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">Skipped</span>
              </div>
              <p className="text-2xl font-bold text-gray-600">{overallStats.skipped}</p>
            </div>
          </div>

          {/* Time Analysis */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiClock className="text-indigo-600" />
              Time Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-semibold">Time Allocated</span>
                <span className="font-bold text-gray-900">{formatTime(timeAnalysis.timeAllocated)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-semibold">Time Used</span>
                <span className="font-bold text-indigo-600">{formatTime(timeAnalysis.timeConsumed)}</span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-semibold">Time Remaining</span>
                <span className="font-bold text-green-600">{formatTime(timeAnalysis.timeRemaining)}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Questions */}
        <div className="space-y-6">
          {subjects.map((subject, subjectIndex) => {
            const subjectPerf = subjectWisePerformance.find((s) => s.subjectName === subject.subjectName);
            const isExpanded = expandedSubjects[subjectIndex];

            return (
              <div key={subjectIndex} className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden">
                {/* Subject Header */}
                <div
                  onClick={() => toggleSubject(subjectIndex)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">{subject.subjectName}</h3>
                      {subjectPerf && (
                        <div className="flex gap-6 text-white text-sm">
                          <span className="flex items-center gap-1">
                            <FiCheckCircle size={16} />
                            Correct: {subjectPerf.correct}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiXCircle size={16} />
                            Wrong: {subjectPerf.wrong}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMinusCircle size={16} />
                            Skipped: {subjectPerf.skipped}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiAward size={16} />
                            Marks: {subjectPerf.marksObtained?.toFixed(1)} / {subjectPerf.maxMarks}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-white">
                      {isExpanded ? <FiChevronUp size={28} /> : <FiChevronDown size={28} />}
                    </div>
                  </div>
                </div>

                {/* Questions */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {subject.questions.map((question, qIndex) => {
                      const optionLabels = ["A", "B", "C", "D", "E"];

                      return (
                        <div
                          key={qIndex}
                          className={`border-2 rounded-2xl p-6 ${
                            question.isSkipped
                              ? "border-gray-300 bg-gray-50"
                              : question.isCorrect
                              ? "border-green-300 bg-green-50"
                              : "border-red-300 bg-red-50"
                          }`}
                        >
                          {/* Question Header */}
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg">
                                Q{question.questionNumber}
                              </span>
                              {question.isSkipped ? (
                                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-bold rounded-full flex items-center gap-1">
                                  <FiMinusCircle size={16} />
                                  Skipped
                                </span>
                              ) : question.isCorrect ? (
                                <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-bold rounded-full flex items-center gap-1">
                                  <FiCheckCircle size={16} />
                                  Correct
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-bold rounded-full flex items-center gap-1">
                                  <FiXCircle size={16} />
                                  Wrong
                                </span>
                              )}
                              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                                +{question.marks} | -{question.negativeMarks}
                              </span>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">
                              {question.difficulty}
                            </span>
                          </div>

                          {/* Question Text */}
                          <div
                            className="text-gray-900 font-medium text-lg mb-4 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: question.text }}
                          />

                          {/* Options */}
                          <div className="space-y-3">
                            {question.options.map((option, optIndex) => {
                              const isUserAnswer = question.userAnswer === optIndex;
                              const isCorrectAnswer = question.correctAnswer === optIndex;

                              let optionClass = "p-4 rounded-xl border-2 transition-all ";

                              if (isCorrectAnswer) {
                                optionClass += "border-green-500 bg-green-100 ";
                              } else if (isUserAnswer) {
                                optionClass += "border-red-500 bg-red-100 ";
                              } else {
                                optionClass += "border-gray-300 bg-white ";
                              }

                              return (
                                <div key={optIndex} className={optionClass}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="font-bold text-gray-700 text-lg">
                                        {optionLabels[optIndex]}.
                                      </span>
                                      <div
                                        className="text-gray-900 flex-1"
                                        dangerouslySetInnerHTML={{ __html: option }}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      {isUserAnswer && (
                                        <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold rounded-full">
                                          Your Answer
                                        </span>
                                      )}
                                      {isCorrectAnswer && (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full flex items-center gap-1">
                                          <FiCheckCircle size={14} />
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {/* Explanation */}
                          {question.explanation && (
                            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                              <h5 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                                <FiTarget />
                                Explanation
                              </h5>
                              <div
                                className="text-sm text-amber-800 leading-relaxed"
                                dangerouslySetInnerHTML={{ __html: question.explanation }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentExamReview;
