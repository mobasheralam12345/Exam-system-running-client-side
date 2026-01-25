// components/DemoExamBanner.jsx

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Clock,
  Play,
  Sparkles,
  Trophy,
  Users,
  ArrowRight,
} from "lucide-react";
import {
  getCurrentDemoExam,
  getNextDemoExamTime,
  registerForDemoExam,
} from "../services/demoExamService";

export default function DemoExamBanner() {
  const navigate = useNavigate();
  const [demoExam, setDemoExam] = useState(null);
  const [nextExamTime, setNextExamTime] = useState(null);
  const [countdown, setCountdown] = useState(null);
  const [registeredCountdown, setRegisteredCountdown] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isRegistered, setIsRegistered] = useState(false);
  const [registering, setRegistering] = useState(false);

  // Fetch current demo exam
  const fetchDemoExam = async () => {
    try {
      const response = await getCurrentDemoExam();
      if (response.success) {
        setDemoExam(response.data);
        setIsRegistered(response.isRegistered || false);
      } else {
        setDemoExam(null);
        // If no current exam, fetch next exam time
        fetchNextExamTime();
      }
    } catch (error) {
      console.error("Error fetching demo exam:", error);
      setDemoExam(null);
      fetchNextExamTime();
    } finally {
      setLoading(false);
    }
  };

  // Fetch next exam time
  const fetchNextExamTime = async () => {
    try {
      const response = await getNextDemoExamTime();
      if (response.success) {
        setNextExamTime(response.data);
      }
    } catch (error) {
      console.error("Error fetching next exam time:", error);
    }
  };

  // Handle registration
  const handleRegister = async () => {
    if (!demoExam) return;

    const token = localStorage.getItem("token");
    if (!token) {
      // Redirect to login
      navigate("/login", { state: { from: "/" } });
      return;
    }

    setRegistering(true);
    try {
      await registerForDemoExam(demoExam._id);
      setIsRegistered(true);
      // Don't navigate yet - just register
      // User will see countdown or enter button based on exam start time
    } catch (error) {
      console.error("Error registering for demo exam:", error);
      alert("Failed to register for demo exam. Please try again.");
    } finally {
      setRegistering(false);
    }
  };

  // Handle entering exam
  const handleEnterExam = () => {
    if (!demoExam) return;
    navigate(`/live-exam/${demoExam._id}`);
  };

  // Update countdown
  useEffect(() => {
    if (!nextExamTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const nextTime = new Date(nextExamTime.nextExamTime);
      const diff = nextTime - now;

      if (diff <= 0) {
        // Exam should be starting, refresh
        fetchDemoExam();
        setCountdown(null);
      } else {
        const minutes = Math.floor(diff / 60000);
        const seconds = Math.floor((diff % 60000) / 1000);
        setCountdown({ minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [nextExamTime]);

  // Refresh demo exam every 30 seconds
  useEffect(() => {
    fetchDemoExam();
    const interval = setInterval(fetchDemoExam, 30000);
    return () => clearInterval(interval);
  }, []);

  // Update registered countdown (when user is registered but exam hasn't started)
  useEffect(() => {
    if (!demoExam || !isRegistered) return;

    const interval = setInterval(() => {
      const now = new Date();
      const start = new Date(demoExam.startTime);
      
      if (start <= now) {
        // Exam has started, refresh to show Enter button
        fetchDemoExam();
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [demoExam, isRegistered]);

  if (loading) {
    return (
      <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-6 md:p-8 text-center">
        <div className="animate-pulse">
          <div className="h-8 bg-emerald-200 rounded w-1/3 mx-auto mb-4"></div>
          <div className="h-4 bg-emerald-100 rounded w-2/3 mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-emerald-500 via-teal-500 to-cyan-500 rounded-3xl p-6 md:p-8 shadow-2xl relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0 opacity-20">
        <div className="absolute top-0 left-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-64 h-64 bg-white rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
      </div>

      <div className="relative z-10">
        {/* Header */}
        <div className="flex flex-col md:flex-row items-center justify-between mb-6">
          <div className="flex items-center gap-3 mb-4 md:mb-0">
            <div className="bg-white/20 backdrop-blur-sm p-3 rounded-2xl">
              <Sparkles className="w-8 h-8 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-2xl md:text-3xl font-bold text-white">
                  Try Demo Exam
                </h3>
                <span className="bg-yellow-400 text-yellow-900 text-xs font-bold px-3 py-1 rounded-full">
                  FREE
                </span>
              </div>
              <p className="text-white/90 text-sm md:text-base">
                Experience our platform with a live demo exam
              </p>
            </div>
          </div>

          {/* Stats */}
          <div className="flex gap-4">
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
              <Clock className="w-5 h-5 text-white mx-auto mb-1" />
              <div className="text-white font-bold text-sm">5 min</div>
            </div>
            <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-center">
              <Trophy className="w-5 h-5 text-white mx-auto mb-1" />
              <div className="text-white font-bold text-sm">20 Qs</div>
            </div>
          </div>
        </div>

        {/* Content */}
        {demoExam ? (
          // Active demo exam - no registration needed
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="bg-green-400 w-3 h-3 rounded-full animate-pulse"></div>
                <div>
                  <p className="text-white font-semibold text-lg">
                    Demo Exam is Live Now!
                  </p>
                  <p className="text-white/80 text-sm">
                    Click below to start - no registration needed
                  </p>
                </div>
              </div>

              <button
                onClick={() => navigate(`/live-exam/${demoExam._id}`)}
                className="group relative px-8 py-4 bg-white text-emerald-600 rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                <Play className="w-5 h-5" />
                Enter Exam
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        ) : countdown ? (
          // Countdown to next exam
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20">
            <div className="text-center">
              <p className="text-white/90 text-sm mb-3">Next Demo Exam In:</p>
              <div className="flex items-center justify-center gap-4 mb-4">
                <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                  <div className="text-4xl font-bold text-white">
                    {countdown.minutes}
                  </div>
                  <div className="text-white/80 text-xs uppercase">Minutes</div>
                </div>
                <div className="text-3xl text-white font-bold">:</div>
                <div className="bg-white/20 backdrop-blur-sm px-6 py-4 rounded-xl">
                  <div className="text-4xl font-bold text-white">
                    {countdown.seconds.toString().padStart(2, "0")}
                  </div>
                  <div className="text-white/80 text-xs uppercase">Seconds</div>
                </div>
              </div>
              <p className="text-white/80 text-sm">
                A new demo exam starts automatically every 5 minutes
              </p>
            </div>
          </div>
        ) : (
          // Loading next exam time
          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20 text-center">
            <p className="text-white">Loading demo exam information...</p>
          </div>
        )}

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          <div className="flex items-center gap-3 text-white">
            <CheckCircle className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">No registration required</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Users className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Compete with others</span>
          </div>
          <div className="flex items-center gap-3 text-white">
            <Trophy className="w-5 h-5 flex-shrink-0" />
            <span className="text-sm">Instant results</span>
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

// Import CheckCircle from lucide-react at the top
import { CheckCircle } from "lucide-react";
