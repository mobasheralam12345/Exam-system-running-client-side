import React, { useState } from "react";
import Swal from "sweetalert2";
import HscSubjectWiseQuiz from "./HscSubjectWiseQuiz";

const HscSubjectWiseExam = ({ onSelect }) => {
  const [selectedSubject, setSelectedSubject] = useState(""); // Default subject
  const [totalQuestions, setTotalQuestions] = useState(); // Default question count

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleQuestionsChange = (e) => {
    setTotalQuestions(e.target.value);
  };

  const handleProceed = () => {
    if (selectedSubject && totalQuestions > 0) {
      localStorage.setItem("hscSubject", selectedSubject);
      localStorage.setItem("totalQuestions", totalQuestions);
      onSelect(selectedSubject, totalQuestions);
      Swal.fire({
        position: "center",
        title: "Your Exam is started",
        showConfirmButton: false,
        timer: 500,
      });
    } else {
      Swal.fire(
        "Please select a subject and enter a valid number of questions before proceeding"
      );
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
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-black"
          value={selectedSubject}
          onChange={handleSubjectChange}
        >
          <option value="">Select Subject</option>

          <option value="Bangla 1st Paper">Bangla 1st Paper</option>
          <option value="Bangla 2nd Paper">Bangla 2nd Paper</option>
          <option value="English 1st Paper">English 1st Paper</option>
          <option value="English 2nd Paper">English 2nd Paper</option>
          <option value="ICT">ICT</option>

          <option value="Higher Mathematics 1st Paper">
            Higher Mathematics 1st Paper
          </option>
          <option value="Higher Mathematics 2nd Paper">
            Higher Mathematics 2nd Paper
          </option>
          <option value="Physics 1st Paper">Physics 1st Paper</option>
          <option value="Physics 2nd Paper">Physics 2nd Paper</option>
          <option value="Chemistry 1st Paper">Chemistry 1st Paper</option>
          <option value="Chemistry 2nd Paper">Chemistry 2nd Paper</option>
          <option value="Biology 1st Paper">Biology 1st Paper</option>
          <option value="Biology 2nd Paper">Biology 2nd Paper</option>

          <option value="Accounting 1st Paper">Accounting 1st Paper</option>
          <option value="Accounting 2nd Paper">Accounting 2nd Paper</option>
          <option value="Business Organization & Management 1st Paper">
            Business Organization & Management 1st Paper
          </option>
          <option value="Business Organization & Management 2nd Paper">
            Business Organization & Management 2nd Paper
          </option>
          <option value="Finance, Banking & Insurance 1st Paper">
            Finance, Banking & Insurance 1st Paper
          </option>
          <option value="Finance, Banking & Insurance 2nd Paper">
            Finance, Banking & Insurance 2nd Paper
          </option>
          <option value="Economics 1st Paper">Economics 1st Paper</option>
          <option value="Economics 2nd Paper">Economics 2nd Paper</option>

          <option value="Civics 1st Paper">Civics 1st Paper</option>
          <option value="Civics 2nd Paper">Civics 2nd Paper</option>
          <option value="History 1st Paper">History 1st Paper</option>
          <option value="History 2nd Paper">History 2nd Paper</option>
          <option value="Geography 1st Paper">Geography 1st Paper</option>
          <option value="Geography 2nd Paper">Geography 2nd Paper</option>
          <option value="Social Work 1st Paper">Social Work 1st Paper</option>
          <option value="Social Work 2nd Paper">Social Work 2nd Paper</option>
          <option value="Logic 1st Paper">Logic 1st Paper</option>
          <option value="Logic 2nd Paper">Logic 2nd Paper</option>
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
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-white"
          value={totalQuestions}
          placeholder="Enter a Number from 1 to 100"
          onChange={handleQuestionsChange}
          min="1"
        />
      </div>
      <div className="mt-4 flex justify-center">
        <button
          className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
          onClick={handleProceed}
        >
          Start Exam
        </button>
      </div>
    </div>
  );
};

const QuizContainer = () => {
  const [isQuizStarted, setIsQuizStarted] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("");
  const [totalQuestions, setTotalQuestions] = useState(0);

  const handleSelect = (subject, questions) => {
    setSelectedSubject(subject);
    setTotalQuestions(questions);
    setIsQuizStarted(true);
  };

  return (
    <div>
      {!isQuizStarted ? (
        <HscSubjectWiseExam onSelect={handleSelect} />
      ) : (
        <HscSubjectWiseQuiz
          subject={selectedSubject}
          totalQuestions={totalQuestions}
        />
      )}
    </div>
  );
};

export default QuizContainer;
