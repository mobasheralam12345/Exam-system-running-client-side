import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HscExamSelector = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [examYear, setExamYear] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

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

  const years = Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2025 - i);

  const handleProceed = () => {
    if (!examYear || !selectedGroup || !selectedBoard) {
      Swal.fire("Please select all fields before proceeding");
      return;
    }
    setLoading(true);
    fetch(
      `${BACKEND_URL}/hsc-questions/${examYear}/${encodeURIComponent(
        selectedBoard
      )}/${encodeURIComponent(selectedGroup)}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          navigate("/exam/practice", {
            state: {
              examData: data.data,
              examType: "HSC",
              category: "full",
              title: `HSC ${selectedGroup} ${data.data.examYear} ${selectedBoard} Exam`,
              year: data.data.examYear,
              hscGroup: selectedGroup,
              hscBoard: selectedBoard,
            },
          });
          setSelectedGroup("");
          setSelectedBoard("");
          setExamYear("");
          setLoading(false);
        } else {
          setLoading(false);
          Swal.fire("Exam not found for the selected details");
        }
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire(`Failed to load exam: ${err.message}`);
      });
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
          disabled={loading}
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
          disabled={loading}
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
        <label
          htmlFor="yearSelect"
          className="text-xl font-semibold text-gray-700"
        >
          Select Exam Year:
        </label>
        <select
          id="yearSelect"
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={examYear}
          onChange={(e) => setExamYear(e.target.value)}
          disabled={loading}
        >
          <option value="" disabled>
            Select a Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-10 flex justify-center">
        <button
          className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
          onClick={handleProceed}
          disabled={!examYear || !selectedGroup || !selectedBoard || loading}
        >
          {loading ? "Loading..." : "Start Exam"}
        </button>
      </div>
    </div>
  );
};

export default HscExamSelector;
