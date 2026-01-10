import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import AdminNavbar from "./AdminNavbar";
import UserExamDetails from "./UserExamDetails";

const ExamRanking = () => {
  const { examId } = useParams();
  const navigate = useNavigate();

  // State
  const [exam, setExam] = useState(null);
  const [rankings, setRankings] = useState([]);
  const [filteredRankings, setFilteredRankings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter states
  const [violationThreshold, setViolationThreshold] = useState(0);
  const [violationFilter, setViolationFilter] = useState("");
  const [violationValue, setViolationValue] = useState("");
  const [bannedOnly, setBannedOnly] = useState(false);
  const [rankRange, setRankRange] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  // Modal state
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetails, setShowUserDetails] = useState(false);

  // Stats
  const [isFiltered, setIsFiltered] = useState(false);
  const [totalSubmissions, setTotalSubmissions] = useState(0);

  useEffect(() => {
    fetchExamRanking();
  }, [examId, violationThreshold, violationFilter, violationValue, bannedOnly, rankRange, searchQuery]);

  const fetchExamRanking = async () => {
    try {
      setLoading(true);
      setError(null);

      // Build query params
      const params = new URLSearchParams();
      params.append("violationThreshold", violationThreshold);

      if (violationFilter && violationValue) {
        params.append("violationFilter", `${violationFilter}:${violationValue}`);
      }
      if (bannedOnly) {
        params.append("bannedOnly", "true");
      }
      if (rankRange) {
        params.append("rankRange", rankRange);
      }
      if (searchQuery) {
        params.append("search", searchQuery);
      }

      const response = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/liveExam/history/${examId}/ranking?${params.toString()}`
      );

      if (response.data.success) {
        setExam(response.data.exam);
        setFilteredRankings(response.data.rankings);
        setIsFiltered(response.data.isFiltered);
        setTotalSubmissions(response.data.totalSubmissions);
      }
    } catch (err) {
      console.error("Error fetching exam ranking:", err);
      setError("Failed to load exam ranking");
    } finally {
      setLoading(false);
    }
  };

  const handleUserClick = (userId) => {
    setSelectedUser(userId);
    setShowUserDetails(true);
  };

  const getViolationColor = (violations) => {
    if (violations === 0) return "text-green-600 bg-green-100";
    if (violations <= 3) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
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

  if (loading && !exam) {
    return (
      <>
        <AdminNavbar />
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-indigo-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <AdminNavbar />
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 py-12 px-6">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="mb-8">
            <button
              onClick={() => navigate("/admin/exam-history")}
              className="mb-4 flex items-center text-indigo-600 hover:text-indigo-800 transition-colors"
            >
              <svg className="w-5 h-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Back to Exam History
            </button>

            {exam && (
              <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
                <h1 className="text-3xl font-bold text-gray-800 mb-2">{exam.title}</h1>
                <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                    {exam.examType}
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {exam.duration} minutes
                  </span>
                  <span className="flex items-center">
                    <svg className="w-4 h-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    {exam.totalQuestions} questions
                  </span>
                </div>
              </div>
            )}
          </div>

          {/* Controls Section */}
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Filters & Settings</h2>

            {/* Violation Threshold */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Violation Threshold
                <span className="ml-2 text-xs text-gray-500">(Users with ≤ threshold violations are considered "eligible")</span>
              </label>
              <select
                value={violationThreshold}
                onChange={(e) => setViolationThreshold(parseInt(e.target.value))}
                className="w-full md:w-64 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
              >
                <option value="0">0 violations (strict)</option>
                <option value="1">≤ 1 violation</option>
                <option value="2">≤ 2 violations</option>
                <option value="3">≤ 3 violations</option>
                <option value="5">≤ 5 violations</option>
                <option value="10">≤ 10 violations</option>
              </select>
            </div>

            {/* Filters Grid */}
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Violation Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Violation Count</label>
                <div className="flex gap-2">
                  <select
                    value={violationFilter}
                    onChange={(e) => setViolationFilter(e.target.value)}
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                  >
                    <option value="">No filter</option>
                    <option value="lte">≤</option>
                    <option value="gte">≥</option>
                    <option value="eq">=</option>
                  </select>
                  <input
                    type="number"
                    min="0"
                    value={violationValue}
                    onChange={(e) => setViolationValue(e.target.value)}
                    placeholder="Value"
                    disabled={!violationFilter}
                    className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent disabled:bg-gray-100"
                  />
                </div>
              </div>

              {/* Rank Range */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Rank Range</label>
                <input
                  type="text"
                  value={rankRange}
                  onChange={(e) => setRankRange(e.target.value)}
                  placeholder="e.g., 1-10"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Search User</label>
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Name or email..."
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
                />
              </div>

              {/* Banned Only Toggle */}
              <div className="flex items-end">
                <label className="flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={bannedOnly}
                    onChange={(e) => setBannedOnly(e.target.checked)}
                    className="w-5 h-5 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700">Banned Users Only</span>
                </label>
              </div>
            </div>

            {/* Clear Filters */}
            {isFiltered && (
              <div className="mt-4">
                <button
                  onClick={() => {
                    setViolationFilter("");
                    setViolationValue("");
                    setBannedOnly(false);
                    setRankRange("");
                    setSearchQuery("");
                  }}
                  className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </div>

          {/* Stats */}
          {isFiltered && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <p className="text-sm text-blue-800">
                <strong>Filtered Ranking:</strong> Showing {filteredRankings.length} of {totalSubmissions} total submissions. 
                Ranks are contextual to this filtered view.
              </p>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Rankings Table */}
          {filteredRankings.length === 0 ? (
            <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
              <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-700 mb-2">No Results Found</h3>
              <p className="text-gray-500">Try adjusting your filters</p>
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gradient-to-r from-indigo-50 to-purple-50">
                    <tr>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Rank
                      </th>
                      <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Marks
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Percentage
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Time Taken
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Violations
                      </th>
                      <th className="px-6 py-4 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredRankings.map((ranking) => (
                      <tr
                        key={ranking.userId}
                        onClick={() => handleUserClick(ranking.userId)}
                        className={`cursor-pointer transition-colors ${
                          ranking.isBanned ? "bg-red-50 hover:bg-red-100" : "hover:bg-gray-50"
                        }`}
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <span className="text-2xl font-bold text-gray-900">#{ranking.rank}</span>
                            {!ranking.isEligible && (
                              <span className="ml-2 text-xs text-orange-600">(ineligible)</span>
                            )}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{ranking.name}</div>
                          <div className="text-xs text-gray-500">@{ranking.username}</div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <div className="text-sm font-semibold text-gray-900">
                            {ranking.marks} / {ranking.totalPossibleMarks}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="text-sm font-medium text-gray-700">{ranking.percentage.toFixed(2)}%</span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className="text-sm text-gray-600">{formatTime(ranking.timeConsumed)}</span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getViolationColor(ranking.violations)}`}>
                            {ranking.violations}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-center whitespace-nowrap">
                          {ranking.isBanned ? (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
                              Banned
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                              Active
                            </span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showUserDetails && selectedUser && (
        <UserExamDetails
          examId={examId}
          userId={selectedUser}
          onClose={() => {
            setShowUserDetails(false);
            setSelectedUser(null);
          }}
        />
      )}
    </>
  );
};

export default ExamRanking;
