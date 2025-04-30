import React, { useState } from "react";
import Swal from "sweetalert2";
import HscQuiz from "./HscQuiz";

const QuestionSelector = ({ onSelect }) => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [examYear, setExamYear] = useState("");

  const groups = ["Science", "Business Studies", "Humanities"];
  const boards = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Dinajpur",
    "Mymensingh",
    "Jessore",
    "Comilla",
  ];

  const handleProceed = () => {
    if (selectedGroup && selectedBoard && examYear) {
      localStorage.setItem("group", selectedGroup);
      localStorage.setItem("board", selectedBoard);
      localStorage.setItem("examYear", examYear);

      if (onSelect) {
        onSelect(selectedGroup, selectedBoard, examYear);
      } else {
        console.error("onSelect function is not provided!");
      }

      Swal.fire({
        position: "center",
        title: "Your Exam is started",
        showConfirmButton: false,
        timer: 500,
      });
    } else {
      Swal.fire("Please select all fields before proceeding");
    }
  };

  return (
    <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
      <h2 className="text-4xl text-center font-bold text-gray-800 mb-4">
        Select Exam Details
      </h2>
      <div className="mt-4">
        <label className="text-xl font-semibold text-gray-700">
          Choose a Group:
        </label>
        <select
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={selectedGroup}
          onChange={(e) => setSelectedGroup(e.target.value)}
        >
          <option value="" disabled>
            Select a Group
          </option>
          {groups.map((group) => (
            <option key={group} value={group}>
              {group}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="text-xl font-semibold text-gray-700">
          Choose a Board:
        </label>
        <select
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={selectedBoard}
          onChange={(e) => setSelectedBoard(e.target.value)}
        >
          <option value="" disabled>
            Select a Board
          </option>
          {boards.map((board) => (
            <option key={board} value={board}>
              {board}
            </option>
          ))}
        </select>
      </div>

      <div className="mt-4">
        <label className="text-xl font-semibold text-gray-700">
          Select Exam Year:
        </label>
        <select
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={examYear}
          onChange={(e) => setExamYear(e.target.value)}
        >
          <option value="">Select Year</option>
          {Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2025 - i).map(
            (year) => (
              <option key={year} value={year}>
                {year}
              </option>
            )
          )}
        </select>
      </div>
      <div className="mt-10 flex justify-center">
        <button
          className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
          onClick={handleProceed}
          disabled={!selectedGroup || !selectedBoard || !examYear}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

const QuizContainer = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [examYear, setExamYear] = useState("");

  const handleSelectDetails = (group, board, year) => {
    setSelectedGroup(group);
    setSelectedBoard(board);
    setExamYear(year);
    setIsQuizStarted(true);
  };

  return (
    <div>
      {!isQuizStarted ? (
        <QuestionSelector onSelect={handleSelectDetails} />
      ) : (
        <HscQuiz
          group={selectedGroup}
          board={selectedBoard}
          examYear={examYear}
        />
      )}
    </div>
  );
};

export default QuizContainer;
