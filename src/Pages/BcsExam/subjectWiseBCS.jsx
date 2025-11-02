import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const QuestionSelector = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Automatically redirect to homepage after 10 minutes
  useEffect(() => {
    let timer;
    if (!isLoading && !selectedSubject && !totalQuestions) {
      timer = setTimeout(() => {
        navigate("/");
      }, 5 * 60 * 1000); // 10 minutes
    }
    return () => clearTimeout(timer);
  }, [isLoading, selectedSubject, totalQuestions, navigate]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleQuestionsChange = (e) => {
    setTotalQuestions(e.target.value);
  };

  const handleProceed = async () => {
    const numQuestions = parseInt(totalQuestions, 10);

    if (!selectedSubject || isNaN(numQuestions) || numQuestions <= 0) {
      Swal.fire(
        "Please select a subject and enter a valid number of questions before proceeding"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/bcs-questions/subject/${encodeURIComponent(
          selectedSubject
        )}/${numQuestions}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch questions");
      }

      const res = await response.json();
      const examData = res.data;

      // Clear selections before navigating
      setSelectedSubject("");
      setTotalQuestions("");
      setIsLoading(false);

      // Navigate with examData in location state
      navigate("/exam/practice", { state: { examData } });

      // Reset all states immediately (already done) and handle automatic homepage navigation from useEffect
    } catch (err) {
      setIsLoading(false);
      Swal.fire("Error", err.message, "error");
    }
  };

  return (
    <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
      <h2 className="text-3xl text-center font-bold text-gray-800 mb-4">
        Start Exam
      </h2>
      <div className="mt-4">
        <label
          htmlFor="subject"
          className="text-xl font-semibold text-gray-700"
        >
          Choose a Subject:
        </label>
        <select
          id="subject"
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={selectedSubject}
          onChange={handleSubjectChange}
          disabled={isLoading}
        >
          <option value="">Select Subject</option>
          <option value="Bangla">বাংলা</option>
          <option value="English">English</option>
          <option value="Math">Math</option>
          <option value="বাংলাদেশ বিষয়াবলী">বাংলাদেশ বিষয়াবলী</option>
          <option value="বিশ্ব বিষয়াবলী">বিশ্ব বিষয়াবলী</option>
          <option value="মানসিক দক্ষতা">মানসিক দক্ষতা</option>
          <option value="ICT">ICT</option>
        </select>
      </div>
      <div className="mt-4">
        <label
          htmlFor="totalQuestions"
          className="text-xl font-semibold text-gray-700"
        >
          Total Questions:
        </label>
        <input
          type="number"
          id="totalQuestions"
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={totalQuestions}
          onChange={handleQuestionsChange}
          min="1"
          disabled={isLoading}
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className={`bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600 flex items-center justify-center ${
            isLoading ? "cursor-not-allowed opacity-70" : ""
          }`}
          onClick={handleProceed}
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                />
              </svg>
              Loading...
            </>
          ) : (
            "Start Exam"
          )}
        </button>
      </div>
    </div>
  );
};

export default QuestionSelector;
