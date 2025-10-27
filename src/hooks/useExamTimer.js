import { useState, useEffect } from "react";

const useExamTimer = (examStarted, examCompleted, examData, onTimeUp) => {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    if (examStarted && examData) {
      const now = new Date();
      const examStart = new Date(examData.startTime);
      const examEnd = new Date(examData.endTime);

      if (now < examStart) {
        setTimeLeft(0);
      } else if (now >= examEnd) {
        setTimeLeft(0);
        onTimeUp("time_up");
      } else {
        const remainingMs = examEnd - now;
        setTimeLeft(Math.max(0, Math.floor(remainingMs / 1000)));
      }
    }
  }, [examStarted, examData]);

  useEffect(() => {
    if (!examStarted || timeLeft <= 0 || examCompleted) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          onTimeUp("time_up");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [examStarted, timeLeft, examCompleted]);

  return { timeLeft, setTimeLeft };
};

export default useExamTimer;
