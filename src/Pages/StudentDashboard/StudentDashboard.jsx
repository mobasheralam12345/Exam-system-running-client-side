import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const FilterDrawer = ({
  isOpen,
  onClose,
  selectedCategory,
  setSelectedCategory,
  selectedTestType,
  setSelectedTestType,
  selectedSubjects,
  setSelectedSubjects,
  categories,
  testTypes,
  subjects,
  activeFiltersCount,
  clearFilters,
}) => {
  const handleSubjectToggle = (subject) => {
    setSelectedSubjects((prev) =>
      prev.includes(subject)
        ? prev.filter((s) => s !== subject)
        : [...prev, subject]
    );
  };

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 bg-black bg-opacity-30 z-40 transition-opacity duration-300 ${
          isOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={onClose}
      />

      {/* Drawer */}
      <div
        className={`fixed right-0 top-0 h-full w-96 max-w-[90vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-gray-600 to-gray-700 rounded-lg flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800">
                Advanced Filters
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <svg
                className="w-6 h-6 text-gray-600"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-8">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-blue-800">
                    {activeFiltersCount} filter
                    {activeFiltersCount > 1 ? "s" : ""} active
                  </span>
                  <button
                    onClick={clearFilters}
                    className="text-sm text-blue-700 hover:text-blue-900 font-medium"
                  >
                    Clear all
                  </button>
                </div>
              </div>
            )}

            {/* Exam Category Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                📚 Exam Category
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedCategory("all")}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedCategory === "all"
                      ? "border-blue-500 bg-blue-600 text-white shadow-md"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">🌟</span>
                    <span className="font-medium">All Categories</span>
                  </div>
                </button>
                {categories.map((category) => (
                  <button
                    key={category.value}
                    onClick={() => setSelectedCategory(category.value)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedCategory === category.value
                        ? "border-blue-500 bg-blue-600 text-white shadow-md"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-2xl">{category.icon}</span>
                      <span className="font-medium">{category.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Test Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-4">
                🎯 Test Type
              </label>
              <div className="space-y-2">
                <button
                  onClick={() => setSelectedTestType("all")}
                  className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                    selectedTestType === "all"
                      ? "border-purple-500 bg-purple-600 text-white shadow-md"
                      : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                  }`}
                >
                  <span className="font-medium">All Types</span>
                </button>
                {testTypes.map((type) => (
                  <button
                    key={type.value}
                    onClick={() => setSelectedTestType(type.value)}
                    className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                      selectedTestType === type.value
                        ? "border-purple-500 bg-purple-600 text-white shadow-md"
                        : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <span className="text-xl">{type.icon}</span>
                      <span className="font-medium">{type.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Subject Filter - Only show when subject-wise is selected */}
            {selectedTestType === "subject-wise" && (
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-4">
                  📖 Subjects ({selectedSubjects.length} selected)
                </label>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {subjects.map((subject) => (
                    <button
                      key={subject}
                      onClick={() => handleSubjectToggle(subject)}
                      className={`w-full text-left p-3 rounded-lg border-2 transition-all ${
                        selectedSubjects.includes(subject)
                          ? "border-green-500 bg-green-600 text-white shadow-md"
                          : "border-gray-200 bg-gray-50 text-gray-700 hover:border-gray-300 hover:bg-gray-100"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{subject}</span>
                        {selectedSubjects.includes(subject) && (
                          <svg
                            className="w-5 h-5 text-white"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M5 13l4 4L19 7"
                            />
                          </svg>
                        )}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

const Dashboard = () => {
  const [examHistory, setExamHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState("recent");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter states
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedTestType, setSelectedTestType] = useState("all");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Filter options
  const categories = [
    { value: "BCS", name: "BCS", icon: "🎓" },
    { value: "HSC", name: "HSC", icon: "📚" },
    { value: "Bank", name: "Bank", icon: "🏦" },
    { value: "Live", name: "Live", icon: "🔴" },
  ];

  const testTypes = [
    { value: "year-wise", name: "Year Wise", icon: "📅" },
    { value: "model-test", name: "Model Test", icon: "🎯" },
    { value: "subject-wise", name: "Subject Wise", icon: "📖" },
  ];

  const subjects = [
    "বাংলা ভাষা ও সাহিত্য",
    "English Language and Literature",
    "গণিত",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Biology",
    "সাধারণ জ্ঞান",
    "General Knowledge",
    "বিজ্ঞান",
    "কম্পিউটার ও তথ্য প্রযুক্তি",
    "মানসিক দক্ষতা",
    "নৈতিকতা ও মূল্যবোধ",
    "ভূগোল ও পরিবেশ",
    "বাংলাদেশ ও বিশ্বপরিচয়",
    "Banking",
    "Accounting",
    "Economics",
    "Finance",
    "Management",
  ];

  // Fetch data from APIs
  useEffect(() => {
    const fetchExamHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get current user ID (you'll need to implement this based on your auth system)
        const userId = localStorage.getItem("userId") || "mock-user-id";

        // For now, use mock data with API structure ready for future implementation
        const mockExamHistory = await getMockExamHistory();

        // TODO: Replace with actual API calls when ready
        // const [liveSubmissions, bcsSubmissions, hscSubmissions, bankSubmissions] = await Promise.all([
        //   fetchLiveSubmissions(userId),
        //   fetchBCSSubmissions(userId),
        //   fetchHSCSubmissions(userId),
        //   fetchBankSubmissions(userId)
        // ]);

        setExamHistory(mockExamHistory);
      } catch (error) {
        console.error("Error fetching exam history:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchExamHistory();
  }, []);

  // Future API fetch functions (ready for implementation)
  const fetchLiveSubmissions = async (userId) => {
    try {
      const response = await fetch(`${BACKEND_URL}/live/submit/user/${userId}`);
      if (!response.ok) throw new Error("Failed to fetch live submissions");
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching live submissions:", error);
      return [];
    }
  };

  const fetchBCSSubmissions = async (userId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/bcs/submissions/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch BCS submissions");
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching BCS submissions:", error);
      return [];
    }
  };

  const fetchHSCSubmissions = async (userId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/hsc/submissions/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch HSC submissions");
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching HSC submissions:", error);
      return [];
    }
  };

  const fetchBankSubmissions = async (userId) => {
    try {
      const response = await fetch(
        `${BACKEND_URL}/bank/submissions/user/${userId}`
      );
      if (!response.ok) throw new Error("Failed to fetch Bank submissions");
      const data = await response.json();
      return data.success ? data.data : [];
    } catch (error) {
      console.error("Error fetching Bank submissions:", error);
      return [];
    }
  };

  // Mock data function (matches API structure)
  const getMockExamHistory = async () => {
    // Simulate API delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    return [
      {
        _id: "live_submission_1",
        examId: "exam_id_1",
        examTitle: "Live Mock Test #45",
        type: "Live",
        category: "Model Test",
        testType: "model-test",
        subjects: ["সাধারণ জ্ঞান", "গণিত", "English Language and Literature"],
        submissionTime: "2024-07-20T10:30:00Z",
        totalScore: 88,
        totalQuestions: 100,
        totalCorrect: 88,
        totalWrong: 8,
        totalSkipped: 4,
        percentage: 88,
        timeConsumed: 7200, // in seconds
        duration: "2 hours",
        year: 2024,
      },
      {
        _id: "bcs_submission_1",
        examId: "bcs_exam_id_1",
        examTitle: "45th BCS Preliminary",
        type: "BCS",
        category: "Year Wise",
        testType: "year-wise",
        subjects: [
          "বাংলা ভাষা ও সাহিত্য",
          "English Language and Literature",
          "গণিত",
        ],
        submissionTime: "2024-07-18T14:45:00Z",
        totalScore: 85,
        totalQuestions: 200,
        totalCorrect: 170,
        totalWrong: 25,
        totalSkipped: 5,
        percentage: 85,
        timeConsumed: 10800, // in seconds
        duration: "3 hours",
        year: 2024,
      },
      {
        _id: "hsc_submission_1",
        examId: "hsc_exam_id_1",
        examTitle: "HSC Physics 2023",
        type: "HSC",
        category: "Subject Wise",
        testType: "subject-wise",
        subjects: ["Physics"],
        submissionTime: "2024-07-15T16:20:00Z",
        totalScore: 92,
        totalQuestions: 50,
        totalCorrect: 46,
        totalWrong: 3,
        totalSkipped: 1,
        percentage: 92,
        timeConsumed: 7200, // in seconds
        duration: "2 hours",
        year: 2023,
      },
      {
        _id: "bank_submission_1",
        examId: "bank_exam_id_1",
        examTitle: "Sonali Bank Officer",
        type: "Bank",
        category: "Model Test",
        testType: "model-test",
        subjects: ["Banking", "Accounting", "Economics"],
        submissionTime: "2024-07-12T11:15:00Z",
        totalScore: 78,
        totalQuestions: 100,
        totalCorrect: 78,
        totalWrong: 18,
        totalSkipped: 4,
        percentage: 78,
        timeConsumed: 5400, // in seconds
        duration: "1.5 hours",
        year: 2024,
      },
      {
        _id: "bcs_submission_2",
        examId: "bcs_exam_id_2",
        examTitle: "44th BCS Written",
        type: "BCS",
        category: "Subject Wise",
        testType: "subject-wise",
        subjects: ["বাংলা ভাষা ও সাহিত্য", "গণিত"],
        submissionTime: "2024-07-10T09:30:00Z",
        totalScore: 76,
        totalQuestions: 150,
        totalCorrect: 114,
        totalWrong: 30,
        totalSkipped: 6,
        percentage: 76,
        timeConsumed: 14400, // in seconds
        duration: "4 hours",
        year: 2024,
      },
      {
        _id: "hsc_submission_2",
        examId: "hsc_exam_id_2",
        examTitle: "HSC Mathematics 2022",
        type: "HSC",
        category: "Year Wise",
        testType: "year-wise",
        subjects: ["Mathematics"],
        submissionTime: "2024-07-08T13:45:00Z",
        totalScore: 95,
        totalQuestions: 60,
        totalCorrect: 57,
        totalWrong: 2,
        totalSkipped: 1,
        percentage: 95,
        timeConsumed: 9000, // in seconds
        duration: "2.5 hours",
        year: 2022,
      },
    ];
  };

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedTestType !== "all") count++;
    if (selectedSubjects.length > 0) count++;
    if (searchTerm) count++;
    setActiveFiltersCount(count);
  }, [selectedCategory, selectedTestType, selectedSubjects, searchTerm]);

  // Filter and sort logic
  const filteredAndSortedExams = examHistory
    .filter((exam) => {
      // Search filter
      if (searchTerm) {
        const searchLower = searchTerm.toLowerCase();
        const matchesSearch =
          exam.examTitle.toLowerCase().includes(searchLower) ||
          exam.type.toLowerCase().includes(searchLower) ||
          exam.category.toLowerCase().includes(searchLower);
        if (!matchesSearch) return false;
      }

      // Category filter
      if (selectedCategory !== "all" && exam.type !== selectedCategory) {
        return false;
      }

      // Test type filter
      if (selectedTestType !== "all" && exam.testType !== selectedTestType) {
        return false;
      }

      // Subject filter
      if (selectedSubjects.length > 0) {
        const hasSelectedSubjects = selectedSubjects.every((subject) =>
          exam.subjects.includes(subject)
        );
        if (!hasSelectedSubjects) return false;
      }

      return true;
    })
    .sort((a, b) => {
      if (sortBy === "recent") {
        return new Date(b.submissionTime) - new Date(a.submissionTime);
      } else if (sortBy === "score") {
        return b.percentage - a.percentage;
      } else if (sortBy === "name") {
        return a.examTitle.localeCompare(b.examTitle);
      }
      return 0;
    });

  // Statistics calculation
  const stats = {
    totalExams: examHistory.length,
    bcsExams: examHistory.filter((exam) => exam.type === "BCS").length,
    hscExams: examHistory.filter((exam) => exam.type === "HSC").length,
    bankExams: examHistory.filter((exam) => exam.type === "Bank").length,
    liveExams: examHistory.filter((exam) => exam.type === "Live").length,
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedTestType("all");
    setSelectedSubjects([]);
    setSearchTerm("");
  };

  const getScoreColor = (score) => {
    if (score >= 90) return "text-green-600 bg-green-100";
    if (score >= 80) return "text-blue-600 bg-blue-100";
    if (score >= 70) return "text-yellow-600 bg-yellow-100";
    return "text-red-600 bg-red-100";
  };

  const getTypeColor = (type) => {
    switch (type) {
      case "BCS":
        return "bg-emerald-100 text-emerald-800";
      case "HSC":
        return "bg-blue-100 text-blue-800";
      case "Bank":
        return "bg-purple-100 text-purple-800";
      case "Live":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-300 rounded w-1/4 mb-6"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="bg-white p-6 rounded-lg shadow-sm">
                  <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                  <div className="h-6 bg-gray-300 rounded w-1/2"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-lg shadow-sm p-6">
              <div className="h-6 bg-gray-300 rounded w-1/3 mb-4"></div>
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-300 rounded mb-4"></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg
                className="w-8 h-8 text-red-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Error Loading Dashboard
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-gray-600">
            Track your exam performance and progress
          </p>
        </div>

        {/* Statistics Cards - 5 cards without average score */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Total Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.totalExams}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-red-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Live Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.liveExams}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-emerald-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">BCS Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.bcsExams}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">HSC Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.hscExams}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <svg
                    className="w-5 h-5 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                    />
                  </svg>
                </div>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Bank Exams</p>
                <p className="text-2xl font-bold text-gray-900">
                  {stats.bankExams}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            {/* Search Bar */}
            <div className="flex-1 max-w-md">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg
                    className="h-5 w-5 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                    />
                  </svg>
                </div>
                <input
                  type="text"
                  placeholder="Search exams..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            <div className="flex items-center space-x-4">
              {/* Sort Dropdown */}
              <div>
                <label className="text-sm font-medium text-gray-700 mr-2">
                  Sort by:
                </label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="recent">Most Recent</option>
                  <option value="score">Highest Score</option>
                  <option value="name">Exam Name</option>
                </select>
              </div>

              {/* Filter Button */}
              <button
                onClick={() => setIsFilterOpen(true)}
                className="relative flex items-center space-x-2 px-4 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95 font-medium"
              >
                <svg
                  className="w-5 h-5 text-gray-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4"
                  />
                </svg>
                <span className="text-gray-700">Filters</span>
                {activeFiltersCount > 0 && (
                  <span className="absolute -top-2 -right-2 w-5 h-5 bg-blue-500 text-white text-xs rounded-full flex items-center justify-center font-bold">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            <div className="text-sm text-gray-600">
              Showing {filteredAndSortedExams.length} of {examHistory.length}{" "}
              exams
            </div>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-4 flex flex-wrap gap-2">
              {searchTerm && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 border border-gray-200">
                  🔍 "{searchTerm}"
                  <button
                    onClick={() => setSearchTerm("")}
                    className="ml-2 text-gray-600 hover:text-gray-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800 border border-blue-200">
                  📚 {selectedCategory}
                  <button
                    onClick={() => setSelectedCategory("all")}
                    className="ml-2 text-blue-600 hover:text-blue-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedTestType !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-purple-100 text-purple-800 border border-purple-200">
                  {selectedTestType === "year-wise"
                    ? "📅 Year Wise"
                    : selectedTestType === "model-test"
                    ? "🎯 Model Test"
                    : "📖 Subject Wise"}
                  <button
                    onClick={() => setSelectedTestType("all")}
                    className="ml-2 text-purple-600 hover:text-purple-800"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSubjects.length > 0 && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 border border-green-200">
                  📖 {selectedSubjects.length} Subject
                  {selectedSubjects.length > 1 ? "s" : ""}
                  <button
                    onClick={() => setSelectedSubjects([])}
                    className="ml-2 text-green-600 hover:text-green-800"
                  >
                    ×
                  </button>
                </span>
              )}
            </div>
          )}
        </div>

        {/* Exam History List */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-semibold text-gray-900">
              Recent Exam History
            </h2>
          </div>

          <div className="divide-y divide-gray-200">
            {filteredAndSortedExams.length === 0 ? (
              <div className="p-8 text-center">
                <svg
                  className="mx-auto h-12 w-12 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
                <h3 className="mt-2 text-sm font-medium text-gray-900">
                  No exams found
                </h3>
                <p className="mt-1 text-sm text-gray-500">
                  Try adjusting your filter criteria.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 inline-flex items-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                >
                  Clear all filters
                </button>
              </div>
            ) : (
              filteredAndSortedExams.map((exam) => (
                <Link
                  key={exam._id}
                  to={`/exam-review/${exam._id}`}
                  state={{ examData: exam, submissionData: exam }}
                  className="block hover:bg-gray-50 transition-colors duration-200"
                >
                  <div className="px-6 py-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900 truncate">
                            {exam.examTitle}
                          </h3>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getTypeColor(
                              exam.type
                            )}`}
                          >
                            {exam.type}
                          </span>
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getScoreColor(
                              exam.percentage
                            )}`}
                          >
                            {exam.percentage}%
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center text-sm text-gray-600 space-x-4">
                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                              />
                            </svg>
                            {formatDate(exam.submissionTime)}
                          </span>

                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {exam.duration}
                          </span>

                          <span className="flex items-center">
                            <svg
                              className="w-4 h-4 mr-1"
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                              />
                            </svg>
                            {exam.totalCorrect}/{exam.totalQuestions} correct
                          </span>

                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-gray-100 text-gray-800">
                            {exam.category}
                          </span>

                          <span className="inline-flex items-center px-2 py-1 rounded-md text-xs bg-blue-100 text-blue-800">
                            {exam.subjects.length} Subject
                            {exam.subjects.length > 1 ? "s" : ""}
                          </span>
                        </div>
                      </div>

                      <div className="flex-shrink-0 ml-4">
                        <svg
                          className="w-5 h-5 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M9 5l7 7-7 7"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="mt-8 bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <Link
              to="/LiveExams"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  Take Live Exam
                </p>
                <p className="text-xs text-gray-500">Join ongoing tests</p>
              </div>
            </Link>

            <Link
              to="/exam"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-emerald-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  BCS Practice
                </p>
                <p className="text-xs text-gray-500">Previous year questions</p>
              </div>
            </Link>

            <Link
              to="/hsc/all-questions"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">
                  HSC Practice
                </p>
                <p className="text-xs text-gray-500">Subject wise tests</p>
              </div>
            </Link>

            <Link
              to="/bank/all-questions"
              className="flex items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors duration-200"
            >
              <div className="flex-shrink-0 w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-gray-900">Bank Jobs</p>
                <p className="text-xs text-gray-500">Banking exams</p>
              </div>
            </Link>
          </div>
        </div>

        {/* Filter Drawer */}
        <FilterDrawer
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedTestType={selectedTestType}
          setSelectedTestType={setSelectedTestType}
          selectedSubjects={selectedSubjects}
          setSelectedSubjects={setSelectedSubjects}
          categories={categories}
          testTypes={testTypes}
          subjects={subjects}
          activeFiltersCount={activeFiltersCount}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

export default Dashboard;
