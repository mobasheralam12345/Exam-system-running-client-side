import React, { useState, useEffect } from "react";
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

  const addQuestion = () => {
    const subjectQuestions = questions[selectedSubject.name] || [];
    if (subjectQuestions.length >= selectedSubject.limit) {
      alert(
        `You can only add ${selectedSubject.limit} questions for ${selectedSubject.name}.`
      );
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
        setStep(1); // Go back to selection screen
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
    setNewQuestion({
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
    });
    setSelectedSubjectIndex(0);
    setQuestions({});
  }, [selectedGroup]);

  return (
    <div className="exam-container">
      <h1 className="text-2xl font-bold">HSC Exam - Admin Panel</h1>

      {/* STEP 1: Selection Page */}
      {step === 1 && (
        <div className="selection-panel text-xl font-bold">
          <div className="mt-6 ">
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
          <div className="mt-6">
            <label>Board : </label>
            <select
              value={selectedBoard}
              onChange={(e) => setSelectedBoard(e.target.value)}
            >
              <option value="" disabled>
                Select Board
              </option>
              <option value="Dhaka">Dhaka</option>
              <option value="Chittagong">Chittagong</option>
              <option value="Rajshahi">Rajshahi</option>
              <option value="Khulna">Khulna</option>
              <option value="Barisal">Barisal</option>
              <option value="Sylhet">Sylhet</option>
              <option value="Comilla">Comilla</option>
              <option value="Jessore">Jessore</option>
              <option value="Mymensingh">Mymensingh</option>
              <option value="Dinajpur">Dinajpur</option>
            </select>
          </div>
          <div className="mt-6">
            <label>Year : </label>
            <select
              className="block w-full mt-1 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
              value={selectedYear}
              onChange={(e) => setSelectedYear(e.target.value)}
              required
            >
              <option value="">Select Exam Year</option>
              {Array.from({ length: 2024 - 2010 + 1 }, (_, i) => {
                const year = 2024 - i;
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

      {/* STEP 2: Question Creation Page */}
      {step === 2 && (
        <>
          {/* Selected Info Summary */}
          <div className="selected-info-summary text-center mb-4">
            <h2>
              Group: <span className="font-semibold">{selectedGroup}</span> |{" "}
              Board: <span className="font-semibold">{selectedBoard}</span> |{" "}
              Year: <span className="font-semibold">{selectedYear}</span>
            </h2>
          </div>

          {/* Subject Pagination */}
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
            <button onClick={addQuestion}>Add Question</button>
          </div>

          {/* Questions List */}
          <div className="questions-container">
            <h2>{selectedSubject.name} Questions</h2>
            {questions[selectedSubject.name]?.map((q, index) => (
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
              </div>
            ))}
          </div>

          {isSubmitVisible && (
            <button onClick={handleSubmit}>Submit All Questions</button>
          )}
        </>
      )}
    </div>
  );
};

export default HSCExamAdmin;
