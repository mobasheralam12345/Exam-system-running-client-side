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
  { name: "ICT", limit: 1},
];

const BCSExamAdmin = () => {
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
    // const bcsYear = localStorage.getItem("bcsYear");
    const bcsYear = 35;
    if (!bcsYear) {
      alert("BCS Year is missing. Please set the BCS year in settings.");
      return;
    }
  
    try {
      const response = await fetch("http://localhost:5000/api/questions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          bcsYear: parseInt(bcsYear),
          questions
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
  

  return (
    <div className="exam-container">
      <h1>BCS Exam - Admin Panel</h1>
      
      {/* Subject Pagination */}
      <div className="subject-pagination">
        <button
          onClick={() => setSelectedSubjectIndex(Math.max(selectedSubjectIndex - 1, 0))}
          disabled={selectedSubjectIndex === 0}
        >
          ⬅ Previous
        </button>
        <span>{selectedSubject.name}</span>
        <button
          onClick={() =>
            setSelectedSubjectIndex(Math.min(selectedSubjectIndex + 1, subjects.length - 1))
          }
          disabled={selectedSubjectIndex === subjects.length - 1}
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
          disabled={(questions[selectedSubject.name] || []).length >= selectedSubject.limit}
        >
          Add Question
        </button>
      </div>

      {/* Questions List */}
      <div className="questions-container">
        <h2>{selectedSubject.name} Questions</h2>
        {questions[selectedSubject.name]?.map((q, index) => (
          <div key={index} className="question-card">
            <h3>{index + 1}. {q.questionText}</h3>
            <div className="options">
              {Object.entries(q.options).map(([key, option]) => (
                <p key={key} className={q.correctAnswer === key ? "correct" : ""}>
                  {key}. {option}
                </p>
              ))}
            </div>
            <p><strong>Explanation:</strong> {q.explanation}</p>
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
