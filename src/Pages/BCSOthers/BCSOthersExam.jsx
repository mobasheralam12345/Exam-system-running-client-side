import React, { useState } from "react";
import Swal from "sweetalert2";
import Quiz from "./BCSOhersQuiz"; // Fixed typo in the import

const BCSOthersExam = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);

  const handleStart = () => {
    Swal.fire({
      position: "center",
      title: "Your Exam is started",
      showConfirmButton: false,
      timer: 500,
    });

    setIsQuizStarted(true);
  };

  return (
    <div>
      {!isQuizStarted ? (
        <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
          <h2 className="text-4xl text-center font-bold text-gray-800 mb-6">
            Start BCS Others Exam
          </h2>
          <div className="flex justify-center mt-10">
            <button
              className="bg-green-500 border w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
              onClick={handleStart}
            >
              Start Exam
            </button>
          </div>
        </div>
      ) : (
        <Quiz /> // Use BCSOthersQuiz directly
      )}
    </div>
  );
};

export default BCSOthersExam;
