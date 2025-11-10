import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const YearSelector = () => {
  const [selectedYear, setSelectedYear] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const years = Array.from({ length: 50 }, (_, i) => 50 - i);

  const handleProceed = () => {
    if (!selectedYear) {
      Swal.fire("Please select a BCS year before proceeding");
      return;
    }
    setLoading(true);
    fetch(`${BACKEND_URL}/bcs-questions/${selectedYear}`)
      .then((res) => res.json())
      .then((data) => {
        setLoading(false);
        if (data.success) {
          navigate("/exam/practice", {
            state: {
              examData: data.data,
              examType: "BCS",
              category: "full",
              title: `${selectedYear} BCS Exam`,
              year: selectedYear,
            },
          });
          setSelectedYear("");
          setLoading(false);
        } else {
          Swal.fire("Exam not found for the selected year");
        }
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire(`Failed to load exam: ${err.message}`);
      });
  };

  return (
    <div className="container mx-auto my-4 px-10 py-10 bg-white shadow-lg rounded-lg w-3/5">
      <h2 className="text-4xl text-center font-bold text-gray-800 mb-4">
        Select a Year
      </h2>
      <div className="mt-4">
        <label
          htmlFor="yearSelect"
          className="text-xl font-semibold text-gray-700"
        >
          Choose a year:
        </label>
        <select
          id="yearSelect"
          className="block w-full mt-2 border border-gray-300 rounded-lg p-4 text-gray-700"
          value={selectedYear}
          onChange={(e) => setSelectedYear(e.target.value)}
          disabled={loading}
        >
          <option value="" disabled>
            Select a Year
          </option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}th Year
            </option>
          ))}
        </select>
      </div>
      <div className="mt-10 flex justify-center">
        <button
          className="bg-green-500 border mx-auto w-full border-green-500 text-white px-4 py-2 text-lg rounded-lg transition-colors hover:bg-green-600"
          onClick={handleProceed}
          disabled={!selectedYear || loading}
        >
          {loading ? "Loading..." : "Start Exam"}
        </button>
      </div>
    </div>
  );
};

export default YearSelector;
