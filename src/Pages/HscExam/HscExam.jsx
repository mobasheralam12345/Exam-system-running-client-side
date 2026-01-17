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
    <div className="min-h-screen bg-background py-12 px-4">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-100 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
      </div>

      <div className="container mx-auto max-w-4xl relative z-10">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 rounded-full mb-4 border border-emerald-200">
            <BookOpen className="w-4 h-4 text-accent" />
            <span className="text-sm font-semibold text-accent">
              HSC Examination
            </span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-foreground">
              HSC All Questions
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select your group, board, and exam year to start practicing
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent p-3 rounded-2xl">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Select Exam Details
            </h2>
          </div>

          <div className="space-y-6">
            {/* Group Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-accent p-2 rounded-xl">
                  <Users className="w-5 h-5 text-accent-foreground" />
                </div>
                <label className="text-lg font-semibold text-foreground">
                  Choose a Group:
                </label>
              </div>
              <select
                className="block w-full border-2 border-input bg-card rounded-2xl p-4 text-foreground text-lg focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300"
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
                <div className="bg-accent p-2 rounded-xl">
                  <Building2 className="w-5 h-5 text-accent-foreground" />
                </div>
                <label className="text-lg font-semibold text-foreground">
                  Choose a Board:
                </label>
              </div>
              <select
                className="block w-full border-2 border-input bg-card rounded-2xl p-4 text-foreground text-lg focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300"
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
                <div className="bg-accent p-2 rounded-xl">
                  <Calendar className="w-5 h-5 text-accent-foreground" />
                </div>
                <label
                  htmlFor="yearSelect"
                  className="text-lg font-semibold text-foreground"
                >
                  Select Exam Year:
                </label>
              </div>
              <select
                id="yearSelect"
                className="block w-full border-2 border-input bg-card rounded-2xl p-4 text-foreground text-lg focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300"
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
              className="group relative w-full bg-accent text-accent-foreground px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              onClick={handleProceed}
              disabled={!examYear || !selectedGroup || !selectedBoard || loading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {loading ? "Loading..." : "Start Exam"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </span>
              <div className="absolute inset-0 bg-accent/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-muted-foreground">
              <strong className="text-accent">Note:</strong> Select your group, board, and exam year to access the complete HSC question set for that specific examination.
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
