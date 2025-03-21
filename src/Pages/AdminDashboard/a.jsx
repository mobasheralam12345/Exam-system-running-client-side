import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../Pages/StudentDashboard/StudentDashboard.css";

const AdminDashboard = () => {
  const [activePage, setActivePage] = useState("Home");
  const [selectedYear, setSelectedYear] = useState("");
  const [examHistory, setExamHistory] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [questions, setQuestions] = useState([
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
    { question: "", options: ["", "", "", ""], answer: "" },
  ]);
  const [isYearSelected, setIsYearSelected] = useState(false);

  const handleYearSelection = (e) => {
    setSelectedYear(e.target.value);
  };

  // Fetch general exam history
  useEffect(() => {
    if (activePage === "Exam History") {
      const fetchExamHistory = async () => {
        setLoading(true);
        try {
          const response = await fetch(
            "http://localhost:5000/bcs-questions/get-result-history"
          );
          if (!response.ok) throw new Error("Failed to fetch exam history");
          const data = await response.json();
          const allHistories = data.data.reduce(
            (acc, record) => acc.concat(record.history),
            []
          );
          setExamHistory(allHistories);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchExamHistory();
    }
  }, [activePage]);

  const proceedToForm = () => {
    if (!selectedYear) {
      Swal.fire("Please select a year to proceed.");
      return;
    }
    setIsYearSelected(true);
  };

  const handleInputChange = (e, index, field, optionIndex) => {
    const { value } = e.target;
    const updatedQuestions = [...questions];
    if (field === "options") {
      updatedQuestions[index].options[optionIndex] = value; // Update the specific option
    } else {
      updatedQuestions[index][field] = value;
    }
    setQuestions(updatedQuestions);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Swal.fire(
      `${
        activePage === "Create BCS Questions" ? "BCS" : "HSC"
      } Questions for ${selectedYear} submitted successfully!`
    );
    setQuestions([
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" },
      { question: "", options: ["", "", "", ""], answer: "" }
    ]);
    setIsYearSelected(false); // Reset year selection
  };

  const renderYearSelection = () => (
    <div className="year-selection">
      <h2 className="text-xl text-center mt-6">Select Year</h2>
      <div className="flex justify-center items-center mt-4">
        <select
          className="border px-8 py-4 mr-4"
          value={selectedYear}
          onChange={handleYearSelection}
        >
          <option className="w-full" value="">
            Select a Year
          </option>
          {Array.from({ length: 16 }, (_, i) => {
            const year = 30 + i;
            return (
              <option key={year} value={year}>
                {year}
              </option>
            );
          })}
        </select>
        <button
          onClick={proceedToForm}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Proceed
        </button>
      </div>
    </div>
  );

  const renderQuestionForm = () => (
    <div className="question-form">
      <h2 className="text-xl text-center mt-6">
        Create {activePage === "Create BCS Questions" ? "BCS" : "HSC"} Questions
        for {selectedYear}
      </h2>
      <form onSubmit={handleSubmit} className="p-4 max-w-3xl mx-auto">
        {questions.map((questionItem, index) => (
          <div key={index} className="question-block mb-6">
            <h3 className="text-xl font-bold">Question {index + 1} :</h3>

            {/* Input for question */}
            <div className="mb-4">
              <input
                type="text"
                className="w-full border px-4 py-2"
                placeholder="Enter question"
                value={questionItem.question}
                onChange={(e) => handleInputChange(e, index, "question")}
              />
            </div>

            {/* Input fields for options */}
            <div className="mb-4">
              <label className="block text-lg font-medium mb-2">Options:</label>
              {questionItem.options.map((option, optionIndex) => (
                <div key={optionIndex} className="mb-2">
                  <input
                    type="text"
                    className="w-full border px-4 py-2"
                    placeholder={`Option ${optionIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleInputChange(e, index, "options", optionIndex)
                    }
                  />
                </div>
              ))}
            </div>

            {/* Input for answer */}
            <div className="mb-4">
              <label
                htmlFor={`answer-${index}`}
                className="block text-lg font-medium mb-2"
              >
                Answer:
              </label>
              <input
                type="text"
                id={`answer-${index}`}
                className="w-full border px-4 py-2"
                placeholder="Enter correct answer"
                value={questionItem.answer}
                onChange={(e) => handleInputChange(e, index, "answer")}
              />
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        >
          Submit
        </button>
      </form>
    </div>
  );

  const renderContent = () => {
    if (activePage === "Home") {
      return (
        <h2 className="text-xl text-center mt-6">
          Welcome to the Admin Dashboard!
        </h2>
      );
    }

    if (
      activePage === "Create BCS Questions" ||
      activePage === "Create HSC Questions"
    ) {
      return isYearSelected ? renderQuestionForm() : renderYearSelection();
    }

    if (activePage === "Exam History") {
      if (loading)
        return <h2 className="text-center">Loading exam history...</h2>;
      if (error)
        return <h2 className="text-center text-red-500">Error: {error}</h2>;
      return (
        <HistoryTable
          title="Exam History"
          history={examHistory}
          activePage={activePage}
        />
      );
    }

    return null;
  };

  return (
    <div className="dashboard">
      <nav className="sidebar">
        <ul>
          <li
            className="text-white text-xl"
            onClick={() => setActivePage("Home")}
          >
            Home
          </li>
          <li
            className="text-white text-xl"
            onClick={() => {
              setActivePage("Create BCS Questions");
              setIsYearSelected(false); // Reset year selection
            }}
          >
            Create BCS Questions
          </li>
          <li
            className="text-white text-xl"
            onClick={() => {
              setActivePage("Create HSC Questions");
              setIsYearSelected(false); // Reset year selection
            }}
          >
            Create HSC Questions
          </li>
          <li
            className="text-white text-xl"
            onClick={() => setActivePage("Exam History")}
          >
            Exam History
          </li>
        </ul>
      </nav>
      <main className="content">{renderContent()}</main>
    </div>
  );
};

const HistoryTable = ({ title, history, activePage }) => {
  // Map column headers and keys based on the active page
  const columnConfig = {
    "Exam History": { header: "BCS Year", key: "bcsYear" },
    "Subject Wise Exam History": { header: "Subject Name", key: "subjectName" },
    "HSC Exam History": { header: "Department", key: "department" },
    "HSC Subject Wise History": { header: "Subject Name", key: "subjectName" },
  };

  localStorage.getItem('')
  const { header } = columnConfig[activePage] || {};

  return (
    <div>
      <h2 className="text-xl mb-4 text-center">{title}</h2>
      <table className="table-auto w-full border-collapse border border-gray-200 py-4">
        <thead>
          <tr>
            <th className="border px-4 py-2">{header}</th>
            <th className="border px-4 py-2">Total Marks</th>
            <th className="border px-4 py-2">Achieved Marks</th>
            <th className="border px-4 py-2">Incorrect Answers</th>
            <th className="border px-4 py-2">Skipped Answers</th>
          </tr>
        </thead>
        <tbody>
          {history.length === 0 ? (
            <tr>
              <td colSpan="5" className="border px-4 py-2 text-center">
                No history found.
              </td>
            </tr>
          ) : (
            history.map((item, index) => (
              <tr key={index}>
                <td className="border px-4 py-2">
                  {item.bcsSubject ||
                    item.department ||
                    item.hscSubject ||
                    item.bcsYear ||
                    "N/A"}
                </td>
                <td className="border px-4 py-2">{item.totalMarks}</td>
                <td className="border px-4 py-2">{item.correctAnswers}</td>
                <td className="border px-4 py-2">{item.incorrectAnswers}</td>
                <td className="border px-4 py-2">{item.skippedAnswers}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AdminDashboard;
