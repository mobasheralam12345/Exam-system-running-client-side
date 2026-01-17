import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import { BookOpen, Calendar, ArrowRight } from "lucide-react";

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
              BCS Examination
            </span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-foreground">
              BCS All Questions
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Select a BCS year and start practicing with comprehensive question sets
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent p-3 rounded-2xl">
              <Calendar className="w-6 h-6 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Select Exam Year
            </h2>
          </div>

          <div className="space-y-6">
            <div>
              <label
                htmlFor="yearSelect"
                className="block text-lg font-semibold text-foreground mb-3"
              >
                Choose a BCS Year:
              </label>
              <select
                id="yearSelect"
                className="block w-full border-2 border-input bg-card rounded-2xl p-4 text-foreground text-lg focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300"
                value={selectedYear}
                onChange={(e) => setSelectedYear(e.target.value)}
                disabled={loading}
              >
                <option value="" disabled>
                  Select a Year
                </option>
                {years.map((year) => (
                  <option key={year} value={year}>
                    {year}th BCS
                  </option>
                ))}
              </select>
            </div>

            <button
              className="group relative w-full bg-accent text-accent-foreground px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              onClick={handleProceed}
              disabled={!selectedYear || loading}
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
              <strong className="text-accent">Note:</strong> Select your desired BCS year from the dropdown above and click "Start Exam" to begin your practice session.
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

export default YearSelector;
