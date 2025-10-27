import { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import FullscreenToggle from "./components/FullscreenToggle";
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
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [examStarted, setExamStarted] = useState(false);
  const [showStartConfirm, setShowStartConfirm] = useState(true);
  const [examCompleted, setExamCompleted] = useState(false);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    const passedExamData = location.state?.examData;
    if (passedExamData) {
      setExamData(passedExamData);
      const totalTime = passedExamData.duration
        ? passedExamData.duration * 60
        : passedExamData.totalQuestions * 60;
      setTimeLeft(totalTime);
    } else {
      navigate("/exams");
    }
  }, [location.state, navigate]);

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

  const handleStartExam = () => {
    setShowStartConfirm(false);
    setExamStarted(true);
    markQuestionVisited(0, 0);
  };

  const handleSubmitClick = () => {
    setShowSubmitConfirm(true);
  };

  const handleSubmitConfirm = () => {
    setShowSubmitConfirm(false);
    setExamCompleted(true);
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
    <div className="h-screen flex flex-col lg:flex-row overflow-hidden bg-white">
      <FullscreenToggle
        isFullscreen={isFullscreen}
        setIsFullscreen={setIsFullscreen}
      />

      <NavigationSidebar
        examData={examData}
        currentSubjectIndex={currentSubjectIndex}
        currentQuestionIndex={currentQuestionIndex}
        answers={answers}
        reviewMarked={reviewMarked}
        visitedQuestions={visitedQuestions}
        timeLeft={timeLeft}
        goToQuestion={goToQuestion}
      />

      <div className="flex-1 flex flex-col">
        <ExamHeader
          examData={examData}
          currentSubjectIndex={currentSubjectIndex}
          currentQuestionIndex={currentQuestionIndex}
          onSubmit={handleSubmitClick}
          showSubmit={true}
        />

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
