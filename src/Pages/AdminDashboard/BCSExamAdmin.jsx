import React, { useState } from "react";
import jsPDF from "jspdf";
import "jspdf-autotable";
import "./BCSExam.css";

const subjects = [
  { name: "Bangla", limit: 4 },
  { name: "English", limit: 4 },
  { name: "Math", limit: 4 },
  { name: "GK", limit: 4 },
  { name: "বাংলাদেশ বিষয়াবলী", limit: 4 },
  { name: "বিশ্ব বিষয়াবলী", limit: 4 },
  { name: "মানসিক দক্ষতা", limit: 4 },
  { name: "ICT", limit: 4 },
];

const BCSExamAdmin = () => {
  const [step, setStep] = useState(1);
  const [bcsYear, setBcsYear] = useState("");
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState({});
  const [editingIndex, setEditingIndex] = useState(null);

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

  const addOrUpdateQuestion = () => {
    const subjectQuestions = questions[selectedSubject.name] || [];

    if (editingIndex !== null) {
      // Editing
      const updated = [...subjectQuestions];
      updated[editingIndex] = newQuestion;
      setQuestions({ ...questions, [selectedSubject.name]: updated });
      setEditingIndex(null);
    } else {
      // Adding
      if (subjectQuestions.length >= selectedSubject.limit) {
        alert(
          `Only ${selectedSubject.limit} questions allowed for ${selectedSubject.name}.`
        );
        return;
      }

      setQuestions({
        ...questions,
        [selectedSubject.name]: [...subjectQuestions, newQuestion],
      });
    }

    setNewQuestion({
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
    });
  };

  const handleEdit = (index) => {
    const q = questions[selectedSubject.name][index];
    setNewQuestion(q);
    setEditingIndex(index);
  };

  const handleDelete = (index) => {
    const updated = [...questions[selectedSubject.name]];
    updated.splice(index, 1);
    setQuestions({ ...questions, [selectedSubject.name]: updated });
  };

  const handleExportPDF = () => {
    const doc = new jsPDF();
    doc.setFontSize(16);
    doc.text(`${bcsYear}th BCS Questions`, 14, 20);

    let y = 30;

    subjects.forEach((subject) => {
      const subjectQuestions = questions[subject.name] || [];
      if (subjectQuestions.length > 0) {
        doc.setFontSize(14);
        doc.text(subject.name, 14, y);
        y += 6;

        subjectQuestions.forEach((q, index) => {
          doc.setFontSize(12);
          doc.text(`${index + 1}. ${q.questionText}`, 14, y);
          y += 6;

          Object.entries(q.options).forEach(([key, val]) => {
            doc.text(`${key}. ${val}`, 18, y);
            y += 5;
          });

          doc.text(`Correct: ${q.correctAnswer}`, 18, y);
          y += 5;
          doc.text(`Explanation: ${q.explanation}`, 18, y);
          y += 10;

          if (y > 270) {
            doc.addPage();
            y = 20;
          }
        });
      }
    });

    doc.save(`${bcsYear}_BCS_Questions.pdf`);
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

  if (step === 1) {
    return (
      <div className="flex flex-col items-center mt-32 z-1">
        <h1 className="text-4xl font-bold mb-4">Select BCS Year</h1>
        <select
          className="border text-xl px-4 py-2 rounded"
          value={bcsYear}
          onChange={(e) => setBcsYear(e.target.value)}
        >
          <option value="">Select a year</option>
          {[...Array(46)].map((_, index) => (
            <option key={index} value={index + 1}>
              {index + 1}th BCS
            </option>
          ))}
        </select>
        <button
          className="px-6 py-2 w-96 font-bold text-xl mt-8 bg-blue-500 text-white rounded"
          onClick={() =>
            bcsYear ? setStep(2) : alert("Please select a year.")
          }
        >
          Continue
        </button>
      </div>
    );
  }

  return (
    <div className="exam-containerr">
      <h1>BCS Exam - Admin Panel</h1>
      <div className="text-center mb-4 font-semibold text-blue-700">
        Year: {bcsYear}th BCS
      </div>

      <div className="subject-pagination flex justify-between items-center w-full">
        <button
          onClick={() =>
            setSelectedSubjectIndex(Math.max(selectedSubjectIndex - 1, 0))
          }
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
            setSelectedSubjectIndex(
              Math.min(selectedSubjectIndex + 1, subjects.length - 1)
            )
          }
          disabled={selectedSubjectIndex === subjects.length - 1}
          className="text-blue-600 font-medium disabled:text-gray-400"
        >
          Next ➡
        </button>
      </div>

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
        <button onClick={addOrUpdateQuestion}>
          {editingIndex !== null ? "Update Question" : "Add Question"}
        </button>
      </div>

      <div className="questions-container min-h-screen">
        <h2>{selectedSubject.name} Questions</h2>
        {questions[selectedSubject.name]?.map((q, index) => (
          <div
            key={index}
            className="question-card mb-4 p-4 border rounded shadow"
          >
            <h3>
              {index + 1}. {q.questionText}
            </h3>
            <div className="options">
              {Object.entries(q.options).map(([key, option]) => (
                <p
                  key={key}
                  className={
                    q.correctAnswer === key
                      ? "font-semibold text-green-600"
                      : ""
                  }
                >
                  {key}. {option}
                </p>
              ))}
            </div>
            <p className="text-sm text-gray-600 mt-2">
              <strong>Explanation:</strong> {q.explanation}
            </p>
            <div className="mt-2 flex gap-4">
              <button
                className="text-blue-600"
                onClick={() => handleEdit(index)}
              >
                Edit
              </button>
              <button
                className="text-red-500"
                onClick={() => handleDelete(index)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
      {selectedSubjectIndex === subjects.length - 1 && isSubmitVisible && (
        <div className="flex flex-col md:flex-row gap-4 mt-8 justify-center">
          <button
            className="submit-button bg-blue-600 text-white px-6 py-2 rounded font-semibold"
            onClick={handleSubmit}
          >
            Submit All Questions
          </button>
          <button
            className="bg-green-600 text-white px-6 py-2 rounded font-semibold"
            onClick={handleExportPDF}
          >
            Export as PDF
          </button>
        </div>
      )}
    </div>
  );
};

export default BCSExamAdmin;
