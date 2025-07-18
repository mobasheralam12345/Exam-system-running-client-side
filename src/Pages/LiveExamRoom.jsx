import { useState, useEffect, useRef } from "react";

const LiveExamRoom = ({ examData, userData, onExamSubmit, onViolation }) => {
  // Exam State
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [showConsent, setShowConsent] = useState(true);
  const [consentChecked, setConsentChecked] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showViolationWarning, setShowViolationWarning] = useState(false);
  const [isExpelled, setIsExpelled] = useState(false);
  const [showMobileNavigation, setShowMobileNavigation] = useState(false);
  const [examCompleted, setExamCompleted] = useState(false);
  const [completionReason, setCompletionReason] = useState("");
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [violationMessage, setViolationMessage] = useState("");

  const examContainerRef = useRef(null);
  const cursorTimeoutRef = useRef(null);

  // Detect mobile device
  useEffect(() => {
    const checkMobileDevice = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const mobileRegex =
        /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobile|mobile|CriOS/i;
      setIsMobileDevice(mobileRegex.test(userAgent));
    };

    checkMobileDevice();
  }, []);

  // Mock data - same as before
  const mockExamData = {
    _id: "64a1b2c3d4e5f6789012345",
    title: "47th BCS Preliminary Mock Test",
    code: "BCS001",
    examType: "BCS",
    duration: 180,
    totalQuestions: 6,
    totalMarks: 6,
    negativeMarks: 0.25,
    subjects: [
      {
        _id: "sub1",
        name: "বাংলা ভাষা ও সাহিত্য",
        questionCount: 3,
        questions: [
          {
            _id: "q1",
            text: "<p>বাংলা সাহিত্যের আদি নিদর্শন কোনটি?</p>",
            options: [
              "<p>চর্যাপদ</p>",
              "<p>শ্রীকৃষ্ণকীর্তন</p>",
              "<p>মনসামঙ্গল</p>",
              "<p>অন্নদামঙ্গল</p>",
            ],
            marks: 1,
          },
          {
            _id: "q2",
            text: "<p>'সোনার তরী' কাব্যগ্রন্থের রচয়িতা কে?</p>",
            options: [
              "<p>কাজী নজরুল ইসলাম</p>",
              "<p>রবীন্দ্রনাথ ঠাকুর</p>",
              "<p>জীবনানন্দ দাশ</p>",
              "<p>মাইকেল মধুসূদন দত্ত</p>",
            ],
            marks: 1,
          },
          {
            _id: "q3",
            text: "<p>বাংলা ভাষার প্রথম মুদ্রিত গ্রন্থ কোনটি?</p>",
            options: [
              "<p>কৃপার শাস্ত্রের অর্থভেদ</p>",
              "<p>ব্রাহ্মণ রোমান ক্যাথলিক সম্বাদ</p>",
              "<p>দুর্গেশনন্দিনী</p>",
              "<p>আলালের ঘরের দুলাল</p>",
            ],
            marks: 1,
          },
        ],
      },
      {
        _id: "sub2",
        name: "English Language",
        questionCount: 3,
        questions: [
          {
            _id: "q4",
            text: "<p>What is the past participle of 'go'?</p>",
            options: [
              "<p>went</p>",
              "<p>gone</p>",
              "<p>going</p>",
              "<p>goes</p>",
            ],
            marks: 1,
          },
          {
            _id: "q5",
            text: "<p>Who wrote 'Romeo and Juliet'?</p>",
            options: [
              "<p>Charles Dickens</p>",
              "<p>William Shakespeare</p>",
              "<p>Jane Austen</p>",
              "<p>Mark Twain</p>",
            ],
            marks: 1,
          },
          {
            _id: "q6",
            text: "<p>Choose the correct spelling:</p>",
            options: [
              "<p>Recieve</p>",
              "<p>Receive</p>",
              "<p>Recive</p>",
              "<p>Receave</p>",
            ],
            marks: 1,
          },
        ],
      },
    ],
  };

  const mockUserData = {
    name: "John Doe",
    email: "john@example.com",
    studentId: "STU001",
  };

  const currentExam = examData || mockExamData;
  const currentUser = userData || mockUserData;

  // Format time display function
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Enhanced cursor management for desktop only
  const showCursor = () => {
    if (!isMobileDevice) {
      document.body.style.cursor = "default";
      clearTimeout(cursorTimeoutRef.current);
      cursorTimeoutRef.current = setTimeout(() => {
        document.body.style.cursor = "none";
      }, 2000);
    }
  };

  const handleMouseMove = () => {
    if (examStarted && !isMobileDevice) {
      showCursor();
    }
  };

  // Initialize timer
  useEffect(() => {
    if (examStarted) {
      setTimeLeft(currentExam.duration * 60);
      if (!isMobileDevice) {
        showCursor();
        document.addEventListener("mousemove", handleMouseMove);
      }

      return () => {
        if (!isMobileDevice) {
          document.removeEventListener("mousemove", handleMouseMove);
          clearTimeout(cursorTimeoutRef.current);
        }
      };
    }
  }, [examStarted, currentExam.duration, isMobileDevice]);

  // Countdown timer
  useEffect(() => {
    if (!examStarted || timeLeft <= 0 || examCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          handleAutoSubmit("time_up");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft, examCompleted]);

  // Enhanced monitoring for both mobile and desktop
  useEffect(() => {
    if (examStarted) {
      // Fullscreen monitoring (works on both mobile and desktop)
      const handleFullscreenChange = () => {
        const isCurrentlyFullscreen = !!(
          document.fullscreenElement ||
          document.webkitFullscreenElement ||
          document.mozFullScreenElement ||
          document.msFullscreenElement
        );

        setIsFullscreen(isCurrentlyFullscreen);

        if (!isCurrentlyFullscreen && examStarted && !examCompleted) {
          if (isMobileDevice) {
            handleViolation(
              "fullscreen_exit",
              "You exited fullscreen mode. Please return to fullscreen or your exam will be terminated."
            );
          } else {
            handleViolation(
              "fullscreen_exit",
              "You exited fullscreen mode. Exam will be terminated due to violation of exam rules."
            );
          }
        }
      };

      // Tab/App switching monitoring (works on both platforms)
      const handleVisibilityChange = () => {
        if (document.hidden && examStarted && !examCompleted) {
          if (isMobileDevice) {
            handleViolation(
              "app_switch",
              "You switched apps. Please return to the exam or it will be terminated."
            );
          } else {
            handleViolation(
              "tab_switch",
              "You switched tabs. Exam will be terminated due to violation of exam rules."
            );
          }
        }
      };

      // Mobile-specific orientation change handler
      const handleOrientationChange = () => {
        if (isMobileDevice) {
          setTimeout(() => {
            if (!document.fullscreenElement) {
              enterFullscreen();
            }
          }, 500);
        }
      };

      // Add event listeners
      document.addEventListener("fullscreenchange", handleFullscreenChange);
      document.addEventListener(
        "webkitfullscreenchange",
        handleFullscreenChange
      );
      document.addEventListener("mozfullscreenchange", handleFullscreenChange);
      document.addEventListener("MSFullscreenChange", handleFullscreenChange);
      document.addEventListener("visibilitychange", handleVisibilityChange);

      if (isMobileDevice) {
        window.addEventListener("orientationchange", handleOrientationChange);
        // Prevent context menu on mobile
        document.addEventListener("contextmenu", (e) => e.preventDefault());
      }

      // Keyboard restrictions (mainly for desktop)
      const handleKeyDown = (e) => {
        if (
          e.key === "Escape" ||
          (e.ctrlKey && (e.key === "w" || e.key === "t" || e.key === "n")) ||
          e.key === "F11" ||
          (e.altKey && e.key === "Tab") ||
          (e.ctrlKey && e.shiftKey && e.key === "I") || // Dev tools
          e.key === "F12" // Dev tools
        ) {
          e.preventDefault();
          e.stopPropagation();
        }
      };

      document.addEventListener("keydown", handleKeyDown);

      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "webkitfullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "mozfullscreenchange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "MSFullscreenChange",
          handleFullscreenChange
        );
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        );
        document.removeEventListener("keydown", handleKeyDown);

        if (isMobileDevice) {
          window.removeEventListener(
            "orientationchange",
            handleOrientationChange
          );
          document.removeEventListener("contextmenu", (e) =>
            e.preventDefault()
          );
        }
      };
    }
  }, [examStarted, examCompleted, isMobileDevice]);

  // Enhanced fullscreen function for both platforms
  const enterFullscreen = async () => {
    try {
      const element = document.documentElement;

      if (element.requestFullscreen) {
        await element.requestFullscreen();
      } else if (element.webkitRequestFullscreen) {
        await element.webkitRequestFullscreen();
      } else if (element.mozRequestFullScreen) {
        await element.mozRequestFullScreen();
      } else if (element.msRequestFullscreen) {
        await element.msRequestFullscreen();
      }

      // Hide cursor on desktop only
      if (!isMobileDevice) {
        setTimeout(() => {
          document.body.style.cursor = "none";
        }, 3000);
      }

      setIsFullscreen(true);
    } catch (error) {
      console.error("Failed to enter fullscreen:", error);
      if (isMobileDevice) {
        // On mobile, proceed even if fullscreen fails
        setIsFullscreen(true);
      }
    }
  };

  // Enhanced violation handler with different approaches for mobile/desktop
  const handleViolation = (type, message) => {
    setViolationMessage(message);
    setShowViolationWarning(true);

    onViolation &&
      onViolation({
        type,
        device: isMobileDevice ? "mobile" : "desktop",
        timestamp: new Date().toISOString(),
      });

    if (isMobileDevice) {
      // For mobile: Give a warning and longer grace period
      setTimeout(() => {
        if (document.hidden || !document.fullscreenElement) {
          // Still violated after warning
          setIsExpelled(true);
          handleAutoSubmit("expelled");
        } else {
          // User returned to exam
          setShowViolationWarning(false);
        }
      }, 5000); // 5 second grace period for mobile
    } else {
      // For desktop: Immediate expulsion
      setTimeout(() => {
        setIsExpelled(true);
        handleAutoSubmit("expelled");
      }, 3000);
    }
  };

  // Start exam
  const handleStartExam = async () => {
    if (!consentChecked) return;

    setShowConsent(false);
    await enterFullscreen();
    setExamStarted(true);
    markQuestionVisited(0, 0);
  };

  // All other functions remain the same...
  const markQuestionVisited = (subjectIndex, questionIndex) => {
    const questionKey = `${subjectIndex}-${questionIndex}`;
    setVisitedQuestions((prev) => new Set([...prev, questionKey]));
  };

  const getCurrentQuestion = () => {
    if (!currentExam.subjects[currentSubjectIndex]) return null;
    return currentExam.subjects[currentSubjectIndex].questions[
      currentQuestionIndex
    ];
  };

  const getQuestionStatus = (subjectIndex, questionIndex) => {
    const questionKey = `${subjectIndex}-${questionIndex}`;
    const isCurrent =
      subjectIndex === currentSubjectIndex &&
      questionIndex === currentQuestionIndex;
    const isAnswered = answers.hasOwnProperty(questionKey);
    const isVisited = visitedQuestions.has(questionKey);
    const isMarkedForReview = reviewMarked.has(questionKey);

    if (isCurrent) return "current";
    if (isMarkedForReview) return "review";
    if (isAnswered) return "answered";
    if (isVisited) return "visited";
    return "not-visited";
  };

  const handleAnswerSelect = (optionIndex) => {
    const questionKey = `${currentSubjectIndex}-${currentQuestionIndex}`;
    setAnswers((prev) => ({
      ...prev,
      [questionKey]: optionIndex,
    }));
  };

  const toggleReviewMark = () => {
    const questionKey = `${currentSubjectIndex}-${currentQuestionIndex}`;
    setReviewMarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionKey)) {
        newSet.delete(questionKey);
      } else {
        newSet.add(questionKey);
      }
      return newSet;
    });
  };

  const goToQuestion = (subjectIndex, questionIndex) => {
    setCurrentSubjectIndex(subjectIndex);
    setCurrentQuestionIndex(questionIndex);
    markQuestionVisited(subjectIndex, questionIndex);
    setShowMobileNavigation(false);
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      markQuestionVisited(currentSubjectIndex, currentQuestionIndex - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubject = currentExam.subjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex((prev) => prev - 1);
      setCurrentQuestionIndex(prevSubject.questions.length - 1);
      markQuestionVisited(
        currentSubjectIndex - 1,
        prevSubject.questions.length - 1
      );
    }
  };

  const goToNextQuestion = () => {
    const currentSubject = currentExam.subjects[currentSubjectIndex];

    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      markQuestionVisited(currentSubjectIndex, currentQuestionIndex + 1);
    } else if (currentSubjectIndex < currentExam.subjects.length - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      markQuestionVisited(currentSubjectIndex + 1, 0);
    }
  };

  const handleAutoSubmit = (reason = "time_up") => {
    const submissionData = {
      examId: currentExam._id,
      answers,
      timeSpent: currentExam.duration * 60 - timeLeft,
      reason,
      device: isMobileDevice ? "mobile" : "desktop",
      timestamp: new Date().toISOString(),
    };

    setExamCompleted(true);
    setCompletionReason(reason);

    if (document.exitFullscreen) {
      document.exitFullscreen();
    }

    document.body.style.cursor = "default";

    onExamSubmit && onExamSubmit(submissionData);
  };

  const handleManualSubmit = () => {
    setShowSubmitConfirm(false);
    handleAutoSubmit("manual");
  };

  const getTotalQuestions = () => {
    return currentExam.subjects.reduce(
      (total, subject) => total + subject.questions.length,
      0
    );
  };

  const getCurrentQuestionNumber = () => {
    let count = 0;
    for (let i = 0; i < currentSubjectIndex; i++) {
      count += currentExam.subjects[i].questions.length;
    }
    return count + currentQuestionIndex + 1;
  };

  const getAnsweredCount = () => Object.keys(answers).length;
  const getReviewMarkedCount = () => reviewMarked.size;

  // Expelled state
  if (isExpelled) {
    return (
      <div className="min-h-screen bg-red-50 flex items-center justify-center p-4">
        <div className="bg-white p-6 sm:p-8 rounded-lg shadow-lg max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg
              className="w-8 h-8 text-red-600"
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
          </div>
          <h2 className="text-xl font-bold text-red-600 mb-2">
            Exam Terminated
          </h2>
          <p className="text-gray-600 mb-4">
            You have been expelled from the exam due to violation of exam rules.
          </p>
          <p className="text-sm text-gray-500 mb-4">
            Device: {isMobileDevice ? "Mobile" : "Desktop"}
          </p>
          <p className="text-sm text-gray-500">
            Your responses have been automatically submitted.
          </p>
        </div>
      </div>
    );
  }

  // Exam Completion Screen
  if (examCompleted) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-lg w-full p-6 sm:p-8 text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-green-600"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-4">
            Exam Completed Successfully!
          </h2>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <div className="text-sm text-gray-600 space-y-2">
              <div>
                <span className="font-medium">Exam:</span> {currentExam.title}
              </div>
              <div>
                <span className="font-medium">Code:</span> {currentExam.code}
              </div>
              <div>
                <span className="font-medium">Questions Answered:</span>{" "}
                {getAnsweredCount()}/{getTotalQuestions()}
              </div>
              <div>
                <span className="font-medium">Device:</span>{" "}
                {isMobileDevice ? "Mobile" : "Desktop"}
              </div>
              <div>
                <span className="font-medium">Completion Reason:</span>
                <span
                  className={`ml-1 ${
                    completionReason === "time_up"
                      ? "text-orange-600"
                      : completionReason === "expelled"
                      ? "text-red-600"
                      : "text-green-600"
                  }`}
                >
                  {completionReason === "time_up"
                    ? "Time Expired"
                    : completionReason === "expelled"
                    ? "Exam Terminated"
                    : "Manual Submission"}
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <p className="text-gray-600 text-sm leading-relaxed">
              Your exam has been submitted successfully. You will be able to
              view your detailed results and performance analysis once the exam
              time period ends.
            </p>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 text-sm font-medium">
                📊 Check your dashboard to review this exam when the exam time
                ends.
              </p>
            </div>

            <button
              onClick={() => (window.location.href = "/dashboard")}
              className="w-full py-3 px-6 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors"
            >
              Go to Dashboard
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Enhanced consent screen with device-specific instructions
  if (showConsent) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-4 sm:py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4 sm:p-6 lg:p-8">
              <div className="text-center">
                <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-20 lg:h-20 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-white font-bold text-lg sm:text-xl lg:text-2xl">
                    {currentExam.examType}
                  </span>
                </div>
                <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold mb-2">
                  {currentExam.title}
                </h1>
                <p className="text-blue-100">Code: {currentExam.code}</p>
                <div className="mt-3 inline-flex items-center px-3 py-1 bg-white bg-opacity-20 rounded-full">
                  <span className="text-sm">
                    {isMobileDevice ? "📱 Mobile Device" : "💻 Desktop Device"}{" "}
                    Detected
                  </span>
                </div>
              </div>
            </div>

            <div className="p-4 sm:p-6 lg:p-8">
              {/* User Info and Exam Details */}
              <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <div className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-blue-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                      />
                    </svg>
                    Candidate Information
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Name:</span>
                      <span className="font-medium text-gray-900">
                        {currentUser.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">ID:</span>
                      <span className="font-medium text-gray-900">
                        {currentUser.studentId}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <svg
                      className="w-5 h-5 text-purple-600 mr-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Exam Details
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 block">Questions:</span>
                      <span className="font-bold text-gray-900">
                        {getTotalQuestions()}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Duration:</span>
                      <span className="font-bold text-gray-900">
                        {currentExam.duration} min
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Total Marks:</span>
                      <span className="font-bold text-gray-900">
                        {currentExam.totalMarks}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600 block">Negative:</span>
                      <span className="font-bold text-red-600">
                        -{currentExam.negativeMarks}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Subjects */}
              <div className="mb-8">
                <h3 className="font-semibold text-gray-900 mb-4 flex items-center">
                  <svg
                    className="w-5 h-5 text-green-600 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
                    />
                  </svg>
                  Subjects & Questions
                  <span className="ml-2 text-sm text-gray-500">
                    ({currentExam.subjects.length} subjects)
                  </span>
                </h3>

                <div className="relative">
                  <div className="absolute -top-2 right-0 text-xs text-gray-500 animate-pulse">
                    Scroll to see all ↓
                  </div>

                  <div className="max-h-64 overflow-y-auto border border-gray-200 rounded-xl bg-gradient-to-b from-white to-gray-50">
                    <div className="p-4 space-y-3">
                      {currentExam.subjects.map((subject, index) => (
                        <div
                          key={subject._id}
                          className="flex justify-between items-center p-4 bg-white rounded-lg shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                              <span className="text-blue-600 font-bold text-sm">
                                {index + 1}
                              </span>
                            </div>
                            <span className="font-medium text-gray-900">
                              {subject.name}
                            </span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {subject.questionCount} questions
                            </span>
                            <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="h-4 bg-gradient-to-t from-gray-100 to-transparent pointer-events-none"></div>
                  </div>
                </div>
              </div>

              {/* Device-specific Rules */}
              <div
                className={`${
                  isMobileDevice
                    ? "bg-gradient-to-r from-orange-50 to-yellow-50 border-l-4 border-orange-400"
                    : "bg-gradient-to-r from-red-50 to-orange-50 border-l-4 border-red-400"
                } rounded-lg p-6 mb-8`}
              >
                <h3
                  className={`font-bold mb-4 flex items-center text-lg ${
                    isMobileDevice ? "text-orange-800" : "text-red-800"
                  }`}
                >
                  <svg
                    className="w-6 h-6 mr-2"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                    />
                  </svg>
                  {isMobileDevice
                    ? "📱 MOBILE EXAM RULES"
                    : "💻 DESKTOP EXAM RULES"}
                </h3>

                <div className="grid lg:grid-cols-2 gap-4">
                  <ul
                    className={`space-y-3 text-sm ${
                      isMobileDevice ? "text-orange-700" : "text-red-700"
                    }`}
                  >
                    {isMobileDevice ? (
                      <>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>FULLSCREEN REQUIRED</strong> - Stay in
                            fullscreen mode
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>NO APP SWITCHING</strong> - Warning then
                            expulsion
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>CLOSE OTHER APPS</strong> - Close all
                            background apps
                          </span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>FULLSCREEN MANDATORY</strong> - Cannot exit
                            once started
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>NO TAB SWITCHING</strong> - Immediate
                            expulsion
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>NO FUNCTION KEYS</strong> - F11, Escape,
                            Alt+Tab blocked
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                  <ul
                    className={`space-y-3 text-sm ${
                      isMobileDevice ? "text-orange-700" : "text-red-700"
                    }`}
                  >
                    {isMobileDevice ? (
                      <>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>ENABLE DO NOT DISTURB</strong> - Avoid
                            interruptions
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>STABLE INTERNET</strong> - Ensure good
                            connection
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-orange-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>BATTERY CHECK</strong> - Ensure sufficient
                            charge
                          </span>
                        </li>
                      </>
                    ) : (
                      <>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>AUTO-SUBMIT</strong> - When time expires
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>NO PAUSE/STOP</strong> - Cannot interrupt
                            once started
                          </span>
                        </li>
                        <li className="flex items-start">
                          <span className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                          <span>
                            <strong>MONITORED</strong> - All activities tracked
                          </span>
                        </li>
                      </>
                    )}
                  </ul>
                </div>

                {isMobileDevice && (
                  <div className="mt-4 p-3 bg-orange-100 rounded-lg">
                    <p className="text-sm text-orange-800">
                      <strong>Mobile users:</strong> You'll get a 5-second
                      warning to return to the exam if you switch apps. Desktop
                      users are expelled immediately.
                    </p>
                  </div>
                )}
              </div>

              {/* Enhanced Consent */}
              <div className="bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-xl p-6 mb-8">
                <label className="flex items-start space-x-4 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={consentChecked}
                    onChange={(e) => setConsentChecked(e.target.checked)}
                    className="mt-1 w-5 h-5 text-blue-600 border-2 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
                  />
                  <div className="flex-1">
                    <span className="text-gray-800 font-medium">
                      I hereby acknowledge and agree to the following:
                    </span>
                    <ul className="mt-2 text-sm text-gray-700 space-y-1 list-disc list-inside">
                      <li>I have read and understood all exam instructions</li>
                      <li>
                        I will maintain academic integrity throughout the
                        examination
                      </li>
                      <li>
                        I understand the{" "}
                        {isMobileDevice ? "mobile-specific" : "desktop"}{" "}
                        violation consequences
                      </li>
                      <li>
                        <strong
                          className={
                            isMobileDevice ? "text-orange-700" : "text-red-700"
                          }
                        >
                          I accept that I cannot exit fullscreen mode once
                          started
                        </strong>
                      </li>
                    </ul>
                  </div>
                </label>
              </div>

              {/* Enhanced Start Button */}
              <div className="text-center">
                <button
                  onClick={handleStartExam}
                  disabled={!consentChecked}
                  className={`relative px-8 sm:px-12 py-3 sm:py-4 rounded-xl font-bold text-base sm:text-lg transition-all duration-300 transform ${
                    consentChecked
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 hover:scale-105 shadow-lg hover:shadow-xl"
                      : "bg-gray-300 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  {consentChecked ? (
                    <>
                      <span className="flex items-center justify-center space-x-2">
                        <svg
                          className="w-5 h-5"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M13 10V3L4 14h7v7l9-11h-7z"
                          />
                        </svg>
                        <span>
                          Start {isMobileDevice ? "Mobile" : "Desktop"} Exam
                        </span>
                      </span>
                    </>
                  ) : (
                    "Please accept the terms to continue"
                  )}
                </button>

                {consentChecked && (
                  <p className="mt-3 text-sm text-gray-600">
                    Click to enter fullscreen mode and begin your examination
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Main exam interface
  return (
    <div
      className="h-screen bg-white overflow-hidden fixed inset-0 z-[9999] flex flex-col lg:flex-row"
      onMouseMove={handleMouseMove}
    >
      {/* Enhanced Violation Warning */}
      {showViolationWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-[10000] p-4">
          <div className="bg-white rounded-2xl p-6 sm:p-8 max-w-md mx-4 text-center shadow-2xl">
            <div
              className={`w-20 h-20 ${
                isMobileDevice ? "bg-orange-100" : "bg-red-100"
              } rounded-full flex items-center justify-center mx-auto mb-6`}
            >
              <svg
                className={`w-10 h-10 ${
                  isMobileDevice ? "text-orange-600" : "text-red-600"
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                />
              </svg>
            </div>
            <h2
              className={`text-xl sm:text-2xl font-bold mb-4 ${
                isMobileDevice ? "text-orange-600" : "text-red-600"
              }`}
            >
              {isMobileDevice ? "WARNING!" : "EXAM RULE VIOLATION!"}
            </h2>
            <p className="text-gray-700 mb-6 text-sm sm:text-base">
              {violationMessage}
            </p>
            <div
              className={`${
                isMobileDevice
                  ? "bg-orange-50 border-orange-200"
                  : "bg-red-50 border-red-200"
              } border rounded-lg p-4`}
            >
              <p
                className={`${
                  isMobileDevice ? "text-orange-800" : "text-red-800"
                } font-medium text-sm`}
              >
                {isMobileDevice
                  ? "Please return to the exam immediately. You have 5 seconds to comply."
                  : "Your responses are being automatically submitted..."}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Left Sidebar */}
      <div className="lg:w-80 lg:bg-gray-100 lg:border-r lg:border-gray-300 lg:flex lg:flex-col">
        {/* Fixed Timer Section */}
        <div className="bg-white border-b border-gray-300 p-4 lg:p-6 flex-shrink-0 sticky top-0 z-10">
          <div className="flex lg:block items-center justify-between">
            <div className="text-center lg:mb-0">
              <div className="text-2xl lg:text-4xl font-mono font-bold bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg">
                {formatTime(timeLeft)}
              </div>
              <p className="text-gray-600 text-xs lg:text-sm mt-2">
                Time Remaining
              </p>
            </div>

            <button
              onClick={() => setShowMobileNavigation(!showMobileNavigation)}
              className="lg:hidden p-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {showMobileNavigation && (
          <div className="lg:hidden absolute top-24 left-0 right-0 bg-white border-b border-gray-300 z-50 max-h-96 overflow-y-auto shadow-lg">
            <div className="p-4">
              <div className="mb-4 bg-gray-50 rounded-lg p-3">
                <h2 className="font-semibold mb-2 text-gray-900">
                  {currentExam.title}
                </h2>
                <div className="text-sm text-gray-600 grid grid-cols-2 gap-2">
                  <div>Code: {currentExam.code}</div>
                  <div>
                    Questions: {getAnsweredCount()}/{getTotalQuestions()}
                  </div>
                  <div>Review: {getReviewMarkedCount()}</div>
                  <div className="text-sm text-blue-600">
                    {isMobileDevice ? "Mobile" : "Desktop"}
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-semibold mb-3 text-gray-900">Subjects</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {currentExam.subjects.map((subject, subjectIndex) => (
                    <div
                      key={subject._id}
                      className="bg-gray-50 rounded-lg p-3"
                    >
                      <h4 className="text-sm font-medium text-gray-700 mb-2 flex items-center justify-between">
                        <span>{subject.name}</span>
                        <span className="text-xs text-gray-500">
                          ({subject.questionCount})
                        </span>
                      </h4>
                      <div className="grid grid-cols-8 gap-1">
                        {subject.questions.map((_, questionIndex) => {
                          const status = getQuestionStatus(
                            subjectIndex,
                            questionIndex
                          );
                          const questionNumber =
                            currentExam.subjects
                              .slice(0, subjectIndex)
                              .reduce((acc, s) => acc + s.questions.length, 0) +
                            questionIndex +
                            1;

                          const statusColors = {
                            current:
                              "bg-blue-600 text-white ring-2 ring-blue-300",
                            answered: "bg-green-600 text-white",
                            visited: "bg-blue-400 text-white",
                            review: "bg-orange-500 text-white",
                            "not-visited":
                              "bg-white border border-gray-300 text-gray-600",
                          };

                          return (
                            <button
                              key={questionIndex}
                              onClick={() =>
                                goToQuestion(subjectIndex, questionIndex)
                              }
                              className={`w-8 h-8 rounded text-xs font-medium transition-all ${statusColors[status]} hover:shadow-md`}
                            >
                              {questionNumber}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Desktop Sidebar */}
        <div className="hidden lg:flex lg:flex-col lg:flex-1 lg:overflow-hidden">
          <div className="p-4 border-b border-gray-300 bg-white flex-shrink-0">
            <h2 className="font-semibold mb-2 text-gray-900">
              {currentExam.title}
            </h2>
            <div className="text-sm text-gray-600 space-y-1">
              <div>Code: {currentExam.code}</div>
              <div>
                Questions: {getAnsweredCount()}/{getTotalQuestions()}
              </div>
              <div>Review: {getReviewMarkedCount()}</div>
              <div className="text-blue-600">
                {isMobileDevice ? "Mobile" : "Desktop"} Mode
              </div>
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-4">
            <h3 className="font-semibold mb-3 text-gray-900 sticky top-0 bg-gray-100 py-2 -mx-4 px-4">
              Subjects
            </h3>
            <div className="space-y-4">
              {currentExam.subjects.map((subject, subjectIndex) => (
                <div
                  key={subject._id}
                  className="bg-white rounded-lg p-3 shadow-sm border border-gray-200"
                >
                  <h4 className="text-sm font-medium text-gray-700 mb-3 flex items-center justify-between">
                    <span className="truncate">{subject.name}</span>
                    <span className="text-xs text-gray-500 ml-2">
                      ({subject.questionCount})
                    </span>
                  </h4>
                  <div className="grid grid-cols-5 gap-1">
                    {subject.questions.map((_, questionIndex) => {
                      const status = getQuestionStatus(
                        subjectIndex,
                        questionIndex
                      );
                      const questionNumber =
                        currentExam.subjects
                          .slice(0, subjectIndex)
                          .reduce((acc, s) => acc + s.questions.length, 0) +
                        questionIndex +
                        1;

                      const statusColors = {
                        current:
                          "bg-blue-600 text-white ring-2 ring-blue-300 ring-offset-1",
                        answered: "bg-green-600 text-white",
                        visited: "bg-blue-400 text-white",
                        review: "bg-orange-500 text-white",
                        "not-visited":
                          "bg-white border border-gray-300 text-gray-600",
                      };

                      return (
                        <button
                          key={questionIndex}
                          onClick={() =>
                            goToQuestion(subjectIndex, questionIndex)
                          }
                          className={`w-8 h-8 rounded text-xs font-medium transition-all transform hover:scale-105 ${statusColors[status]} hover:shadow-md`}
                        >
                          {questionNumber}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="p-4 border-t border-gray-300 bg-white flex-shrink-0">
            <h4 className="text-sm font-medium text-gray-700 mb-2">Legend</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-white border border-gray-300 rounded"></div>
                <span className="text-gray-600">Not Visited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-400 rounded"></div>
                <span className="text-gray-600">Visited</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-green-600 rounded"></div>
                <span className="text-gray-600">Answered</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-orange-500 rounded"></div>
                <span className="text-gray-600">Review</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        <div className="bg-white border-b border-gray-300 p-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-lg lg:text-xl font-semibold text-gray-900">
                Question {getCurrentQuestionNumber()} of {getTotalQuestions()}
              </h1>
              <p className="text-gray-600 text-sm">
                {currentExam.subjects[currentSubjectIndex].name}
              </p>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6">
            <div className="max-w-4xl mx-auto">
              <div className="mb-4">
                <div
                  className="text-lg lg:text-xl leading-relaxed mb-6 text-gray-900"
                  dangerouslySetInnerHTML={{
                    __html: getCurrentQuestion()?.text || "",
                  }}
                />

                <div className="space-y-3">
                  {getCurrentQuestion()?.options.map((option, index) => {
                    const questionKey = `${currentSubjectIndex}-${currentQuestionIndex}`;
                    const isSelected = answers[questionKey] === index;

                    return (
                      <label
                        key={index}
                        className={`flex items-start space-x-3 lg:space-x-4 p-4 rounded-lg border-2 cursor-pointer transition-all ${
                          isSelected
                            ? "border-blue-500 bg-blue-50 shadow-md"
                            : "border-gray-300 hover:border-gray-400 hover:bg-gray-50"
                        }`}
                      >
                        <input
                          type="radio"
                          name={`question-${getCurrentQuestionNumber()}`}
                          checked={isSelected}
                          onChange={() => handleAnswerSelect(index)}
                          className="mt-1 w-4 h-4 text-blue-600 border-gray-300 focus:ring-blue-500"
                        />
                        <div className="flex-1">
                          <span className="inline-flex items-center justify-center w-7 h-7 lg:w-8 lg:h-8 bg-gray-200 text-gray-700 rounded-full text-sm font-bold mr-3 lg:mr-4">
                            {String.fromCharCode(65 + index)}
                          </span>
                          <span
                            className="text-gray-900 text-sm lg:text-base"
                            dangerouslySetInnerHTML={{ __html: option }}
                          />
                        </div>
                      </label>
                    );
                  })}
                </div>

                {/* Navigation Buttons - Close to options */}
                <div className="flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 mt-4">
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={
                      currentSubjectIndex === 0 && currentQuestionIndex === 0
                    }
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                    <span>Previous</span>
                  </button>

                  <button
                    onClick={toggleReviewMark}
                    className={`w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 rounded-lg transition-all ${
                      reviewMarked.has(
                        `${currentSubjectIndex}-${currentQuestionIndex}`
                      )
                        ? "bg-orange-500 text-white shadow-lg"
                        : "bg-orange-100 text-orange-700 hover:bg-orange-200"
                    }`}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"
                      />
                    </svg>
                    <span>Mark for Review</span>
                  </button>

                  <button
                    onClick={goToNextQuestion}
                    disabled={
                      currentSubjectIndex === currentExam.subjects.length - 1 &&
                      currentQuestionIndex ===
                        currentExam.subjects[currentSubjectIndex].questions
                          .length -
                          1
                    }
                    className="w-full sm:w-auto flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <span>Save & Next</span>
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button - Smart positioning: between content and footer */}
        <div className="bg-white border-t border-gray-300 p-6 flex-shrink-0">
          <div className="text-center">
            <button
              onClick={() => setShowSubmitConfirm(true)}
              className="px-8 py-3 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Submit Exam
            </button>
          </div>
        </div>
      </div>

      {/* Submit Confirmation Modal */}
      {showSubmitConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <svg
                  className="w-5 h-5 text-red-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
                  />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900">
                Submit Exam
              </h3>
            </div>

            <div className="mb-6">
              <p className="text-gray-600 mb-4">
                Are you sure you want to submit your exam? This action cannot be
                undone.
              </p>

              <div className="bg-gray-50 rounded-lg p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total Questions:</span>
                    <span className="ml-2 font-medium">
                      {getTotalQuestions()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Answered:</span>
                    <span className="ml-2 font-medium text-green-600">
                      {getAnsweredCount()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Unanswered:</span>
                    <span className="ml-2 font-medium text-red-600">
                      {getTotalQuestions() - getAnsweredCount()}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Time Left:</span>
                    <span className="ml-2 font-medium">
                      {formatTime(timeLeft)}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                onClick={() => setShowSubmitConfirm(false)}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleManualSubmit}
                className="flex-1 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Submit Exam
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Auto-submit warning */}
      {timeLeft <= 60 && timeLeft > 0 && !examCompleted && (
        <div className="fixed bottom-4 right-4 bg-red-600 text-white px-4 sm:px-6 py-3 rounded-lg shadow-lg animate-bounce max-w-xs z-50">
          <div className="flex items-center space-x-2">
            <svg
              className="w-5 h-5 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.268 16.5c-.77.833.192 2.5 1.732 2.5z"
              />
            </svg>
            <span className="font-medium text-sm">
              Auto-submit in {timeLeft}s!
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default LiveExamRoom;
