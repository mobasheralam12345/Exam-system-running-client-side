// components/PracticeExamBanner.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Play,
  Sparkles,
  Trophy,
  Users,
  ArrowRight,
  CheckCircle,
  Calendar,
} from "lucide-react";
import {
  getCurrentPracticeExam,
  registerForPracticeExam,
} from "../services/practiceExamService";

export default function PracticeExamBanner() {
  const navigate = useNavigate();
  const [practiceExam, setPracticeExam] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Fetch current practice exam
  const fetchPracticeExam = async () => {
    try {
      const response = await getCurrentPracticeExam();
      if (response.success) {
        setPracticeExam(response.data);
        setIsRegistered(response.isRegistered || false);
      } else {
        setPracticeExam(null);
      }
    } catch (error) {
      console.error("Error fetching practice exam:", error);
      setPracticeExam(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!practiceExam) return;

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", { state: { from: "/" } });
      return;
    }

    setRegistering(true);
    try {
      await registerForPracticeExam(practiceExam._id);
      setIsRegistered(true);
    } catch (error) {
      console.error("Error registering for practice exam:", error);
      alert("Failed to register. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  // Handle entering exam
  const handleEnterExam = () => {
    if (!practiceExam) return;
    navigate(`/live-exam/${practiceExam._id}`);
  };

  // Update countdown
  useEffect(() => {
    if (!practiceExam) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(practiceExam.startTime);
      const diff = start - now;

      if (diff <= 0) {
        // Exam has started
        setCountdown(null);
        fetchPracticeExam(); // Refresh to show enter button
      } else {
        const days = Math.floor(diff / (24 * 60 * 60 * 1000));
        const hours = Math.floor((diff % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
        const minutes = Math.floor((diff % (60 * 60 * 1000)) / (60 * 1000));
        const seconds = Math.floor((diff % (60 * 1000)) / 1000);
        setCountdown({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [practiceExam]);

  // Refresh practice exam every 30 seconds
  useEffect(() => {
    fetchPracticeExam();
    const interval = setInterval(fetchPracticeExam, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 md:p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-purple-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-purple-100 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (!practiceExam) {
    return (
      <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-3xl p-6 md:p-8 text-center border-2 border-purple-200">
        <p className="text-purple-600 font-semibold">
          No practice exam available at the moment
        </p>
      </div>
    );
  }

  const examStarted = new Date(practiceExam.startTime) <= new Date();

  return (
    <div className="bg-gradient-to-br from-purple-500 via-pink-500 to-rose-500 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Animated background */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Calendar className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Practice Exam
                </h3>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  REGISTER
                </span>
              </div>
              <p className="text-white/90 text-sm md:text-base">
                Comprehensive exam - Registration required
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
              <Clock className="w-5 h-5 text-white mx-auto mb-1" />
              <div className="text-white font-bold text-sm">30 min</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
              <Trophy className="w-5 h-5 text-white mx-auto mb-1" />
              <div className="text-white font-bold text-sm">25 Qs</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
          {examStarted && isRegistered ? (
            // Exam started and user is registered
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    Practice Exam is Live!
                  </p>
                  <p className="text-white/80 text-sm">
                    Click below to enter the exam
                  </p>
                </div>
              </div>
              <button
                onClick={handleEnterExam}
                className="group relative px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Enter Exam
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          ) : countdown ? (
            // Countdown display
            <div>
              <div className="text-center mb-4">
                <p className="text-white/90 text-sm mb-2">
                  {isRegistered ? "You're Registered! Exam Starts In:" : "Exam Starts In:"}
                </p>
                <div className="flex items-center justify-center gap-2 md:gap-4 mb-4">
                  {countdown.days > 0 && (
                    <>
                      <div className="bg-white/20 backdrop-blur-sm px-3 md:px-6 py-2 md:py-4 rounded-xl">
                        <div className="text-2xl md:text-4xl font-bold text-white">
                          {countdown.days}
                        </div>
                        <div className="text-white/80 text-xs uppercase">Days</div>
                      </div>
                      <div className="text-2xl md:text-3xl text-white font-bold">:</div>
                    </>
                  )}
                  <div className="bg-white/20 backdrop-blur-sm px-3 md:px-6 py-2 md:py-4 rounded-xl">
                    <div className="text-2xl md:text-4xl font-bold text-white">
                      {countdown.hours.toString().padStart(2, "0")}
                    </div>
                    <div className="text-white/80 text-xs uppercase">Hours</div>
                  </div>
                  <div className="text-2xl md:text-3xl text-white font-bold">:</div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 md:px-6 py-2 md:py-4 rounded-xl">
                    <div className="text-2xl md:text-4xl font-bold text-white">
                      {countdown.minutes.toString().padStart(2, "0")}
                    </div>
                    <div className="text-white/80 text-xs uppercase">Minutes</div>
                  </div>
                  <div className="text-2xl md:text-3xl text-white font-bold">:</div>
                  <div className="bg-white/20 backdrop-blur-sm px-3 md:px-6 py-2 md:py-4 rounded-xl">
                    <div className="text-2xl md:text-4xl font-bold text-white">
                      {countdown.seconds.toString().padStart(2, "0")}
                    </div>
                    <div className="text-white/80 text-xs uppercase">Seconds</div>
                  </div>
                </div>
              </div>

              {!isRegistered && (
                <div className="text-center">
                  <button
                    onClick={handleRegister}
                    disabled={registering}
                    className="group relative px-8 py-4 bg-white text-purple-600 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 mx-auto"
                  >
                    {registering ? (
                      <>
                        <div className="w-5 h-5 border-2 border-purple-600 border-t-transparent rounded-full animate-spin"></div>
                        Registering...
                      </>
                    ) : (
                      <>
                        <Users className="w-5 h-5" />
                        Register Now
                      </>
                    )}
                  </button>
                  <p className="text-white/80 text-sm mt-3">
                    Registration required to participate
                  </p>
                </div>
              )}

              {isRegistered && (
                <div className="flex items-center justify-center gap-2 text-white">
                  <CheckCircle className="w-5 h-5 text-green-300" />
                  <span className="font-semibold">You're Registered!</span>
                </div>
              )}
            </div>
          ) : null}
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 text-white">
            <Users className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Registration required</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Trophy className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Comprehensive test</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Detailed results</span>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0%,
          100% {
            transform: translate(0, 0) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
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
}
