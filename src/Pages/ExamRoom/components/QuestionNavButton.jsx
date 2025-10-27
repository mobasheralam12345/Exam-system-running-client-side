const QuestionNavButton = ({ questionNumber, status, onClick }) => {
  const statusColors = {
    current: "bg-blue-600 text-white ring-2 ring-blue-300",
    answered: "bg-green-600 text-white",
    visited: "bg-blue-400 text-white",
    review: "bg-orange-500 text-white",
    "not-visited": "bg-white border border-gray-300 text-gray-600",
  };

  return (
    <button
      onClick={onClick}
      className={`w-8 h-8 rounded text-xs font-medium transition-colors ${statusColors[status]}`}
    >
      {questionNumber}
    </button>
  );
};

export default QuestionNavButton;
