import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Award,
} from "lucide-react";

export default function ExamDeskHomepage() {
  const [isVisible, setIsVisible] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const features = [
    {
      icon: <BookOpen className="w-8 h-8" />,
      title: "BCS Preparation",
      description:
        "Comprehensive BCS exam preparation with updated syllabus and practice tests",
      color: "from-blue-500 to-indigo-600",
      hoverColor: "group-hover:from-blue-600 group-hover:to-indigo-700",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "HSC Excellence",
      description:
        "Complete HSC exam solutions with subject-wise practice and mock tests",
      color: "from-blue-500 to-indigo-600",
      hoverColor: "group-hover:from-blue-600 group-hover:to-indigo-700",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Bank Job Prep",
      description:
        "Specialized banking exam preparation with real-time practice sessions",
      color: "from-blue-500 to-indigo-600",
      hoverColor: "group-hover:from-blue-600 group-hover:to-indigo-700",
    },
  ];

  const stats = [
    {
      number: "1000+",
      label: "Active Students",
      icon: <Users className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      number: "100+",
      label: "Practice Questions",
      icon: <BookOpen className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      number: "50+",
      label: "Live Exams",
      icon: <Clock className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Trophy className="w-6 h-6" />,
      color: "from-blue-500 to-indigo-600",
    },
  ];

  const testimonials = [
    {
      name: "Rashida Khan",
      role: "BCS Cadre",
      text: "ExamDesk BD helped me achieve my dream of becoming a BCS officer. The practice tests were incredibly helpful!",
      rating: 5,
    },
    {
      name: "Mohammad Ali",
      role: "Bank Officer",
      text: "The banking exam preparation module is outstanding. I cleared my exam on the first attempt!",
      rating: 5,
    },
    {
      name: "Fatima Ahmed",
      role: "HSC Graduate",
      text: "Thanks to ExamDesk BD, I scored excellent marks in my HSC exams. Highly recommended!",
      rating: 5,
    },
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-black dark:via-gray-900 dark:to-black -mt-16 -ml-4 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 dark:bg-blue-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-15 dark:opacity-5 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 dark:bg-indigo-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-15 dark:opacity-5 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 dark:bg-teal-500/10 rounded-full mix-blend-multiply dark:mix-blend-lighten filter blur-xl opacity-15 dark:opacity-5 animate-blob animation-delay-4000"></div>
      </div>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div
              className={`transform transition-all duration-1000 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "-translate-x-20 opacity-0"
              }`}
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-full mb-6 border border-blue-200/50 dark:border-gray-700">
                <Sparkles className="w-4 h-4 text-blue-600 dark:text-white" />
                <span className="text-sm font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-white bg-clip-text text-transparent">
                  Your Success Partner
                </span>
              </div>
              
              <h1 className="text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent">
                  ExamDesk
                </span>
              </h1>
              
              <p className="text-xl lg:text-2xl mb-8 text-slate-700 dark:text-white leading-relaxed">
                Your gateway to success in{" "}
                <span className="font-bold text-blue-600 dark:text-white">BCS</span>,{" "}
                <span className="font-bold text-blue-600 dark:text-white">HSC</span>, and{" "}
                <span className="font-bold text-blue-600 dark:text-white">Banking</span> exams.
                Practice with confidence, excel with excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-blue-500/40 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free Practice
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-700 to-indigo-700 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                
                <button className="group px-8 py-4 border-2 border-blue-300 dark:border-gray-600 text-blue-700 dark:text-white rounded-2xl font-bold text-lg hover:bg-blue-50 dark:hover:bg-gray-800 transition-all duration-300 flex items-center justify-center gap-2 hover:border-blue-400 dark:hover:border-gray-500 hover:shadow-md">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-3 gap-4">
                <div className="flex items-center gap-2 text-sm">
                  <CheckCircle className="w-5 h-5 text-green-500 dark:text-white" />
                  <span className="text-slate-600 dark:text-white font-medium">Free Access</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Target className="w-5 h-5 text-blue-500 dark:text-white" />
                  <span className="text-slate-600 dark:text-white font-medium">Live Exams</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Award className="w-5 h-5 text-orange-500 dark:text-white" />
                  <span className="text-slate-600 dark:text-white font-medium">Certified</span>
                </div>
              </div>
            </div>

            {/* Right Content - Interactive Card */}
            <div
              className={`transform transition-all duration-1000 delay-300 ${
                isVisible
                  ? "translate-x-0 opacity-100"
                  : "translate-x-20 opacity-0"
              }`}
            >
              <div className="relative">
                <div className="bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-slate-200/50 dark:border-gray-700/50 hover:shadow-blue-500/10 dark:hover:shadow-blue-400/10 transition-all duration-500 hover:scale-105">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-white dark:to-white bg-clip-text text-transparent mb-2">
                      Quick Stats
                    </h3>
                    <p className="text-slate-600 dark:text-white font-medium">Our Achievement So Far</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center group hover:scale-110 transition-all duration-300 cursor-pointer"
                      >
                        <div className={`bg-gradient-to-r ${stat.color} w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-white shadow-lg group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300`}>
                          {stat.icon}
                        </div>
                        <div className="text-3xl font-bold bg-gradient-to-r from-slate-800 to-slate-600 dark:from-white dark:to-white bg-clip-text text-transparent mb-1">
                          {stat.number}
                        </div>
                        <div className="text-slate-600 dark:text-white text-sm font-medium">
                          {stat.label}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gradient-to-br from-white/50 to-purple-50/50 dark:from-gray-950/50 dark:to-black/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-gray-800 dark:to-gray-700 rounded-full mb-4 border border-blue-200/50 dark:border-gray-700">
              <Sparkles className="w-4 h-4 text-blue-600 dark:text-white" />
              <span className="text-sm font-semibold text-blue-600 dark:text-white">
                Our Features
              </span>
            </div>
            <h2 className="text-5xl font-extrabold mb-4">
              Why Choose{" "}
              <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-white dark:via-gray-100 dark:to-gray-200 bg-clip-text text-transparent">
                ExamDesk?
              </span>
            </h2>
            <p className="text-xl text-slate-600 dark:text-white max-w-2xl mx-auto">
              Comprehensive exam preparation platform designed for students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group hover:scale-105 transition-all duration-500 cursor-pointer"
              >
                <div className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-lg rounded-3xl p-8 h-full border border-slate-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-600 transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2">
                  <div
                    className={`bg-gradient-to-r ${feature.color} ${feature.hoverColor} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-md`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-4 group-hover:text-blue-600 dark:group-hover:text-white transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 dark:text-white text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 dark:from-black/50 dark:to-gray-950/50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-slate-800 dark:text-white mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600 dark:text-white">
              Everything you need for exam success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group cursor-pointer p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:shadow-md">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    Previous Question Banks
                  </h3>
                  <p className="text-slate-600 dark:text-white text-lg">
                    Access thousands of previous exam questions with detailed
                    solutions and explanations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:shadow-md">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    Live Exams
                  </h3>
                  <p className="text-slate-600 dark:text-white text-lg">
                    Participate in real-time mock exams with instant results and
                    performance analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer p-4 rounded-2xl hover:bg-white/80 dark:hover:bg-gray-900/80 transition-all duration-300 hover:shadow-md">
                <div className="bg-gradient-to-r from-blue-500 to-indigo-600 p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-white transition-colors">
                    Performance Tracking
                  </h3>
                  <p className="text-slate-600 dark:text-white text-lg">
                    Monitor your progress with detailed analytics and
                    personalized study recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-center">
                  <div className="bg-blue-100 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 hover:rotate-12 transition-transform duration-300">
                    <CheckCircle className="w-10 h-10 text-blue-600" />
                  </div>
                  <h3 className="text-3xl font-bold text-gray-900 mb-4">
                    Ready to Excel?
                  </h3>
                  <p className="text-gray-700 mb-6 text-lg">
                    Join thousands of successful students today
                  </p>
                  <button className="bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-slate-800 via-blue-900 to-indigo-900 dark:from-black dark:via-gray-900 dark:to-black relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-15 dark:opacity-5">
          <div className="absolute top-0 left-0 w-96 h-96 bg-blue-500 dark:bg-blue-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-500 dark:bg-indigo-500/30 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-white mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-blue-200 dark:text-white">
              What our students say about ExamDesk
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 dark:bg-gray-900/50 backdrop-blur-xl rounded-3xl p-12 border border-white/20 dark:border-gray-700 text-center transition-all duration-500 hover:bg-white/15 dark:hover:bg-gray-900/70 hover:scale-105 shadow-xl">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map(
                  (_, i) => (
                    <Star
                      key={i}
                      className="w-8 h-8 text-yellow-400 fill-current animate-pulse"
                      style={{ animationDelay: `${i * 100}ms` }}
                    />
                  )
                )}
              </div>
              <blockquote className="text-2xl text-white mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <div className="text-xl font-bold text-white">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-cyan-300 dark:text-white font-medium">
                  {testimonials[currentTestimonial].role}
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial
                      ? "bg-gradient-to-r from-blue-500 to-indigo-500 w-12"
                      : "bg-white/30 w-3 hover:bg-white/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 dark:from-gray-900 dark:via-black dark:to-gray-900 relative overflow-hidden">
        {/* Animated elements */}
        <div className="absolute inset-0 opacity-15 dark:opacity-5">
          <div className="absolute top-10 left-10 w-64 h-64 bg-white dark:bg-white/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-white dark:bg-white/20 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-extrabold text-white mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 dark:text-white mb-8 max-w-2xl mx-auto">
            Join ExamDesk today and take the first step towards your dream
            career
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-10 py-4 bg-white text-blue-600 rounded-2xl font-bold text-lg hover:bg-blue-50 transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden">
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-blue-50 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="group px-10 py-4 border-2 border-white text-white rounded-2xl font-bold text-lg hover:bg-white/10 transition-all duration-300 backdrop-blur-sm hover:scale-105 shadow-lg">
              Learn More
            </button>
          </div>
        </div>
      </section>

      {/* Add custom animations */}
      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
