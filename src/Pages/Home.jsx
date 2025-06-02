import { useState, useEffect } from 'react';
import { BookOpen, Users, Trophy, Clock, CheckCircle, Star, ArrowRight, Play } from 'lucide-react';

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
      description: "Comprehensive BCS exam preparation with updated syllabus and practice tests",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "HSC Excellence",
      description: "Complete HSC exam solutions with subject-wise practice and mock tests",
      color: "from-green-500 to-green-600"
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      title: "Bank Job Prep",
      description: "Specialized banking exam preparation with real-time practice sessions",
      color: "from-purple-500 to-purple-600"
    }
  ];

  const stats = [
    { number: "50,000+", label: "Active Students", icon: <Users className="w-6 h-6" /> },
    { number: "10,000+", label: "Practice Questions", icon: <BookOpen className="w-6 h-6" /> },
    { number: "500+", label: "Live Exams", icon: <Clock className="w-6 h-6" /> },
    { number: "95%", label: "Success Rate", icon: <Trophy className="w-6 h-6" /> }
  ];

  const testimonials = [
    {
      name: "Rashida Khan",
      role: "BCS Cadre",
      text: "ExamDesk BD helped me achieve my dream of becoming a BCS officer. The practice tests were incredibly helpful!",
      rating: 5
    },
    {
      name: "Mohammad Ali",
      role: "Bank Officer",
      text: "The banking exam preparation module is outstanding. I cleared my exam on the first attempt!",
      rating: 5
    },
    {
      name: "Fatima Ahmed",
      role: "HSC Graduate",
      text: "Thanks to ExamDesk BD, I scored excellent marks in my HSC exams. Highly recommended!",
      rating: 5
    }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-indigo-50 to-purple-50 -mt-16 -ml-4">
      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-16">
        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-20 opacity-0'}`}>
              <h1 className="text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-slate-800 to-indigo-800 bg-clip-text text-transparent leading-tight">
                ExamDesk
                <span className="block text-4xl lg:text-5xl mt-2 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text">
                  Bangladesh
                </span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-slate-700 leading-relaxed">
                Your gateway to success in BCS, HSC, and Banking exams. Practice with confidence, excel with excellence.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-12">
                <button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105 flex items-center justify-center group shadow-lg">
                  Start Free Practice
                  <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </button>
                <button className="border-2 border-indigo-200 text-indigo-700 px-8 py-4 rounded-full font-semibold text-lg hover:bg-indigo-50 transition-all duration-300 flex items-center justify-center group">
                  <Play className="mr-2 w-5 h-5" />
                  Watch Demo
                </button>
              </div>
            </div>

            {/* Right Content - Interactive Card */}
            <div className={`transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-20 opacity-0'}`}>
              <div className="relative">
                <div className="bg-white/80 backdrop-blur-lg rounded-3xl p-8 shadow-xl border border-indigo-100">
                  <div className="text-center mb-6">
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">Quick Stats</h3>
                    <p className="text-slate-600">Our Achievement So Far</p>
                  </div>
                  <div className="grid grid-cols-2 gap-6">
                    {stats.map((stat, index) => (
                      <div key={index} className="text-center group hover:scale-105 transition-transform duration-300">
                        <div className="bg-gradient-to-r from-blue-400 to-indigo-400 w-12 h-12 rounded-full flex items-center justify-center mx-auto mb-3 text-white shadow-md">
                          {stat.icon}
                        </div>
                        <div className="text-2xl font-bold text-slate-800 mb-1">{stat.number}</div>
                        <div className="text-slate-600 text-sm">{stat.label}</div>
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
      <section className="py-20 bg-gradient-to-br from-white to-indigo-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-800 mb-4">
              Why Choose 
              <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent"> ExamDesk BD?</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-2xl mx-auto">
              Comprehensive exam preparation platform designed for Bangladeshi students
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="group hover:scale-105 transition-all duration-300">
                <div className="bg-white/90 backdrop-blur-lg rounded-2xl p-8 h-full border border-indigo-100 hover:border-indigo-200 transition-all duration-300 shadow-lg">
                  <div className={`bg-gradient-to-r ${feature.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white mb-6 group-hover:scale-110 transition-transform duration-300 shadow-md`}>
                    {feature.icon}
                  </div>
                  <h3 className="text-2xl font-bold text-slate-800 mb-4">{feature.title}</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-gradient-to-br from-indigo-50 to-purple-50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-slate-800 mb-4">Our Services</h2>
            <p className="text-xl text-slate-600">Everything you need for exam success</p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="flex items-start space-x-4 group">
                <div className="bg-blue-400 p-3 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <BookOpen className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">Previous Question Banks</h3>
                  <p className="text-slate-600 text-lg">Access thousands of previous exam questions with detailed solutions and explanations.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-emerald-400 p-3 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">Live Exams</h3>
                  <p className="text-slate-600 text-lg">Participate in real-time mock exams with instant results and performance analysis.</p>
                </div>
              </div>

              <div className="flex items-start space-x-4 group">
                <div className="bg-purple-400 p-3 rounded-full flex-shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md">
                  <Trophy className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-2xl font-semibold text-slate-800 mb-2">Performance Tracking</h3>
                  <p className="text-slate-600 text-lg">Monitor your progress with detailed analytics and personalized study recommendations.</p>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-8 border border-white/20">
                <div className="text-center">
                  <div className="bg-gradient-to-r from-blue-500 to-purple-500 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle className="w-10 h-10 text-white" />
                  </div>
                  <h3 className="text-3xl font-bold text-white mb-4">Ready to Excel?</h3>
                  <p className="text-gray-300 mb-6 text-lg">Join thousands of successful students today</p>
                  <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg transition-all duration-300 transform hover:scale-105">
                    Get Started Now
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-gradient-to-br from-purple-900 to-slate-900">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-5xl font-bold text-white mb-4">Success Stories</h2>
            <p className="text-xl text-gray-300">What our students say about ExamDesk BD</p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white/10 backdrop-blur-lg rounded-3xl p-12 border border-white/20 text-center transition-all duration-500">
              <div className="flex justify-center mb-6">
                {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                  <Star key={i} className="w-8 h-8 text-yellow-400 fill-current" />
                ))}
              </div>
              <blockquote className="text-2xl text-white mb-8 italic leading-relaxed">
                "{testimonials[currentTestimonial].text}"
              </blockquote>
              <div>
                <div className="text-xl font-semibold text-white">{testimonials[currentTestimonial].name}</div>
                <div className="text-blue-300">{testimonials[currentTestimonial].role}</div>
              </div>
            </div>

            <div className="flex justify-center mt-8 space-x-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentTestimonial ? 'bg-blue-500 scale-125' : 'bg-white/30'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto px-6 text-center">
          <h2 className="text-5xl font-bold text-white mb-6">Ready to Start Your Journey?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join ExamDesk BD today and take the first step towards your dream career
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-10 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Start Free Trial
            </button>
            <button className="border-2 border-white text-white px-10 py-4 rounded-full font-bold text-lg hover:bg-white/10 transition-all duration-300">
              Learn More
            </button>
          </div>
        </div>
      </section>
    </div>
  );
}