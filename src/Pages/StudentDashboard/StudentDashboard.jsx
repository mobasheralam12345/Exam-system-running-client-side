import React, { useState, useEffect } from "react";
import "./StudentDashboard.css";

const StudentDashboard = () => {
  const [activePage, setActivePage] = useState("Home");
  const [examHistory, setExamHistory] = useState([]);
  const [subjectWiseHistory, setSubjectWiseHistory] = useState([]);
  const [hscExamHistory, setHscExamHistory] = useState([]);
  const [hscSubjectWiseHistory, setHscSubjectWiseHistory] = useState([]); // New state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  // Fetch subject-wise exam history
  useEffect(() => {
    if (activePage === "Subject Wise Exam History") {
      const fetchSubjectWiseHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            "http://localhost:5000/bcs-questions/get-subject-wise-history"
          );
          if (!response.ok)
            throw new Error("Failed to fetch subject wise exam history");
          const data = await response.json();
          setSubjectWiseHistory(data.data.flatMap((record) => record.history));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchSubjectWiseHistory();
    }
  }, [activePage]);

  // Fetch HSC exam history
  useEffect(() => {
    if (activePage === "HSC Exam History") {
      const fetchHscExamHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            "http://localhost:5000/hsc-questions/get-result-history"
          );
          if (!response.ok) throw new Error("Failed to fetch HSC exam history");
          const data = await response.json();
          setHscExamHistory(
            data.data.flatMap((record) => record.history)
          );
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchHscExamHistory();
    }
  }, [activePage]);

  // Fetch HSC subject-wise exam history
  useEffect(() => {
    if (activePage === "HSC Subject Wise History") {
      const fetchHscSubjectWiseHistory = async () => {
        setLoading(true);
        setError(null);
        try {
          const response = await fetch(
            "http://localhost:5000/hsc-questions/get-hsc-subjectWise-history"
          );
          if (!response.ok)
            throw new Error("Failed to fetch HSC subject wise history");
          const data = await response.json();
          setHscSubjectWiseHistory(
            data.data.flatMap((record) => record.history)
          );
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      fetchHscSubjectWiseHistory();
    }
  }, [activePage]);

  const renderContent = () => {
    if (activePage === "Home") {
      return (
        <h2 className="text-xl text-center mt-6">
          Welcome to the Student Dashboard! Here you can view your exam history.
        </h2>
      );
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

    if (activePage === "Subject Wise Exam History") {
      if (loading)
        return (
          <h2 className="text-center">Loading subject wise exam history...</h2>
        );
      if (error)
        return <h2 className="text-center text-red-500">Error: {error}</h2>;
      return (
        <HistoryTable
          title="Subject Wise Exam History"
          history={subjectWiseHistory}
          activePage={activePage}
        />
      );
    }

    if (activePage === "HSC Exam History") {
      if (loading)
        return <h2 className="text-center">Loading HSC exam history...</h2>;
      if (error)
        return <h2 className="text-center text-red-500">Error: {error}</h2>;
      return (
        <HistoryTable
          title="HSC Exam History"
          history={hscExamHistory}
          activePage={activePage}
        />
      );
    }

    if (activePage === "HSC Subject Wise History") {
      if (loading)
        return (
          <h2 className="text-center">Loading HSC subject wise history...</h2>
        );
      if (error)
        return <h2 className="text-center text-red-500">Error: {error}</h2>;
      return (
        <HistoryTable
          title="HSC Subject Wise History"
          history={hscSubjectWiseHistory}
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
            onClick={() => setActivePage("Exam History")}
          >
            Exam History
          </li>
          <li
            className="text-white text-xl"
            onClick={() => setActivePage("Subject Wise Exam History")}
          >
            Subject Wise Exam History
          </li>
          <li
            className="text-white text-xl"
            onClick={() => setActivePage("HSC Exam History")}
          >
            HSC Exam History
          </li>
          <li
            className="text-white text-xl"
            onClick={() => setActivePage("HSC Subject Wise History")}
          >
            HSC Subject Wise History
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

  const { header, key } = columnConfig[activePage] || {};

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
            history.map(
              (item, index) => (
                console.log(item),
                (
                  <tr key={index}>
                    <td className="border px-4 py-2">
                      {item.bcsSubject ||
                        item.department ||
                        item.hscSubject ||
                        item.bcsYear||
                        "N/A"}
                    </td>
                    <td className="border px-4 py-2">{item.totalMarks}</td>
                    <td className="border px-4 py-2">{item.correctAnswers}</td>
                    <td className="border px-4 py-2">
                      {item.incorrectAnswers}
                    </td>
                    <td className="border px-4 py-2">{item.skippedAnswers}</td>
                  </tr>
                )
              )
            )
          )}
        </tbody>
      </table>
    </div>
  );
};

export default StudentDashboard;
