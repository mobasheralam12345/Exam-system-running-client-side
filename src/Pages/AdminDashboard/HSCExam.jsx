import React, { useState, useEffect } from "react";
import "./HSCExam.css";

// Define available groups and their subjects
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
  const [selectedGroup, setSelectedGroup] = useState("Science");
  const [selectedBoard, setSelectedBoard] = useState("Dhaka");

  const [selectedYear, setSelectedYear] = useState("2024");

  const [selectedSubjectIndex, setSelectedSubjectIndex] = useState(0);
  const [questions, setQuestions] = useState({});

  const [newQuestion, setNewQuestion] = useState({
    questionText: "",
    options: { A: "", B: "", C: "", D: "" },
    correctAnswer: "A",
    explanation: "",
  });

  const groupSubjects = groups[selectedGroup]; // Get subjects based on selected group
  const selectedSubject = groupSubjects[selectedSubjectIndex];

  // Handle input change for the question fields
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

  // Add a new question to the selected subject
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

  useEffect(() => {
    setSelectedSubjectIndex(0); // Start from the first subject whenever the group changes
  }, [selectedGroup]);

  const isSubmitVisible = groupSubjects.every(
    (subject) => (questions[subject.name] || []).length >= subject.limit
  );

  // Submit questions to the backend
  const handleSubmit = async () => {
    const hscYear = selectedYear;
    if (!hscYear) {
      alert("HSC Year is missing. Please set the HSC year in settings.");
      return;
    }

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
      } else {
        alert("Failed to submit questions.");
      }
    } catch (error) {
      alert("Error submitting questions.");
    }
  };

  // Reset the question form when the group changes
  useEffect(() => {
    setNewQuestion({
      questionText: "",
      options: { A: "", B: "", C: "", D: "" },
      correctAnswer: "A",
      explanation: "",
    });
    setSelectedSubjectIndex(0); // Start from the first subject whenever the group changes
    setQuestions({}); // Reset the questions list
  }, [selectedGroup]);

  return (
    <div className="exam-container">
      <h1>HSC Exam - Admin Panel</h1>

      {/* Group, Board, and Year Selection */}
      <div className="selection-panel">
        <div>
          <label>Group: </label>
          <select
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="Science">Science</option>
            <option value="Business Studies">Business Studies</option>
            <option value="Humanities">Humanities</option>
          </select>
        </div>
        <div>
          <label>Board: </label>
          <select
            value={selectedBoard}
            onChange={(e) => setSelectedBoard(e.target.value)}
          >
            <option value="" disabled selected>
              Select a Board
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
        <div>
          <label>Year: </label>
          <select
            value={selectedYear}
            onChange={(e) => setSelectedYear(e.target.value)}
          >
            <option value="2024">2024</option>
            <option value="2023">2023</option>
            <option value="2022">2022</option>
            <option value="2021">2021</option>
            <option value="2020">2020</option>
            <option value="2019">2019</option>
            <option value="2018">2018</option>
            <option value="2017">2017</option>
            <option value="2016">2016</option>
            <option value="2015">2015</option>
            <option value="2014">2014</option>
            <option value="2013">2013</option>
            <option value="2012">2012</option>
            <option value="2011">2011</option>
            <option value="2010">2010</option>
          </select>
        </div>
      </div>

      {/* Subject Pagination */}
      <div className="subject-pagination">
        <button
          onClick={() =>
            setSelectedSubjectIndex(Math.max(selectedSubjectIndex - 1, 0))
          }
          disabled={selectedSubjectIndex === 0}
        >
          ⬅ Previous
        </button>
        <span>{selectedSubject.name}</span>
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
        <button
          onClick={addQuestion}
          disabled={
            (questions[selectedSubject.name] || []).length >=
            selectedSubject.limit
          }
        >
          Add Question
        </button>
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

      {/* Submit Button */}
      {isSubmitVisible && (
        <button onClick={handleSubmit}>Submit All Questions</button>
      )}
    </div>
  );
};

export default HSCExamAdmin;
