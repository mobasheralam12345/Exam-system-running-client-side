import React, { useState } from "react";
import "./BCSExam.css";

const subjects = [
  { name: "Bangla", limit: 1 },
  { name: "English", limit: 1 },
  { name: "Math", limit: 1 },
  { name: "GK", limit: 1 },
  { name: "বাংলাদেশ বিষয়াবলী", limit: 1 },
  { name: "বিশ্ব বিষয়াবলী", limit: 1 },
  { name: "মানসিক দক্ষতা", limit: 1 },
  { name: "ICT", limit: 1 },
];

const BCSExamAdmin = () => {
  const [step, setStep] = useState(1); // 1 = Select Year, 2 = Question Form
  const [bcsYear, setBcsYear] = useState("");
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState({});

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    explanation: "",
  });

  const selectedSubject = subjects[selectedSubjectIndex];

  const handleInputChange = (e, field, optionKey = null) => {
    if (optionKey) {
      setNewQuestion({
        ...newQuestion,
        options: { ...newQuestion.options, [optionKey]: e.target.value },
      });
    } else {
      setNewQuestion({ ...newQuestion, [field]: e.target.value });
    }
  };

  const addQuestion = () => {
    const subjectQuestions = questions[selectedSubject.name] || [];

    if (subjectQuestions.length >= selectedSubject.limit) {
      alert(`You can only add ${selectedSubject.limit} questions for ${selectedSubject.name}.`);
      return;
    }

    setQuestions({
      ...questions,
      [selectedSubject.name]: [...subjectQuestions, newQuestion],
    });

    setNewQuestion({
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
    });
  };

  const isSubmitVisible = subjects.every(
    (subject) => (questions[subject.name] || []).length >= subject.limit
  );

  const handleSubmit = async () => {
    if (!bcsYear) {
      alert("BCS Year is missing.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bcsYear: parseInt(bcsYear),
          questions,
        }),
      });

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setQuestions({});
      } else {
        alert("Failed to submit questions.");
      }
    } catch (error) {
      alert("Error submitting questions.");
    }
  };

  // UI for step 1: select year
  if (step === 1) {
    return (
      <div className="flex flex-col items-center mt-32">
        <h1 className="text-4xl font-bold mb-4">Select BCS Year</h1>
        <select
          className="border text-xl px-4 py-2 rounded"
          value={bcsYear}
          onChange={(e) => setBcsYear(e.target.value)}
        >
          <option value="" className="text-xl">Select a year</option>
          {[...Array(46)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}th BCS
            </option>
          ))}
        </select>
        <button
          className="px-6 py-2 w-96 font-bold text-xl mt-8 bg-blue-500 text-white rounded"
          onClick={() => {
            if (bcsYear) setStep(2);
            else alert("Please select a year.");
          }}
        >
          Continue
        </button>
      </div>
    );
  }

  // Step 2: Add questions
  return (
    <div className="exam-container">
      <h1>BCS Exam - Admin Panel</h1>
      <div className="text-center mb-4 font-semibold text-blue-700">
        Year: {bcsYear}th BCS
      </div>

      {/* Subject Navigation */}
      <div className="subject-pagination flex justify-between items-center w-full">
        <button
          onClick={() => setSelectedSubjectIndex(Math.max(selectedSubjectIndex - 1, 0))}
          disabled={selectedSubjectIndex === 0}
          className="text-blue-600 font-medium disabled:text-gray-400"
        >
          ⬅ Previous
        </button>

        <div className="flex-grow text-center">
          <span className="text-lg font-semibold">{selectedSubject.name}</span>
        </div>

        <button
          onClick={() =>
            setSelectedSubjectIndex(Math.min(selectedSubjectIndex + 1, subjects.length - 1))
          }
          disabled={selectedSubjectIndex === subjects.length - 1}
          className="text-blue-600 font-medium disabled:text-gray-400"
        >
          Next ➡
        </button>
      </div>

      {/* Question Form */}
      <div className="question-form">
        <input
          type="text"
          placeholder="Enter question"
          value={newQuestion.questionText}
          onChange={(e) => handleInputChange(e, "questionText")}
        />
        {Object.keys(newQuestion.options).map((key) => (
          <input
            key={key}
            type="text"
            placeholder={`Option ${key}`}
            value={newQuestion.options[key]}
            onChange={(e) => handleInputChange(e, "options", key)}
          />
        ))}
        <select
          value={newQuestion.correctAnswer}
          onChange={(e) => handleInputChange(e, "correctAnswer")}
        >
          <option value="A">A</option>
          <option value="B">B</option>
          <option value="C">C</option>
          <option value="D">D</option>
        </select>
        <input
          type="text"
          placeholder="Explanation"
          value={newQuestion.explanation}
          onChange={(e) => handleInputChange(e, "explanation")}
        />
        <button
          onClick={addQuestion}
          disabled={
            (questions[selectedSubject.name] || []).length >= selectedSubject.limit
          }
        >
          Add Question
        </button>
      </div>

      {/* Questions Preview */}
      <div className="questions-container">
        <h2>{selectedSubject.name} Questions</h2>
        {questions[selectedSubject.name]?.map((q, index) => (
          <div key={index} className="question-card">
            <h3>
              {index + 1}. {q.questionText}
            </h3>
            <div className="options">
              {Object.entries(q.options).map(([key, option]) => (
                <p key={key} className={q.correctAnswer === key ? "correct" : ""}>
                  {key}. {option}
                </p>
              ))}
            </div>
            <p>
              <strong>Explanation:</strong> {q.explanation}
            </p>
          </div>
        ))}
      </div>

      {/* Submit Button */}
      {isSubmitVisible && (
        <button className="submit-button" onClick={handleSubmit}>
          Submit All Questions
        </button>
      )}
    </div>
  );
};

export default BCSExamAdmin;
