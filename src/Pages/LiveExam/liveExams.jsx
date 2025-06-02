import { useState, useEffect } from "react";

const FilterDrawer = ({ 
  isOpen, 
  onClose, 
  selectedCategory, 
  setSelectedCategory, 
  selectedSubCategory, 
  setSelectedSubCategory, 
  categories, 
  activeFiltersCount, 
  clearFilters 
}) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm z-40 transition-opacity duration-300 ${
          isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
        }`}
        onClick={onClose}
      />
      
      {/* Drawer */}
      <div className={`fixed right-0 top-0 h-full w-80 max-w-[85vw] bg-white shadow-2xl z-50 transform transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}>
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 md:p-6 border-b border-gray-100 bg-gradient-to-r from-blue-50/50 to-purple-50/50">
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <h3 className="text-lg font-semibold text-gray-700">Filters</h3>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-50 rounded-full transition-colors"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto p-4 md:p-6 space-y-6">
            {/* Active Filters */}
            {activeFiltersCount > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-500">{activeFiltersCount} filter{activeFiltersCount > 1 ? 's' : ''} active</span>
                </div>
                <button
                  onClick={clearFilters}
                  className="flex items-center space-x-1 text-sm text-blue-500 hover:text-blue-600 font-medium"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  <span>Clear all</span>
                </button>
              </div>
            )}

            {/* Category Filter */}
            <div>
              <label className="block text-sm font-medium text-gray-600 mb-3">Category</label>
              <div className="space-y-2">
                <button
                  onClick={() => {
                    setSelectedCategory("all");
                    setSelectedSubCategory("all");
                  }}
                  className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                    selectedCategory === "all" 
                      ? 'border-blue-100/80 bg-blue-50/30 text-blue-500/90' 
                      : 'border-gray-100/80 hover:border-gray-200/80 hover:bg-gray-50/30 text-gray-500 hover:text-gray-600'
                  }`}
                >
                  <span className="mr-3">🌟</span>
                  <span className="font-medium">All Categories</span>
                </button>
                
                {Object.entries(categories).map(([key, category]) => (
                  <button
                    key={key}
                    onClick={() => {
                      setSelectedCategory(key);
                      setSelectedSubCategory("all");
                    }}
                    className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                      selectedCategory === key 
                        ? 'border-blue-100/80 bg-blue-50/30 text-blue-500/90' 
                        : 'border-gray-100/80 hover:border-gray-200/80 hover:bg-gray-50/30 text-gray-500 hover:text-gray-600'
                    }`}
                  >
                    <span className="mr-3">{category.icon}</span>
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Sub-Category Filter */}
            {selectedCategory !== "all" && (
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-3">Test Type</label>
                <div className="space-y-2">
                  <button
                    onClick={() => setSelectedSubCategory("all")}
                    className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                      selectedSubCategory === "all" 
                        ? 'border-blue-100/80 bg-blue-50/30 text-blue-500/90' 
                        : 'border-gray-100/80 hover:border-gray-200/80 hover:bg-gray-50/30 text-gray-500 hover:text-gray-600'
                    }`}
                  >
                    <span className="font-medium">All Types</span>
                  </button>
                  
                  {Object.entries(categories[selectedCategory]?.subCategories || {}).map(([key, name]) => (
                    <button
                      key={key}
                      onClick={() => setSelectedSubCategory(key)}
                      className={`w-full flex items-center p-3 rounded-xl border transition-all ${
                        selectedSubCategory === key 
                          ? 'border-blue-100/80 bg-blue-50/30 text-blue-500/90' 
                          : 'border-gray-100/80 hover:border-gray-200/80 hover:bg-gray-50/30 text-gray-500 hover:text-gray-600'
                      }`}
                    >
                      <span className="font-medium">{name}</span>
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

const LiveExamsPage = () => {
  const [searchCode, setSearchCode] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedSubCategory, setSelectedSubCategory] = useState("all");
  const [filteredExams, setFilteredExams] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [activeFiltersCount, setActiveFiltersCount] = useState(0);

  // Mock exam data with different states (running, upcoming soon, upcoming later)
  const [exams] = useState([
    {
      id: 1,
      code: "BCS001",
      name: "47th BCS Preliminary Test",
      category: "bcs",
      subCategory: "full-model",
      date: new Date(Date.now() - 15 * 60 * 1000), // Started 15 mins ago (RUNNING)
      duration: 120,
      totalQuestions: 200,
      isLive: true,
      participants: 1234,
      difficulty: "Hard"
    },
    {
      id: 2,
      code: "HSC002",
      name: "Physics Model Test 2024",
      category: "hsc",
      subCategory: "subject-wise",
      date: new Date(Date.now() + 30 * 60 * 1000), // Starting in 30 mins (COUNTDOWN)
      duration: 180,
      totalQuestions: 100,
      isLive: true,
      participants: 856,
      difficulty: "Medium"
    },
    {
      id: 3,
      code: "BANK003",
      name: "Combined Bank Officer Exam",
      category: "bank",
      subCategory: "full-model",
      date: new Date(Date.now() + 45 * 60 * 1000), // Starting in 45 mins (COUNTDOWN)
      duration: 60,
      totalQuestions: 80,
      isLive: true,
      participants: 2341,
      difficulty: "Hard"
    },
    {
      id: 4,
      code: "BCS004",
      name: "English Literature Practice",
      category: "bcs",
      subCategory: "subject-wise",
      date: new Date(Date.now() + 2 * 60 * 60 * 1000), // Starting in 2 hours (SET REMINDER)
      duration: 90,
      totalQuestions: 50,
      isLive: true,
      participants: 567,
      difficulty: "Easy"
    },
    {
      id: 5,
      code: "HSC005",
      name: "Mathematics Full Test",
      category: "hsc",
      subCategory: "full-model",
      date: new Date(Date.now() - 30 * 60 * 1000), // Started 30 mins ago (RUNNING)
      duration: 150,
      totalQuestions: 120,
      isLive: true,
      participants: 1089,
      difficulty: "Hard"
    },
    {
      id: 6,
      code: "BANK006",
      name: "General Knowledge Quiz",
      category: "bank",
      subCategory: "others",
      date: new Date(Date.now() + 90 * 60 * 60 * 1000), // Starting in 1.5 hours (SET REMINDER)
      duration: 45,
      totalQuestions: 60,
      isLive: true,
      participants: 789,
      difficulty: "Medium"
    },
    {
      id: 7,
      code: "BCS007",
      name: "General Science Mock Test",
      category: "bcs",
      subCategory: "subject-wise",
      date: new Date(Date.now() + 15 * 60 * 1000), // Starting in 15 mins (COUNTDOWN)
      duration: 75,
      totalQuestions: 40,
      isLive: true,
      participants: 456,
      difficulty: "Medium"
    },
    {
      id: 8,
      code: "HSC008",
      name: "Chemistry Advanced Test",
      category: "hsc",
      subCategory: "full-model",
      date: new Date(Date.now() + 3 * 60 * 60 * 1000), // Starting in 3 hours (SET REMINDER)
      duration: 120,
      totalQuestions: 80,
      isLive: true,
      participants: 623,
      difficulty: "Hard"
    }
  ]);

  const categories = {
    bcs: {
      name: "BCS",
      icon: "🎓",
      color: "from-blue-500 to-indigo-600",
      subCategories: {
        "full-model": "Full Model Test",
        "subject-wise": "Subject Wise",
        "others": "Others"
      }
    },
    hsc: {
      name: "HSC",
      icon: "📚",
      color: "from-green-500 to-emerald-600",
      subCategories: {
        "full-model": "Full Model Test",
        "subject-wise": "Subject Wise",
        "others": "Others"
      }
    },
    bank: {
      name: "Bank",
      icon: "🏦",
      color: "from-purple-500 to-violet-600",
      subCategories: {
        "full-model": "Full Model Test",
        "subject-wise": "Subject Wise",
        "others": "Others"
      }
    }
  };

  // Update current time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Count active filters
  useEffect(() => {
    let count = 0;
    if (selectedCategory !== "all") count++;
    if (selectedSubCategory !== "all") count++;
    setActiveFiltersCount(count);
  }, [selectedCategory, selectedSubCategory]);

  // Filter exams
  useEffect(() => {
    let filtered = exams;

    if (searchCode) {
      filtered = filtered.filter(exam =>
        exam.name.toLowerCase().includes(searchCode.toLowerCase())
      );
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter(exam => exam.category === selectedCategory);
    }

    if (selectedSubCategory !== "all") {
      filtered = filtered.filter(exam => exam.subCategory === selectedSubCategory);
    }

    setFilteredExams(filtered);
  }, [searchCode, selectedCategory, selectedSubCategory, exams]);

  const getExamStatus = (examDate, duration) => {
    const timeDiff = examDate.getTime() - currentTime.getTime();
    const examEndTime = examDate.getTime() + (duration * 60 * 1000);
    const timeToEnd = examEndTime - currentTime.getTime();

    // Exam is currently running
    if (timeDiff <= 0 && timeToEnd > 0) {
      return {
        status: 'running',
        timeRemaining: Math.floor(timeToEnd / (1000 * 60)),
        buttonText: '🚀 Enter Exam',
        buttonColor: 'from-green-500 to-emerald-600',
        statusText: '🔴 LIVE NOW'
      };
    }

    // Exam has ended
    if (timeToEnd <= 0) {
      return {
        status: 'ended',
        buttonText: '⏰ Exam Ended',
        buttonColor: 'from-gray-400 to-gray-500',
        statusText: '⚫ ENDED'
      };
    }

    // Upcoming exam
    const totalSeconds = Math.floor(timeDiff / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    // Check if exam starts in more than 1 hour
    const isMoreThanOneHour = hours > 1;

    return {
      status: 'upcoming',
      totalSeconds,
      hours,
      minutes,
      seconds,
      isMoreThanOneHour,
      buttonColor: isMoreThanOneHour ? 'from-purple-500 to-violet-600' : 'from-blue-500 to-indigo-600',
      statusText: '🟢 UPCOMING'
    };
  };

  const formatCountdown = (hours, minutes, seconds) => {
    if (hours > 0) {
      return `${hours}h ${minutes}m ${seconds}s`;
    }
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  const formatDate = (date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const clearFilters = () => {
    setSelectedCategory("all");
    setSelectedSubCategory("all");
    setSearchCode("");
  };

  const ExamCard = ({ exam }) => {
    const examStatus = getExamStatus(exam.date, exam.duration);
    const category = categories[exam.category];

    const handleSetReminder = (e) => {
      e.preventDefault();
      // TODO: Implement reminder functionality
      alert('Reminder will be set for: ' + exam.name);
    };

    return (
      <div className="group bg-white rounded-2xl shadow-sm hover:shadow-2xl transition-all duration-500 border border-gray-100 hover:border-blue-200 overflow-hidden h-full flex flex-col relative before:absolute before:inset-0 before:z-0 before:bg-gradient-to-b before:from-blue-50/0 before:to-blue-50/0 hover:before:to-blue-50/50 before:transition-colors before:duration-500">
        {/* Card Header with Gradient */}
        <div className={`bg-gradient-to-r ${category.color} p-4 relative overflow-hidden z-10`}>
          <div className="absolute top-0 right-0 w-20 h-20 bg-white bg-opacity-10 rounded-full -mr-10 -mt-10 transition-transform duration-500 group-hover:scale-110"></div>
          <div className="absolute bottom-0 left-0 w-16 h-16 bg-white bg-opacity-10 rounded-full -ml-8 -mb-8 transition-transform duration-500 group-hover:scale-110"></div>
          
          <div className="relative z-10 flex justify-between items-start">
            <div className="flex items-center space-x-3">
              <span className="text-3xl">{category.icon}</span>
              <div>
                <h4 className="text-white font-semibold text-lg mb-0.5">{category.name}</h4>
                <p className="text-white text-opacity-90 text-sm">
                  {examStatus.statusText}
                </p>
              </div>
            </div>
            <div className="flex flex-col items-end space-y-2">
              {examStatus.status === 'running' && (
                <span className="bg-red-500 text-white text-sm px-3 py-1 rounded-full font-medium animate-pulse">
                  LIVE
                </span>
              )}
              <span className={`text-sm px-3 py-1 rounded-full border ${getDifficultyColor(exam.difficulty)}`}>
                {exam.difficulty}
              </span>
            </div>
          </div>
        </div>

        <div className="p-4 md:p-5 flex-1 flex flex-col relative z-10">
          {/* Exam Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-4 line-clamp-2 transition-colors duration-300 group-hover:text-blue-700">
            {exam.name}
          </h3>

          {/* Test Type Badge */}
          <div className="mb-4">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800 group-hover:bg-blue-100 group-hover:text-blue-800 transition-colors duration-300">
              {categories[exam.category]?.subCategories[exam.subCategory]}
            </span>
          </div>

          {/* Exam Stats */}
          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-blue-50 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-blue-100">
                <svg className="w-4 h-4 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Duration</p>
                <p className="text-sm font-semibold group-hover:text-blue-700 transition-colors duration-300">{exam.duration}m</p>
              </div>
            </div>

            <div className="flex items-center space-x-2 text-gray-600">
              <div className="w-8 h-8 bg-green-50 rounded-lg flex items-center justify-center transition-colors duration-300 group-hover:bg-green-100">
                <svg className="w-4 h-4 text-green-500 group-hover:text-green-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div>
                <p className="text-xs text-gray-500 group-hover:text-gray-600 transition-colors duration-300">Questions</p>
                <p className="text-sm font-semibold group-hover:text-blue-700 transition-colors duration-300">{exam.totalQuestions}</p>
              </div>
            </div>
          </div>

          {/* Date and Participants */}
          <div className="space-y-3 mb-4 mt-auto">
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <svg className="w-5 h-5 mr-3 text-blue-500 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className="text-base font-medium text-gray-700 group-hover:text-blue-600 transition-colors duration-300">{formatDate(exam.date)}</span>
            </div>
            
            <div className="flex items-center text-gray-600 group-hover:text-gray-700 transition-colors duration-300">
              <svg className="w-4 h-4 mr-2 group-hover:text-blue-600 transition-colors duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span className="text-sm">{exam.participants.toLocaleString()} joined</span>
            </div>
          </div>

          {/* Action Button */}
          <div className="relative z-10">
            {examStatus.status === 'upcoming' && examStatus.isMoreThanOneHour ? (
              <div className="flex flex-col space-y-2">
                <button 
                  onClick={handleSetReminder}
                  className={`w-full bg-gradient-to-r ${examStatus.buttonColor} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 
                    hover:shadow-lg hover:shadow-purple-200/50 hover:scale-[1.02] active:scale-[0.98]`}
                >
                  🔔 Set Reminder
                </button>
              </div>
            ) : (
              <button 
                className={`w-full bg-gradient-to-r ${examStatus.buttonColor} text-white font-semibold py-3 px-4 rounded-xl transition-all duration-300 relative z-10 
                  ${examStatus.status === 'ended' ? 'opacity-50 cursor-not-allowed' : 'hover:shadow-lg hover:shadow-blue-200/50 hover:scale-[1.02] active:scale-[0.98]'}`}
                disabled={examStatus.status === 'ended'}
              >
                {examStatus.status === 'running' ? '🚀 Enter Exam' :
                 examStatus.status === 'ended' ? '⏰ Exam Ended' :
                 `⏳ Starts in ${formatCountdown(examStatus.hours, examStatus.minutes, examStatus.seconds)}`}
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50 -mt-16 -ml-4">
      <div className="container mx-auto px-4 py-20">
        {/* Header Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-gray-900 via-blue-900 to-purple-900 bg-clip-text text-transparent mb-2">
                🔴 Live Exams
              </h1>
              <p className="text-gray-600">Join live exams and challenge yourself</p>
            </div>
            <div className="hidden sm:flex items-center space-x-2">
              <div className="flex items-center space-x-1">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm text-gray-600">{filteredExams.length} Live</span>
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div className="mb-6">
          <div className="flex items-center space-x-3">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                type="text"
                placeholder="Search exams..."
                value={searchCode}
                onChange={(e) => setSearchCode(e.target.value)}
                className="block w-full pl-12 pr-4 py-3 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all bg-white shadow-sm"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setIsFilterOpen(true)}
              className="relative flex items-center justify-center space-x-2 px-4 py-3 bg-white border border-gray-100 rounded-2xl shadow-sm hover:shadow-md transition-all hover:scale-105 active:scale-95"
            >
              <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4" />
              </svg>
              <span className="hidden sm:inline text-gray-600 font-medium">Filter</span>
              {activeFiltersCount > 0 && (
                <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-blue-400 text-white text-xs rounded-full flex items-center justify-center font-medium">
                  {activeFiltersCount}
                </span>
              )}
            </button>
          </div>

          {/* Active Filters Display */}
          {activeFiltersCount > 0 && (
            <div className="mt-3 flex flex-wrap gap-2">
              {selectedCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-600 border border-blue-100">
                  {categories[selectedCategory].icon} {categories[selectedCategory].name}
                  <button
                    onClick={() => {
                      setSelectedCategory("all");
                      setSelectedSubCategory("all");
                    }}
                    className="ml-2 hover:text-blue-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {selectedSubCategory !== "all" && (
                <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-purple-50 text-purple-600 border border-purple-100">
                  {categories[selectedCategory]?.subCategories[selectedSubCategory]}
                  <button
                    onClick={() => setSelectedSubCategory("all")}
                    className="ml-2 hover:text-purple-700"
                  >
                    ×
                  </button>
                </span>
              )}
              {activeFiltersCount > 0 && (
                <button
                  onClick={clearFilters}
                  className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-50 text-gray-600 hover:bg-gray-100 transition-colors border border-gray-100"
                >
                  <svg className="w-3 h-3 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>

        {/* Results Count */}
        <div className="mb-6 flex items-center justify-between">
          <p className="text-gray-600">
            <span className="font-semibold text-gray-900">{filteredExams.length}</span> exam{filteredExams.length !== 1 ? 's' : ''} available
          </p>
        </div>

        {/* Exam Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredExams.map((exam) => (
            <ExamCard key={exam.id} exam={exam} />
          ))}
        </div>

        {/* Filter Drawer */}
        <FilterDrawer 
          isOpen={isFilterOpen}
          onClose={() => setIsFilterOpen(false)}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          selectedSubCategory={selectedSubCategory}
          setSelectedSubCategory={setSelectedSubCategory}
          categories={categories}
          activeFiltersCount={activeFiltersCount}
          clearFilters={clearFilters}
        />
      </div>
    </div>
  );
};

export default LiveExamsPage;