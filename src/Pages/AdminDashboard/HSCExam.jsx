import React, { useState, useEffect } from "react";
import jsPDF from "jspdf";
import "./HSCExam.css";

const groups = {
  Science: [
    { name: "Bangla 1st Paper", limit: 1 },
    { name: "Bangla 2nd Paper", limit: 1 },
    { name: "English 1st Paper", limit: 1 },
    { name: "English 2nd Paper", limit: 1 },
    { name: "Higher Mathematics 1st Paper", limit: 1 },
    { name: "Higher Mathematics 2nd Paper", limit: 1 },
    { name: "Physics 1st Paper", limit: 1 },
    { name: "Physics 2nd Paper", limit: 1 },
    { name: "Chemistry 1st Paper", limit: 1 },
    { name: "Chemistry 2nd Paper", limit: 1 },
    { name: "Biology 1st Paper", limit: 1 },
    { name: "Biology 2nd Paper", limit: 1 },
    { name: "ICT", limit: 1 },
  ],
  "Business Studies": [
    { name: "Bangla 1st Paper", limit: 1 },
    { name: "Bangla 2nd Paper", limit: 1 },
    { name: "English 1st Paper", limit: 1 },
    { name: "English 2nd Paper", limit: 1 },
    { name: "ICT", limit: 1 },
    { name: "Accounting 1st Paper", limit: 1 },
    { name: "Accounting 2nd Paper", limit: 1 },
    { name: "Business Organization & Management 1st Paper", limit: 1 },
    { name: "Business Organization & Management 2nd Paper", limit: 1 },
    { name: "Finance, Banking & Insurance 1st Paper", limit: 1 },
    { name: "Finance, Banking & Insurance 2nd Paper", limit: 1 },
    { name: "Economics 1st Paper", limit: 1 },
    { name: "Economics 2nd Paper", limit: 1 },
  ],
  Humanities: [
    { name: "Bangla 1st Paper", limit: 1 },
    { name: "Bangla 2nd Paper", limit: 1 },
    { name: "English 1st Paper", limit: 1 },
    { name: "English 2nd Paper", limit: 1 },
    { name: "ICT", limit: 1 },
    { name: "Civics 1st Paper", limit: 1 },
    { name: "Civics 2nd Paper", limit: 1 },
    { name: "Economics 1st Paper", limit: 1 },
    { name: "Economics 2nd Paper", limit: 1 },
    { name: "History 1st Paper", limit: 1 },
    { name: "History 2nd Paper", limit: 1 },
    { name: "Geography 1st Paper", limit: 1 },
    { name: "Geography 2nd Paper", limit: 1 },
    { name: "Social Work 1st Paper", limit: 1 },
    { name: "Social Work 2nd Paper", limit: 1 },
    { name: "Logic 1st Paper", limit: 1 },
    { name: "Logic 2nd Paper", limit: 1 },
  ],
};

