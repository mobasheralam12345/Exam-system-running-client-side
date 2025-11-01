import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import ExamHeader from "./components/ExamHeader";
import QuestionDisplay from "./components/QuestionDisplay";
import NavigationSidebar from "./components/NavigationSidebar";
import StartConfirmation from "./screens/StartConfirmation";
import SubmitConfirmation from "./screens/SubmitConfirmation";
import ExamReview from "./ExamReview";

const OthersExamRoom = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const [examData, setExamData] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [currentSubjectIndex, setCurrentSubjectIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [reviewMarked, setReviewMarked] = useState(new Set());
  const [visitedQuestions, setVisitedQuestions] = useState(new Set());
  const [timeLeft, setTimeLeft] = useState(0);
  const [examStarted, setExamStarted] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(true);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);
  const [showMobileSidebar, setShowMobileSidebar] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const getStorageKey = (key) => {
    return examData ? `practice_exam_${examData._id}_${key}` : null;
  };

  // Load exam data and restore state from localStorage
  useEffect(() => {
    const passedExamData = location.state?.examData;
    if (passedExamData) {
      setExamData(passedExamData);

      // Check if there's an existing session for this exam
      const savedStartTime = localStorage.getItem(
        `practice_exam_${passedExamData._id}_startTime`
      );
      const savedAnswers = localStorage.getItem(
        `practice_exam_${passedExamData._id}_answers`
      );
      const savedReviewMarked = localStorage.getItem(
        `practice_exam_${passedExamData._id}_reviewMarked`
      );
      const savedVisitedQuestions = localStorage.getItem(
        `practice_exam_${passedExamData._id}_visitedQuestions`
      );
      const savedCurrentSubject = localStorage.getItem(
        `practice_exam_${passedExamData._id}_currentSubject`
      );
      const savedCurrentQuestion = localStorage.getItem(
        `practice_exam_${passedExamData._id}_currentQuestion`
      );

      // Restore answers and navigation state
      if (savedAnswers) {
        setAnswers(JSON.parse(savedAnswers));
      }
      if (savedReviewMarked) {
        setReviewMarked(new Set(JSON.parse(savedReviewMarked)));
      }
      if (savedVisitedQuestions) {
        setVisitedQuestions(new Set(JSON.parse(savedVisitedQuestions)));
      }
      if (savedCurrentSubject) {
        setCurrentSubjectIndex(parseInt(savedCurrentSubject));
      }
      if (savedCurrentQuestion) {
        setCurrentQuestionIndex(parseInt(savedCurrentQuestion));
      }

      // Calculate remaining time based on start time
      if (savedStartTime) {
        const startTime = parseInt(savedStartTime);
        const totalDuration = passedExamData.duration
          ? passedExamData.duration * 60
          : passedExamData.totalQuestions * 60;
        const elapsedTime = Math.floor((Date.now() - startTime) / 1000);
        const remaining = Math.max(0, totalDuration - elapsedTime);
        setTimeLeft(remaining);

        // If time already expired, mark as completed
        if (remaining === 0) {
          setExamCompleted(true);
        }
      } else {
        // New exam - set initial time
        const totalTime = passedExamData.duration
          ? passedExamData.duration * 60
          : passedExamData.totalQuestions * 60;
        setTimeLeft(totalTime);
      }
    } else {
      navigate("/exams");
    }
  }, [location.state, navigate]);

  // Timer countdown
  useEffect(() => {
    if (!examStarted || timeLeft <= 0 || examCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setExamCompleted(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft, examCompleted]);

  // Save answers to localStorage
  useEffect(() => {
    if (examData && examStarted && !examCompleted) {
      localStorage.setItem(getStorageKey("answers"), JSON.stringify(answers));
    }
  }, [answers, examData, examStarted, examCompleted]);

  // Save review marks
  useEffect(() => {
    if (examData && examStarted && !examCompleted) {
      localStorage.setItem(
        getStorageKey("reviewMarked"),
        JSON.stringify([...reviewMarked])
      );
    }
  }, [reviewMarked, examData, examStarted, examCompleted]);

  // Save visited questions
  useEffect(() => {
    if (examData && examStarted && !examCompleted) {
      localStorage.setItem(
        getStorageKey("visitedQuestions"),
        JSON.stringify([...visitedQuestions])
      );
    }
  }, [visitedQuestions, examData, examStarted, examCompleted]);

  // Save current position
  useEffect(() => {
    if (examData && examStarted && !examCompleted) {
      localStorage.setItem(
        getStorageKey("currentSubject"),
        currentSubjectIndex.toString()
      );
      localStorage.setItem(
        getStorageKey("currentQuestion"),
        currentQuestionIndex.toString()
      );
    }
  }, [
    currentSubjectIndex,
    currentQuestionIndex,
    examData,
    examStarted,
    examCompleted,
  ]);

  useEffect(() => {
    // Only auto-request on very first mount
    const enterFullscreen = async () => {
      try {
        const elem = document.documentElement;
        if (elem.requestFullscreen) await elem.requestFullscreen();
        else if (elem.webkitRequestFullscreen)
          await elem.webkitRequestFullscreen();
        else if (elem.mozRequestFullScreen) await elem.mozRequestFullScreen();
        else if (elem.msRequestFullscreen) await elem.msRequestFullscreen();
        setIsFullscreen(true);
      } catch (err) {
        setIsFullscreen(false);
      }
    };
    enterFullscreen();
    // eslint-disable-next-line
  }, []);

  // Listen to fullscreen changes
  useEffect(() => {
    const handleFullscreenChange = () => {
      const isCurrentlyFullscreen = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement ||
        document.mozFullScreenElement ||
        document.msFullscreenElement
      );
      setIsFullscreen(isCurrentlyFullscreen);
    };

    document.addEventListener("fullscreenchange", handleFullscreenChange);
    document.addEventListener("webkitfullscreenchange", handleFullscreenChange);
    document.addEventListener("mozfullscreenchange", handleFullscreenChange);
    document.addEventListener("MSFullscreenChange", handleFullscreenChange);

    return () => {
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
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
    };
  }, []);

  const clearExamStorage = () => {
    if (examData) {
      localStorage.removeItem(getStorageKey("answers"));
      localStorage.removeItem(getStorageKey("reviewMarked"));
      localStorage.removeItem(getStorageKey("visitedQuestions"));
      localStorage.removeItem(getStorageKey("currentSubject"));
      localStorage.removeItem(getStorageKey("currentQuestion"));
      localStorage.removeItem(`practice_exam_${examData._id}_startTime`);
    }
  };

  const handleStartExam = () => {
    setShowStartConfirm(false);
    setExamStarted(true);
    markQuestionVisited(0, 0);

    // Save start time to localStorage
    const startTime = Date.now();
    localStorage.setItem(
      `practice_exam_${examData._id}_startTime`,
      startTime.toString()
    );
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleSubmitConfirm = () => {
    setShowSubmitConfirm(false);
    setExamCompleted(true);
    clearExamStorage();
  };

  const handleSubmitCancel = () => {
    setShowSubmitConfirm(false);
  };

  const handleAnswerSelect = (optionIndex) => {
    const questionKey = `${currentSubjectIndex}-${currentQuestionIndex}`;
    setAnswers((prev) => ({ ...prev, [questionKey]: optionIndex }));
  };

  const toggleReviewMark = () => {
    const questionKey = `${currentSubjectIndex}-${currentQuestionIndex}`;
    setReviewMarked((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(questionKey)) newSet.delete(questionKey);
      else newSet.add(questionKey);
      return newSet;
    });
  };

  const markQuestionVisited = (subjectIndex, questionIndex) => {
    const questionKey = `${subjectIndex}-${questionIndex}`;
    setVisitedQuestions((prev) => new Set([...prev, questionKey]));
  };

  const goToQuestion = (subjectIndex, questionIndex) => {
    setCurrentSubjectIndex(subjectIndex);
    setCurrentQuestionIndex(questionIndex);
    markQuestionVisited(subjectIndex, questionIndex);
  };

  const handleQuestionSelect = (subjectIndex, questionIndex) => {
    goToQuestion(subjectIndex, questionIndex);
    setShowMobileSidebar(false);
  };

  const toggleMobileSidebar = () => {
    setShowMobileSidebar(!showMobileSidebar);
  };

  const goToNextQuestion = () => {
    const currentSubject = examData.subjects[currentSubjectIndex];
    if (currentQuestionIndex < currentSubject.questions.length - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
      markQuestionVisited(currentSubjectIndex, currentQuestionIndex + 1);
    } else if (currentSubjectIndex < examData.subjects.length - 1) {
      setCurrentSubjectIndex((prev) => prev + 1);
      setCurrentQuestionIndex(0);
      markQuestionVisited(currentSubjectIndex + 1, 0);
    }
  };

  const goToPreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
      markQuestionVisited(currentSubjectIndex, currentQuestionIndex - 1);
    } else if (currentSubjectIndex > 0) {
      const prevSubject = examData.subjects[currentSubjectIndex - 1];
      setCurrentSubjectIndex((prev) => prev - 1);
      setCurrentQuestionIndex(prevSubject.questions.length - 1);
      markQuestionVisited(
        currentSubjectIndex - 1,
        prevSubject.questions.length - 1
      );
    }
  };

  const isLastQuestion = () => {
    const lastSubjectIndex = examData.subjects.length - 1;
    const lastQuestionIndex =
      examData.subjects[lastSubjectIndex].questions.length - 1;
    return (
      currentSubjectIndex === lastSubjectIndex &&
      currentQuestionIndex === lastQuestionIndex
    );
  };

  const toggleFullscreen = async () => {
    try {
      if (!isFullscreen) {
        const elem = document.documentElement;
        if (elem.requestFullscreen) {
          await elem.requestFullscreen();
        } else if (elem.webkitRequestFullscreen) {
          await elem.webkitRequestFullscreen();
        } else if (elem.mozRequestFullScreen) {
          await elem.mozRequestFullScreen();
        } else if (elem.msRequestFullscreen) {
          await elem.msRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) {
          await document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) {
          await document.msExitFullscreen();
        }
      }
    } catch (error) {
      console.error("Fullscreen toggle error:", error);
    }
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (!examData) return <div>Loading...</div>;

  if (showStartConfirm) {
    return (
      <StartConfirmation
        examData={examData}
        onStart={handleStartExam}
        isLive={false}
      />
    );
  }

  if (examCompleted) {
    return <ExamReview examData={examData} answers={answers} />;
  }

  return (
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white relative">
      {/* Fullscreen Toggle Button - Always Visible */}
      <button
        onClick={toggleFullscreen}
        className={
          `fixed right-4 z-50 p-3 bg-blue-600 text-white rounded-lg shadow-lg 
     hover:bg-blue-700 transition-colors` +
          (isFullscreen ? " top-16" : " top-4") // top-16 = 4rem/64px from top, adjust as you prefer
        }
        title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
      >
        {isFullscreen ? (
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
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        ) : (
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
              d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4"
            />
          </svg>
        )}
      </button>

      {/* Mobile Sidebar Overlay */}
      {showMobileSidebar && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleMobileSidebar}
        ></div>
      )}

      {/* Sidebar */}
      <div
        className={`fixed lg:relative inset-y-0 left-0 z-50 lg:z-auto w-80 transform transition-transform duration-300 ease-in-out lg:transform-none ${
          showMobileSidebar
            ? "translate-x-0"
            : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <NavigationSidebar
          examData={examData}
          currentSubjectIndex={currentSubjectIndex}
          currentQuestionIndex={currentQuestionIndex}
          answers={answers}
          reviewMarked={reviewMarked}
          visitedQuestions={visitedQuestions}
          timeLeft={timeLeft}
          goToQuestion={handleQuestionSelect}
        />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col">
        {/* Mobile Header with Timer */}
        <div className="lg:hidden bg-white border-b shadow-sm">
          <div className="flex items-center justify-between p-3">
            <button
              onClick={toggleMobileSidebar}
              className="p-2 rounded-lg hover:bg-gray-100 transition-colors flex-shrink-0"
              aria-label="Toggle navigation"
            >
              <svg
                className="w-6 h-6 text-gray-700"
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

            {/* Timer */}
            <div className="flex flex-col items-center bg-blue-600 px-4 py-2 rounded-lg">
              <span className="text-2xl font-mono font-bold text-white">
                {formatTime(timeLeft)}
              </span>
              <span className="text-xs text-blue-100">Time Remaining</span>
            </div>

            <button
              onClick={handleSubmitClick}
              className="px-4 py-2 bg-red-600 text-white rounded-lg text-sm font-semibold hover:bg-red-700 transition-colors flex-shrink-0"
            >
              Submit
            </button>
          </div>

          {/* Question Info Bar */}
          <div className="px-3 py-2 bg-gray-50 border-t">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600 font-medium">
                Question {currentQuestionIndex + 1} of{" "}
                {examData.subjects.reduce(
                  (total, subject) => total + subject.questions.length,
                  0
                )}
              </span>
              <span className="text-gray-500 text-xs">
                {examData.subjects[currentSubjectIndex].name}
              </span>
            </div>
          </div>
        </div>

        {/* Desktop Header */}
        <div className="hidden lg:block">
          <ExamHeader
            examData={examData}
            currentSubjectIndex={currentSubjectIndex}
            currentQuestionIndex={currentQuestionIndex}
            onSubmit={handleSubmitClick}
            showSubmit={true}
          />
        </div>

        <QuestionDisplay
          question={
            examData.subjects[currentSubjectIndex].questions[
              currentQuestionIndex
            ]
          }
          answers={answers}
          currentSubjectIndex={currentSubjectIndex}
          currentQuestionIndex={currentQuestionIndex}
          onAnswerSelect={handleAnswerSelect}
          onToggleReview={toggleReviewMark}
          onNext={goToNextQuestion}
          onPrevious={goToPreviousQuestion}
          reviewMarked={reviewMarked}
          isLastQuestion={isLastQuestion()}
        />
      </div>

      {showSubmitConfirm && (
        <SubmitConfirmation
          onConfirm={handleSubmitConfirm}
          onCancel={handleSubmitCancel}
        />
      )}
    </div>
  );
};

export default OthersExamRoom;
