import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import { BookOpen, Hash, ArrowRight } from "lucide-react";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const HscSubjectWiseExam = () => {
  const [selectedSubject, setSelectedSubject] = useState("");
  const [totalQuestions, setTotalQuestions] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const navigate = useNavigate();

  // Auto redirect to homepage after 10 minutes of inactivity
  useEffect(() => {
    let timer;
    if (!isLoading && !selectedSubject && !totalQuestions) {
      timer = setTimeout(() => {
        navigate("/");
      }, 10 * 60 * 1000); // 10 minutes
    }
    return () => clearTimeout(timer);
  }, [isLoading, selectedSubject, totalQuestions, navigate]);

  const handleSubjectChange = (e) => {
    setSelectedSubject(e.target.value);
  };

  const handleQuestionsChange = (e) => {
    setTotalQuestions(e.target.value);
  };

  const handleProceed = async () => {
    const numQuestions = parseInt(totalQuestions, 10);
    if (!selectedSubject || isNaN(numQuestions) || numQuestions <= 0) {
      Swal.fire(
        "Please select a subject and enter a valid number of questions before proceeding"
      );
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(
        `${BACKEND_URL}/hsc-questions/subject/${encodeURIComponent(
          selectedSubject
        )}/${numQuestions}`
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to fetch questions");
      }

      const res = await response.json();
      const examData = res.data;

      // Reset selectors
      setSelectedSubject("");
      setTotalQuestions("");
      setIsLoading(false);

      // Pass examData to practice page
      navigate("/exam/practice", {
        state: {
          examData,
          examType: "HSC",
          category: "subject-wise",
          title: `HSC ${selectedSubject} Exam`,
        },
      });
    } catch (err) {
      setIsLoading(false);
      Swal.fire("Error", err.message, "error");
    }
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
              HSC Subject-wise Exam
            </span>
          </div>
          <h1 className="text-5xl font-extrabold mb-4">
            <span className="text-foreground">
              Practice by Subject
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Choose your HSC subject and customize the number of questions
          </p>
        </div>

        {/* Main Card */}
        <div className="bg-card backdrop-blur-xl rounded-3xl p-8 md:p-12 shadow-2xl border border-border">
          <div className="flex items-center gap-3 mb-8">
            <div className="bg-accent p-3 rounded-2xl">
              <BookOpen className="w-6 h-6 text-accent-foreground" />
            </div>
            <h2 className="text-3xl font-bold text-foreground">
              Start Exam
            </h2>
          </div>

          <div className="space-y-6">
            {/* Subject Selection */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-accent p-2 rounded-xl">
                  <BookOpen className="w-5 h-5 text-accent-foreground" />
                </div>
                <label
                  htmlFor="subject"
                  className="text-lg font-semibold text-foreground"
                >
                  Choose a Subject:
                </label>
              </div>
              <select
                id="subject"
                className="block w-full border-2 border-input bg-card rounded-2xl p-4 text-foreground text-lg focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300"
                value={selectedSubject}
                onChange={handleSubjectChange}
                disabled={isLoading}
              >
                <option value="">Select Subject</option>
                <option value="বাংলা ১ম পত্র">Bangla 1st Paper</option>
                <option value="বাংলা ২য় পত্র">Bangla 2nd Paper</option>
                <option value="English 1st Paper">English 1st Paper</option>
                <option value="English 2nd Paper">English 2nd Paper</option>
                <option value="ICT">ICT</option>
                <option value="Higher Mathematics 1st Paper">
                  Higher Mathematics 1st Paper
                </option>
                <option value="Higher Mathematics 2nd Paper">
                  Higher Mathematics 2nd Paper
                </option>
                <option value="Physics 1st Paper">Physics 1st Paper</option>
                <option value="Physics 2nd Paper">Physics 2nd Paper</option>
                <option value="Chemistry 1st Paper">Chemistry 1st Paper</option>
                <option value="Chemistry 2nd Paper">Chemistry 2nd Paper</option>
                <option value="Biology 1st Paper">Biology 1st Paper</option>
                <option value="Biology 2nd Paper">Biology 2nd Paper</option>
                <option value="Accounting 1st Paper">Accounting 1st Paper</option>
                <option value="Accounting 2nd Paper">Accounting 2nd Paper</option>
                <option value="Business Organization & Management 1st Paper">
                  Business Organization & Management 1st Paper
                </option>
                <option value="Business Organization & Management 2nd Paper">
                  Business Organization & Management 2nd Paper
                </option>
                <option value="Finance, Banking & Insurance 1st Paper">
                  Finance, Banking & Insurance 1st Paper
                </option>
                <option value="Finance, Banking & Insurance 2nd Paper">
                  Finance, Banking & Insurance 2nd Paper
                </option>
                <option value="Economics 1st Paper">Economics 1st Paper</option>
                <option value="Economics 2nd Paper">Economics 2nd Paper</option>
                <option value="Civics 1st Paper">Civics 1st Paper</option>
                <option value="Civics 2nd Paper">Civics 2nd Paper</option>
                <option value="History 1st Paper">History 1st Paper</option>
                <option value="History 2nd Paper">History 2nd Paper</option>
                <option value="Geography 1st Paper">Geography 1st Paper</option>
                <option value="Geography 2nd Paper">Geography 2nd Paper</option>
                <option value="Social Work 1st Paper">Social Work 1st Paper</option>
                <option value="Social Work 2nd Paper">Social Work 2nd Paper</option>
                <option value="Logic 1st Paper">Logic 1st Paper</option>
                <option value="Logic 2nd Paper">Logic 2nd Paper</option>
              </select>
            </div>

            {/* Total Questions */}
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="bg-accent p-2 rounded-xl">
                  <Hash className="w-5 h-5 text-accent-foreground" />
                </div>
                <label
                  htmlFor="totalQuestions"
                  className="text-lg font-semibold text-foreground"
                >
                  Total Questions:
                </label>
              </div>
              <input
                type="number"
                id="totalQuestions"
                className="block w-full border-2 border-input bg-card rounded-2xl p-4 text-foreground text-lg focus:ring-4 focus:ring-accent/20 focus:border-accent transition-all duration-300"
                value={totalQuestions}
                placeholder="Enter a Number from 1 to 100"
                onChange={handleQuestionsChange}
                min="1"
                disabled={isLoading}
              />
            </div>

            {/* Submit Button */}
            <button
              className="group relative w-full bg-accent text-accent-foreground px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-accent/40 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 overflow-hidden"
              onClick={handleProceed}
              disabled={isLoading}
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {isLoading ? (
                  <>
                    <svg
                      className="animate-spin -ml-1 mr-3 h-6 w-6 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Loading...
                  </>
                ) : (
                  <>
                    Start Exam
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
              <div className="absolute inset-0 bg-accent/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
          </div>

          {/* Info Box */}
          <div className="mt-8 p-4 bg-emerald-50 rounded-xl border border-emerald-100">
            <p className="text-sm text-muted-foreground">
              <strong className="text-accent">Note:</strong> Select your HSC subject and specify how many questions you want to practice. Questions will be randomly selected from the chosen subject.
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

export default HscSubjectWiseExam;
