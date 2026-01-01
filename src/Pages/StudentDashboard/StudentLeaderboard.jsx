import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { FiArrowLeft, FiClock, FiUsers, FiAward, FiTarget } from "react-icons/fi";
import { FaTrophy } from "react-icons/fa";
import axios from "axios";
import UserExamDetails from "../Admin/UserExamDetails";

const StudentLeaderboard = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  const [leaderboardData, setLeaderboardData] = useState(null);
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
    fetchLeaderboard();
  }, [examId, violationThreshold, violationFilter, violationValue, bannedOnly, rankRange, searchQuery]);

  const fetchLeaderboard = async () => {
    try {
      setLoading(true);
      const userInfo = JSON.parse(localStorage.getItem("userInfo"));
      const userId = userInfo?._id || userInfo?.id;

      // Get authentication token
      const token = localStorage.getItem("userToken");
      const headers = {
        "Content-Type": "application/json",
      };
      
      // Add Authorization header if token exists
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      // Build query params
      const params = new URLSearchParams();
      params.append("userId", userId);
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
        `${import.meta.env.VITE_BACKEND_URL}/liveExam/student/live-exam/${examId}/leaderboard?${params.toString()}`,
        { headers }
      );

      if (response.data.success) {
        setLeaderboardData(response.data);
        setIsFiltered(response.data.isFiltered);
        setTotalSubmissions(response.data.totalSubmissions);
      }
    } catch (err) {
      console.error("Error fetching leaderboard:", err);
      setError("Failed to load leaderboard. Please try again.");
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

  const getRankBadge = (rank) => {
    if (rank === 1) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-yellow-600 text-white rounded-xl font-bold shadow-lg">
          <FaTrophy size={24} />
          <span className="text-2xl">#1</span>
        </div>
      );
    } else if (rank === 2) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-gray-300 to-gray-500 text-white rounded-xl font-bold shadow-lg">
          <FaTrophy size={24} />
          <span className="text-2xl">#2</span>
        </div>
      );
    } else if (rank === 3) {
      return (
        <div className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-orange-400 to-orange-600 text-white rounded-xl font-bold shadow-lg">
          <FaTrophy size={24} />
          <span className="text-2xl">#3</span>
        </div>
      );
    }
    return (
      <div className="flex items-center justify-center w-16 h-16 bg-gray-100 rounded-xl">
        <span className="text-2xl font-bold text-gray-700">#{rank}</span>
      </div>
    );
  };

  const getPercentageColor = (percentage) => {
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-blue-600";
    if (percentage >= 40) return "text-amber-600";
    return "text-red-600";
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 font-bold text-xl">Loading leaderboard...</p>
        </div>
      </div>
    );
  }

  if (error || !leaderboardData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiTarget className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Error Loading Leaderboard</h2>
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

  const { exam, currentUserRank, rankings } = leaderboardData;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  const currentUserId = userInfo?._id || userInfo?.id;

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
              <h1 className="text-2xl font-bold text-gray-900 flex items-center justify-center gap-2">
                <FaTrophy className="text-yellow-500" size={28} />
                Leaderboard
              </h1>
              <p className="text-sm text-gray-600">{exam.title}</p>
            </div>
            <div className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-xl font-bold flex items-center gap-2">
              <FiUsers size={20} />
              {leaderboardData.totalParticipants} Participants
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Exam Info */}
        <div className="bg-white rounded-3xl shadow-lg p-6 mb-8 border border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div className="p-4 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl border border-blue-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FiAward className="text-blue-600" size={20} />
                <span className="text-sm font-semibold text-gray-600">Exam Type</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{exam.examType}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-purple-50 to-pink-50 rounded-2xl border border-purple-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FiTarget className="text-purple-600" size={20} />
                <span className="text-sm font-semibold text-gray-600">Total Questions</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{exam.totalQuestions}</p>
            </div>
            <div className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border border-green-100">
              <div className="flex items-center justify-center gap-2 mb-2">
                <FiClock className="text-green-600" size={20} />
                <span className="text-sm font-semibold text-gray-600">Duration</span>
              </div>
              <p className="text-lg font-bold text-gray-900">{exam.duration} minutes</p>
            </div>
          </div>
        </div>

        {/* Filters & Settings Section */}
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
              <strong>Filtered Ranking:</strong> Showing {rankings.length} of {totalSubmissions} total submissions. 
              Ranks are contextual to this filtered view.
            </p>
          </div>
        )}

        {/* Current User Rank */}
        {currentUserRank && (
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-3xl shadow-2xl p-8 mb-8 text-white">
            <div className="flex items-center justify-between flex-wrap gap-4">
              <div className="flex items-center gap-4">
                <div className="w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                  <FaTrophy size={40} />
                </div>
                <div>
                  <p className="text-sm font-semibold opacity-90">Your Rank</p>
                  <p className="text-5xl font-bold">#{currentUserRank.rank}</p>
                  {!currentUserRank.isEligible && (
                    <span className="text-xs text-orange-200">(ineligible)</span>
                  )}
                </div>
              </div>
              <div className="grid grid-cols-3 gap-6">
                <div className="text-center">
                  <p className="text-sm font-semibold opacity-90 mb-1">Score</p>
                  <p className="text-2xl font-bold">{currentUserRank.marks}</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold opacity-90 mb-1">Percentage</p>
                  <p className="text-2xl font-bold">{currentUserRank.percentage.toFixed(1)}%</p>
                </div>
                <div className="text-center">
                  <p className="text-sm font-semibold opacity-90 mb-1">Time</p>
                  <p className="text-2xl font-bold">{formatTime(currentUserRank.timeConsumed)}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Top 3 Podium */}
        {rankings.length >= 3 && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">Top Performers</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* 2nd Place */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-gray-300 order-2 md:order-1">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-gray-300 to-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrophy className="text-white" size={40} />
                  </div>
                  <div className="text-4xl font-bold text-gray-400 mb-2">#2</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{rankings[1].username}</h3>
                  <p className="text-sm text-gray-600 mb-4">{rankings[1].email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Marks</span>
                      <span className="font-bold text-gray-900">{rankings[1].marks}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Percentage</span>
                      <span className={`font-bold ${getPercentageColor(rankings[1].percentage)}`}>
                        {rankings[1].percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Violations</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getViolationColor(rankings[1].violations)}`}>
                        {rankings[1].violations}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 1st Place */}
              <div className="bg-white rounded-3xl shadow-2xl p-6 border-4 border-yellow-400 order-1 md:order-2 transform md:scale-110">
                <div className="text-center">
                  <div className="w-28 h-28 bg-gradient-to-r from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto mb-4 shadow-lg">
                    <FaTrophy className="text-white" size={48} />
                  </div>
                  <div className="text-5xl font-bold text-yellow-500 mb-2">#1</div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-1">{rankings[0].username}</h3>
                  <p className="text-sm text-gray-600 mb-4">{rankings[0].email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Marks</span>
                      <span className="font-bold text-gray-900">{rankings[0].marks}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Percentage</span>
                      <span className={`font-bold ${getPercentageColor(rankings[0].percentage)}`}>
                        {rankings[0].percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-yellow-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Violations</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getViolationColor(rankings[0].violations)}`}>
                        {rankings[0].violations}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* 3rd Place */}
              <div className="bg-white rounded-3xl shadow-lg p-6 border-2 border-orange-300 order-3">
                <div className="text-center">
                  <div className="w-24 h-24 bg-gradient-to-r from-orange-400 to-orange-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaTrophy className="text-white" size={40} />
                  </div>
                  <div className="text-4xl font-bold text-orange-400 mb-2">#3</div>
                  <h3 className="text-xl font-bold text-gray-900 mb-1">{rankings[2].username}</h3>
                  <p className="text-sm text-gray-600 mb-4">{rankings[2].email}</p>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Marks</span>
                      <span className="font-bold text-gray-900">{rankings[2].marks}</span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Percentage</span>
                      <span className={`font-bold ${getPercentageColor(rankings[2].percentage)}`}>
                        {rankings[2].percentage.toFixed(1)}%
                      </span>
                    </div>
                    <div className="flex justify-between items-center p-2 bg-gray-50 rounded-lg">
                      <span className="text-sm font-semibold text-gray-600">Violations</span>
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getViolationColor(rankings[2].violations)}`}>
                        {rankings[2].violations}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Rankings Table */}
        <div className="bg-white rounded-3xl shadow-lg overflow-hidden border border-gray-200">
          <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6">
            <h2 className="text-2xl font-bold text-white">Complete Rankings</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Rank
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Participant
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
                {rankings.map((ranking) => {
                  const isCurrentUser = ranking.userId === currentUserId?.toString();

                  return (
                    <tr
                      key={ranking.userId}
                      onClick={() => handleUserClick(ranking.userId)}
                      className={`cursor-pointer transition-colors ${
                        ranking.isBanned
                          ? "bg-red-50 hover:bg-red-100"
                          : isCurrentUser
                          ? "bg-indigo-50 border-l-4 border-indigo-600"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          {ranking.rank <= 3 ? (
                            getRankBadge(ranking.rank)
                          ) : (
                            <span className="text-xl font-bold text-gray-700">#{ranking.rank}</span>
                          )}
                          {!ranking.isEligible && (
                            <span className="ml-2 text-xs text-orange-600">(ineligible)</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                            {ranking.username.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="text-sm font-bold text-gray-900 flex items-center gap-2">
                              {ranking.username}
                              {isCurrentUser && (
                                <span className="px-2 py-1 bg-indigo-200 text-indigo-800 text-xs rounded-full">
                                  You
                                </span>
                              )}
                            </div>
                            <div className="text-xs text-gray-500">{ranking.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <div className="text-sm font-bold text-gray-900">
                          {ranking.marks} / {ranking.totalPossibleMarks}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className={`text-lg font-bold ${getPercentageColor(ranking.percentage)}`}>
                          {ranking.percentage.toFixed(2)}%
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center whitespace-nowrap">
                        <span className="text-sm font-semibold text-gray-600">
                          {formatTime(ranking.timeConsumed)}
                        </span>
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
                  );
                })}
              </tbody>
            </table>
          </div>
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
    </div>
  );
};

export default StudentLeaderboard;
