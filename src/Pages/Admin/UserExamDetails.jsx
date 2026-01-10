import React, { useEffect, useState } from "react";
import axios from "axios";

const UserExamDetails = ({ examId, userId, onClose }) => {
  const [details, setDetails] = useState(null);
  const [userHistory, setUserHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showHistory, setShowHistory] = useState(false);

  useEffect(() => {
    fetchUserDetails();
  }, [examId, userId]);

  const fetchUserDetails = async () => {
    try {
      setLoading(true);
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/liveExam/history/${examId}/user/${userId}`
      );

      if (response.data.success) {
        setDetails(response.data);
      }
    } catch (err) {
      console.error("Error fetching user details:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchUserHistory = async () => {
    try {
      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/liveExam/history/user/${userId}/all`
      );

      if (response.data.success) {
        setUserHistory(response.data.examHistory);
        setShowHistory(true);
      }
    } catch (err) {
      console.error("Error fetching user history:", err);
    }
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

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
        <div className="bg-white rounded-2xl p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </div>
    );
  }

  if (!details) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full my-8 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-6 rounded-t-2xl flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold">{details.userDetails.name}</h2>
            <button
              onClick={() => window.open(`/user-profile?userId=${details.userDetails.userId}`, '_blank')}
              className="text-indigo-100 text-sm hover:text-white hover:underline transition-colors flex items-center mt-1"
            >
              @{details.userDetails.username}
              <svg className="w-4 h-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </button>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 rounded-full p-2 transition-colors"
          >
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Exam Info */}
          <div className="bg-gray-50 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Exam Details</h3>
            <div className="grid md:grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-gray-600">Exam:</span>
                <span className="ml-2 font-medium text-gray-900">{details.examDetails.title}</span>
              </div>
              <div>
                <span className="text-gray-600">Type:</span>
                <span className="ml-2 font-medium text-gray-900">{details.examDetails.examType}</span>
              </div>
              <div>
                <span className="text-gray-600">Duration:</span>
                <span className="ml-2 font-medium text-gray-900">{details.examDetails.duration} minutes</span>
              </div>
              <div>
                <span className="text-gray-600">Total Questions:</span>
                <span className="ml-2 font-medium text-gray-900">{details.examDetails.totalQuestions}</span>
              </div>
            </div>
          </div>

          {/* Performance Overview */}
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <div className="text-sm text-green-600 mb-1">Total Marks</div>
              <div className="text-3xl font-bold text-green-700">
                {details.performance.totalMarksObtained}
                <span className="text-lg text-green-600">/{details.performance.totalPossibleMarks}</span>
              </div>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
              <div className="text-sm text-blue-600 mb-1">Percentage</div>
              <div className="text-3xl font-bold text-blue-700">{details.performance.percentage.toFixed(2)}%</div>
            </div>
            <div className="bg-purple-50 border border-purple-200 rounded-xl p-4">
              <div className="text-sm text-purple-600 mb-1">Time Taken</div>
              <div className="text-3xl font-bold text-purple-700">{formatTime(details.timeTracking.timeConsumed)}</div>
            </div>
          </div>

          {/* Question Statistics */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Question Statistics</h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className="text-2xl font-bold text-green-600">{details.performance.correctAnswers}</div>
                <div className="text-xs text-gray-500">Correct</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-red-600">{details.performance.wrongAnswers}</div>
                <div className="text-xs text-gray-500">Wrong</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-gray-600">{details.performance.skipped}</div>
                <div className="text-xs text-gray-500">Skipped</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-orange-600">{details.performance.negativeMarksDeducted}</div>
                <div className="text-xs text-gray-500">Negative Marks</div>
              </div>
            </div>
          </div>

          {/* Subject-wise Performance */}
          {details.subjectWisePerformance && details.subjectWisePerformance.length > 0 && (
            <div className="bg-white border border-gray-200 rounded-xl p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-3">Subject-wise Performance</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-semibold text-gray-700">Subject</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Attempted</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Correct</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Wrong</th>
                      <th className="px-4 py-2 text-center text-xs font-semibold text-gray-700">Marks</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {details.subjectWisePerformance.map((subject, index) => (
                      <tr key={index} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-sm font-medium text-gray-900">{subject.subjectName}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.totalQuestions}</td>
                        <td className="px-4 py-2 text-sm text-center text-gray-700">{subject.attempted}</td>
                        <td className="px-4 py-2 text-sm text-center text-green-600 font-medium">{subject.correct}</td>
                        <td className="px-4 py-2 text-sm text-center text-red-600 font-medium">{subject.wrong}</td>
                        <td className="px-4 py-2 text-sm text-center font-semibold text-gray-900">
                          {subject.marksObtained}/{subject.maxMarks}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Violations */}
          <div className={`border rounded-xl p-4 ${details.violations.total > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Violation History</h3>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-3">
              <div className="text-center">
                <div className={`text-2xl font-bold ${details.violations.total > 0 ? 'text-red-600' : 'text-green-600'}`}>
                  {details.violations.total}
                </div>
                <div className="text-xs text-gray-600">Total</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-medium text-gray-700">{details.violations.breakdown.fullscreenExit}</div>
                <div className="text-xs text-gray-600">Fullscreen Exit</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-medium text-gray-700">{details.violations.breakdown.tabSwitching}</div>
                <div className="text-xs text-gray-600">Tab Switch</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-medium text-gray-700">{details.violations.breakdown.escapeKey}</div>
                <div className="text-xs text-gray-600">Escape Key</div>
              </div>
              <div className="text-center">
                <div className="text-xl font-medium text-gray-700">{details.violations.breakdown.windowBlur}</div>
                <div className="text-xs text-gray-600">Window Blur</div>
              </div>
            </div>

            {/* Ban Status */}
            {details.banStatus.isBanned && (
              <div className="mt-4 bg-red-100 border border-red-300 rounded-lg p-3">
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-red-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <div>
                    <div className="text-sm font-semibold text-red-800">User is Banned</div>
                    <div className="text-xs text-red-700">{details.banStatus.banReason}</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Time Tracking */}
          <div className="bg-white border border-gray-200 rounded-xl p-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Time Tracking</h3>
            <div className="grid md:grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Time Allocated:</span>
                <span className="ml-2 font-medium text-gray-900">{formatTime(details.timeTracking.timeAllocated)}</span>
              </div>
              <div>
                <span className="text-gray-600">Time Consumed:</span>
                <span className="ml-2 font-medium text-gray-900">{formatTime(details.timeTracking.timeConsumed)}</span>
              </div>
              <div>
                <span className="text-gray-600">Started At:</span>
                <span className="ml-2 font-medium text-gray-900">{formatDate(details.timeTracking.startedAt)}</span>
              </div>
              <div>
                <span className="text-gray-600">Submitted At:</span>
                <span className="ml-2 font-medium text-gray-900">{formatDate(details.timeTracking.submittedAt)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserExamDetails;
