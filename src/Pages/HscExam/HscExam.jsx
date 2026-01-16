import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BookOpen, Users, Building2, Calendar, ArrowRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HscExamSelector = () => {
  const [selectedGroup, setSelectedGroup] = useState("");
  const [selectedBoard, setSelectedBoard] = useState("");
  const [examYear, setExamYear] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const groups = ["Science", "Business Studies", "Humanities"];
  const boards = [
    "Dhaka",
    "Chittagong",
    "Rajshahi",
    "Khulna",
    "Barisal",
    "Sylhet",
    "Dinajpur",
    "Mymensingh",
    "Jessore",
    "Comilla",
  ];

  const years = Array.from({ length: 2025 - 2010 + 1 }, (_, i) => 2025 - i);

  const handleProceed = () => {
    if (!examYear || !selectedGroup || !selectedBoard) {
      Swal.fire("Please select all fields before proceeding");
      return;
    }
    setLoading(true);
    fetch(
      `${BACKEND_URL}/hsc-questions/${examYear}/${encodeURIComponent(
        selectedBoard
      )}/${encodeURIComponent(selectedGroup)}`
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setLoading(false);
        if (data.success) {
          navigate("/exam/practice", {
            state: {
              examData: data.data,
              examType: "HSC",
              category: "full",
              title: `HSC ${selectedGroup} ${data.data.examYear} ${selectedBoard} Exam`,
              year: data.data.examYear,
              hscGroup: selectedGroup,
              hscBoard: selectedBoard,
            },
          });
          setSelectedGroup("");
          setSelectedBoard("");
          setExamYear("");
          setLoading(false);
        } else {
          setLoading(false);
          Swal.fire("Exam not found for the selected details");
        }
      })
      .catch((err) => {
        setLoading(false);
        Swal.fire(`Failed to load exam: ${err.message}`);
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black py-12 px-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-15 dark:opacity-5 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-15 dark:opacity-5 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-blue-100 dark:bg-gray-800 rounded-full mb-4 border border-blue-200 dark:border-gray-700">
            <BookOpen className="w-4 h-4 text-blue-600 dark:text-blue-400" />
            <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">
              HSC Examination
            </span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent">
              HSC All Questions
            </span>
          </h1>
          <p className="text-xl text-slate-600 dark:text-white max-w-2xl mx-auto">
            Select your group, board, and exam year to start practicing
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-slate-200 dark:border-gray-700">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl">
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-slate-800 dark:text-white">
              Select Exam Details
            </h2>
          </div>

          <div className="space-y-6">
            {/* Group Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
                  <Users className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-semibold text-slate-700 dark:text-white">
                  Choose a Group:
                </label>
              </div>
              <select
                className="block w-full border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-2xl p-4 text-slate-700 dark:text-white text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                value={selectedGroup}
                onChange={(e) => setSelectedGroup(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select a Group
                </option>
                {groups.map((group) => (
                  <option key={group} value={group}>
                    {group}
                  </option>
                ))}
              </select>
            </div>

            {/* Board Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
                  <Building2 className="w-5 h-5 text-white" />
                </div>
                <label className="text-lg font-semibold text-slate-700 dark:text-white">
                  Choose a Board:
                </label>
              </div>
              <select
                className="block w-full border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-2xl p-4 text-slate-700 dark:text-white text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                value={selectedBoard}
                onChange={(e) => setSelectedBoard(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select a Board
                </option>
                {boards.map((board) => (
                  <option key={board} value={board}>
                    {board}
                  </option>
                ))}
              </select>
            </div>

            {/* Year Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-white" />
                </div>
                <label
                  htmlFor="yearSelect"
                  className="text-lg font-semibold text-slate-700 dark:text-white"
                >
                  Select Exam Year:
                </label>
              </div>
              <select
                id="yearSelect"
                className="block w-full border-2 border-slate-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-2xl p-4 text-slate-700 dark:text-white text-lg focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 dark:focus:border-blue-400 transition-all duration-300"
                value={examYear}
                onChange={(e) => setExamYear(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select a Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>

            {/* Submit Button */}
            <button
              className="group relative w-full bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              onClick={handleProceed}
              disabled={!examYear || !selectedGroup || !selectedBoard || loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Loading..." : "Start Exam"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-blue-50 dark:bg-gray-800 rounded-xl border border-blue-100 dark:border-gray-700">
            <p className="text-sm text-slate-600 dark:text-white">
              <strong className="text-blue-600 dark:text-blue-400">Note:</strong> Select your group, board, and exam year to access the complete HSC question set for that specific examination.
            </p>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default HscExamSelector;
