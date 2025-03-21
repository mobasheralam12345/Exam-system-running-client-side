import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "../../Pages/StudentDashboard/StudentDashboard.css";

const HistoryTable = ({ title, history, activePage }) => {
    const columnConfig = {
      "Exam History": { header: "BCS Year", key: "bcsYear" },
    };
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
                    {item.bcsYear || "N/A"}
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

  export default HistoryTable;