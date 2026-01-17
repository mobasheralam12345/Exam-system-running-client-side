import { useState, useEffect } from "react";
import {
  BookOpen,
  Users,
  Trophy,
  Clock,
  CheckCircle,
  CheckCircle2,
  Star,
  ArrowRight,
  Play,
  Sparkles,
  Target,
  Award,
  GraduationCap,
  Building2,
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
      color: "from-emerald-500 to-teal-600",
      hoverColor: "group-hover:from-emerald-600 group-hover:to-teal-700",
    },
    {
      icon: <GraduationCap className="w-8 h-8" />,
      title: "HSC Excellence",
      description:
        "Complete HSC exam solutions with subject-wise practice and mock tests",
      color: "from-blue-500 to-indigo-600",
      hoverColor: "group-hover:from-blue-600 group-hover:to-indigo-700",
    },
    {
      icon: <Building2 className="w-8 h-8" />,
      title: "Bank Job Prep",
      description:
        "Specialized banking exam preparation with real-time practice sessions",
      color: "from-amber-500 to-orange-600",
      hoverColor: "group-hover:from-amber-600 group-hover:to-orange-700",
    },
  ];

  const stats = [
    {
      number: "1000+",
      label: "Active Students",
      icon: <Users className="w-6 h-6" />,
    },
    {
      number: "100+",
      label: "Practice Questions",
      icon: <CheckCircle2 className="w-6 h-6" />,
    },
    {
      number: "50+",
      label: "Live Exams",
      icon: <Clock className="w-6 h-6" />,
    },
    {
      number: "95%",
      label: "Success Rate",
      icon: <Award className="w-6 h-6" />,
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
    <div className="min-h-screen bg-background overflow-x-hidden">
      {/* Animated Background Elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-indigo-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-teal-200 rounded-full mix-blend-multiply filter blur-xl opacity-15 animate-blob animation-delay-4000"></div>
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
              <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 rounded-full mb-6 border border-accent-200/50">
                <Sparkles className="w-4 h-4 text-accent" />
                <span className="text-sm font-semibold text-accent">
                  Your Success Partner
                </span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl lg:text-7xl font-extrabold mb-6 leading-tight">
                <span className="text-foreground">
                  ExamDesk
                </span>
              </h1>
              
              <p className="text-lg sm:text-xl lg:text-2xl mb-8 text-muted-foreground leading-relaxed">
                Your gateway to success in{" "}
                <span className="font-bold text-foreground">BCS</span>,{" "}
                <span className="font-bold text-foreground">HSC</span>, and{" "}
                <span className="font-bold text-foreground">Banking</span> exams.
                Practice with confidence, excel with excellence.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="group relative px-8 py-4 bg-accent text-accent-foreground rounded-2xl font-bold text-lg transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl hover:shadow-accent/40 overflow-hidden">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Start Free Practice
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-accent/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
                </button>
                
                <button className="group px-8 py-4 border-2 border-border text-foreground rounded-2xl font-bold text-lg hover:bg-muted transition-all duration-300 flex items-center justify-center gap-2 hover:border-border hover:shadow-md">
                  <Play className="w-5 h-5 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>

              {/* Quick Features */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
                <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm">
                  <CheckCircle className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <span className="text-muted-foreground font-medium text-center sm:text-left">Free Access</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm">
                  <Target className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <span className="text-muted-foreground font-medium text-center sm:text-left">Live Exams</span>
                </div>
                <div className="flex flex-col sm:flex-row items-center gap-2 text-xs sm:text-sm">
                  <Award className="w-4 h-4 sm:w-5 sm:h-5 text-accent" />
                  <span className="text-muted-foreground font-medium text-center sm:text-left">Certified</span>
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
                <div className="bg-card/80 backdrop-blur-xl rounded-3xl p-8 shadow-xl border border-border hover:shadow-accent/10 transition-all duration-500 hover:scale-105">
                  <div className="text-center mb-6">
                    <h3 className="text-3xl font-bold text-foreground mb-2">
                      Quick Stats
                    </h3>
                    <p className="text-muted-foreground font-medium">Our Achievement So Far</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div
                        key={index}
                        className="text-center group hover:scale-110 transition-all duration-300 cursor-pointer"
                      >
                        <div className="bg-secondary/50 w-14 h-14 rounded-2xl flex items-center justify-center mx-auto mb-3 text-accent shadow-lg group-hover:shadow-xl group-hover:rotate-6 transition-all duration-300">
                          {stat.icon}
                        </div>
                        <div className="text-3xl font-bold text-foreground mb-1">
                          {stat.number}
                        </div>
                        <div className="text-muted-foreground text-sm font-medium">
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
      <section className="py-20 bg-gradient-to-br from-white/50 to-purple-50/50 backdrop-blur-sm relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent-50 rounded-full mb-4 border border-accent-200/50">
              <Sparkles className="w-4 h-4 text-accent" />
              <span className="text-sm font-semibold text-accent">
                Our Features
              </span>
            </div>
            <h2 className="text-5xl font-extrabold mb-4">
              Why Choose{" "}
              <span className="text-foreground">
                ExamDesk?
              </span>
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Comprehensive exam preparation platform designed for students
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {features.map((feature, index) => (
              <div
                key={index}
                className="group hover:scale-105 transition-all duration-500 cursor-pointer"
              >
                <div className="bg-card/90 backdrop-blur-lg rounded-3xl p-8 h-full border border-border hover:border-accent transition-all duration-500 shadow-lg hover:shadow-xl hover:-translate-y-2">
                  <div
                    className={`bg-gradient-to-r ${feature.color} ${feature.hoverColor} w-14 h-14 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}
                  >
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-foreground mb-4 group-hover:text-accent transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-lg leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-purple-50/50 to-cyan-50/50 relative">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-foreground mb-4">
              Our Services
            </h2>
            <p className="text-xl text-slate-600">
              Everything you need for exam success
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <div className="flex items-start space-x-4 group cursor-pointer p-4 rounded-2xl hover:bg-card/80 transition-all duration-300 hover:shadow-md">
                <div className="bg-accent p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    Previous Question Banks
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Access thousands of previous exam questions with detailed
                    solutions and explanations.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer p-4 rounded-2xl hover:bg-card/80 transition-all duration-300 hover:shadow-md">
                <div className="bg-accent p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    Live Exams
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Participate in real-time mock exams with instant results and
                    performance analysis.
                  </p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group cursor-pointer p-4 rounded-2xl hover:bg-white/80 transition-all duration-300 hover:shadow-md">
                <div className="bg-accent p-3 rounded-2xl flex-shrink-0 group-hover:scale-110 group-hover:rotate-6 transition-all duration-300 shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-foreground mb-2 group-hover:text-accent transition-colors">
                    Performance Tracking
                  </h3>
                  <p className="text-muted-foreground text-lg">
                    Monitor your progress with detailed analytics and
                    personalized study recommendations.
                  </p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-card rounded-3xl p-8 border border-border shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-105">
                <div className="text-center">
                  <div className="bg-accent/10 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6 hover:rotate-12 transition-transform duration-300">
                    <CheckCircle className="w-10 h-10 text-accent" />
                  </div>
                  <h3 className="text-3xl font-bold text-foreground mb-4">
                    Ready to Excel?
                  </h3>
                  <p className="text-muted-foreground mb-6 text-lg">
                    Join thousands of successful students today
                  </p>
                  <button className="bg-accent text-accent-foreground px-8 py-4 rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-muted relative overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 left-0 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent/20 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-extrabold text-foreground mb-4">
              Success Stories
            </h2>
            <p className="text-xl text-muted-foreground">
              What our students say about ExamDesk
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-card backdrop-blur-xl rounded-3xl p-12 border border-border text-center transition-all duration-500 hover:shadow-2xl hover:scale-105 shadow-xl">
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
              <blockquote className="text-2xl text-foreground mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <div className="text-xl font-bold text-foreground">
                  {testimonials[currentTestimonial].name}
                </div>
                <div className="text-muted-foreground font-medium">
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
                      ? "bg-accent w-12"
                      : "bg-border w-3 hover:bg-accent/50"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-accent/5 relative overflow-hidden">
        {/* Animated elements */}
        <div className="absolute inset-0 opacity-15">
          <div className="absolute top-10 left-10 w-64 h-64 bg-accent/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob"></div>
          <div className="absolute bottom-10 right-10 w-64 h-64 bg-accent/10 rounded-full mix-blend-overlay filter blur-3xl animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-6 text-center relative z-10">
          <h2 className="text-5xl font-extrabold text-foreground mb-6">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join ExamDesk today and take the first step towards your dream
            career
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="group relative px-10 py-4 bg-accent text-accent-foreground rounded-2xl font-bold text-lg hover:bg-accent/90 transition-all duration-300 transform hover:scale-105 shadow-xl overflow-hidden">
              <span className="relative z-10">Start Free Trial</span>
              <div className="absolute inset-0 bg-accent/90 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></div>
            </button>
            <button className="group px-10 py-4 border-2 border-border text-foreground rounded-2xl font-bold text-lg hover:bg-muted transition-all duration-300 backdrop-blur-sm hover:scale-105 shadow-lg">
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
