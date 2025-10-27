const TimerDisplay = ({ timeLeft }) => {
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white border-b p-4">
      <div className="text-center">
        <div className="text-3xl font-mono font-bold bg-red-600 text-white px-4 py-2 rounded-lg">
          {formatTime(timeLeft)}
        </div>
        <p className="text-sm text-gray-600 mt-2">Time Remaining</p>
      </div>
    </div>
  );
};

export default TimerDisplay;