const HSCExamAdmin = () => {
  const [step, setStep] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState({});
  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    explanation: "",
  });

  const groupSubjects = groups[selectedGroup] || [];
  const selectedSubject = groupSubjects[selectedSubjectIndex];

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

    if (newQuestion.questionText === "") {
      alert("Please fill out the question.");
      return;
    }

    if (
      subjectQuestions.length >= selectedSubject.limit &&
      newQuestion.id === undefined
    ) {
      alert(
        `You can only add ${selectedSubject.limit} questions for ${selectedSubject.name}.`
      );
      return;
    }

    if (newQuestion.id !== undefined) {
      // If we are updating, find the question and update it
      const updatedQuestions = subjectQuestions.map((q, index) =>
        index === newQuestion.id ? { ...q, ...newQuestion } : q
      );
      setQuestions({
        ...questions,
        [selectedSubject.name]: updatedQuestions,
      });
      resetNewQuestion(); // Reset form after updating
    } else {
      // If we are adding a new question
      setQuestions({
        ...questions,
        [selectedSubject.name]: [...subjectQuestions, newQuestion],
      });
      resetNewQuestion(); // Reset form after adding
    }
  };

  const resetNewQuestion = () => {
    setNewQuestion({
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
    });
  };

  const editQuestion = (index) => {
    const questionToEdit = questions[selectedSubject.name][index];
    setNewQuestion({
      ...questionToEdit,
      id: index, // Add the index as a reference to update the question
    });
  };

  const deleteQuestion = (index) => {
    const updated = [...(questions[selectedSubject.name] || [])];
    updated.splice(index, 1);
    setQuestions({
      ...questions,
      [selectedSubject.name]: updated,
    });
  };

  const exportAsPDF = () => {
    const doc = new jsPDF();
    let y = 10;

    groupSubjects.forEach((subject) => {
      doc.text(`${subject.name} Questions:`, 10, y);
      y += 6;
      (questions[subject.name] || []).forEach((q, idx) => {
        doc.text(`${idx + 1}. ${q.questionText}`, 10, y);
        y += 6;
        Object.entries(q.options).forEach(([key, value]) => {
          doc.text(`${key}. ${value}`, 15, y);
          y += 6;
        });
        doc.text(`Explanation: ${q.explanation}`, 15, y);
        y += 10;
      });
      y += 6;
    });

    doc.save(`${selectedGroup}_${selectedBoard}_${selectedYear}.pdf`);
  };

  const handleSubmit = async () => {
    try {
      const response = await fetch(
        "http://localhost:5000/hsc-questions/savePrevHscQuestions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            group: selectedGroup,
            board: selectedBoard,
            examYear: parseInt(selectedYear),
            questions,
          }),
        }
      );

      const data = await response.json();
      if (response.ok) {
        alert(data.message);
        setQuestions({});
        setStep(1);
      } else {
        alert("Failed to submit questions.");
      }
    } catch (error) {
      alert("Error submitting questions.");
    }
  };

  const isSubmitVisible = groupSubjects.every(
    (subject) => (questions[subject.name] || []).length >= subject.limit
  );

  useEffect(() => {
    resetNewQuestion();
    setSelectedSubjectIndex(0);
    setQuestions({});
  }, [selectedGroup]);

  return (
    <div className="exam-container">
      <h1 className="text-2xl font-bold">HSC Exam - Admin Panel</h1>

      {step === 1 && (
        <div className="selection-panel text-xl font-bold">
          <div className="mt-6 p-1">
            <label>Group : </label>
            <select
              value={selectedGroup}
              onChange={(e) => setSelectedGroup(e.target.value)}
            >
              <option value="" disabled>
                Select Group
              </option>
              <option value="Science">Science</option>
              <option value="Business Studies">Business Studies</option>
              <option value="Humanities">Humanities</option>
            </select>
          </div>
          <div className="mt-6 p-1">
            <label>Board : </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
            >
              <option value="" disabled>
                Select Board
              </option>
              {[
                "Dhaka",
                "Chittagong",
                "Rajshahi",
                "Khulna",
                "Barisal",
                "Sylhet",
                "Comilla",
                "Jessore",
                "Mymensingh",
                "Dinajpur",
              ].map((board) => (
                <option key={board} value={board}>
                  {board}
                </option>
              ))}
            </select>
          </div>
          <div className="mt-6">
            <label htmlFor="year">Year : </label>
            <select
              id="year"
              className="w-[200px] p-1 border rounded-md shadow-sm"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              <option value="">Select Exam Year</option>
              {[...Array(2024 - 2010 + 1)].map((_, index) => {
                const year = 2024 - index;
                return (
                  <option key={year} value={year}>
                    {year}
                  </option>
                );
              })}
            </select>
          </div>
          <button
            className="mt-6 text-white w-1/2"
            onClick={() => {
              if (!selectedGroup || !selectedBoard || !selectedYear) {
                alert("Please fill all fields.");
              } else {
                setStep(2);
              }
            }}
          >
            Continue
          </button>
        </div>
      )}

      {step === 2 && (
        <>
          <div className="selected-info-summary text-center mb-4">
            <h2>
              Group: <span className="font-semibold">{selectedGroup}</span> |
              Board: <span className="font-semibold">{selectedBoard}</span> |
              Year: <span className="font-semibold">{selectedYear}</span>
            </h2>
          </div>

          <div className="subject-pagination flex justify-between items-center w-full">
            <button
              onClick={() =>
                setSelectedSubjectIndex(Math.max(selectedSubjectIndex - 1, 0))
              }
              disabled={selectedSubjectIndex === 0}
            >
              ⬅ Previous
            </button>
            <div className="flex-grow text-center">
              <span>{selectedSubject?.name}</span>
            </div>
            <button
              onClick={() =>
                setSelectedSubjectIndex(
                  Math.min(selectedSubjectIndex + 1, groupSubjects.length - 1)
                )
              }
              disabled={selectedSubjectIndex === groupSubjects.length - 1}
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
              {newQuestion.id !== undefined
                ? "Update Question"
                : "Add Question"}
            </button>
          </div>

          <div className="questions-container">
            <h2>{selectedSubject.name} Questions</h2>
            {(questions[selectedSubject.name] || []).map((q, index) => (
              <div key={index} className="question-card">
                <h3>
                  {index + 1}. {q.questionText}
                </h3>
                <div className="options">
                  {Object.entries(q.options).map(([key, option]) => (
                    <p
                      key={key}
                      className={q.correctAnswer === key ? "correct" : ""}
                    >
                      {key}. {option}
                    </p>
                  ))}
                </div>
                <p>
                  <strong>Explanation:</strong> {q.explanation}
                </p>
                <div className="mt-2 flex gap-4">
                  <button
                    className="text-blue-600"
                    onClick={() => editQuestion(index)}
                  >
                    Edit
                  </button>
                  <button
                    className="text-red-500"
                    onClick={() => deleteQuestion(index)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {isSubmitVisible && (
            <>
              <button className="submit-btn" onClick={exportAsPDF}>
                Export to PDF
              </button>
              <button className="submit-btn" onClick={handleSubmit}>
                Submit Questions
              </button>
            </>
          )}
        </>
      )}
    </div>
  );
};

export default HSCExamAdmin;
