import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  FiArrowLeft,
  FiCheckCircle,
  FiXCircle,
  FiMinusCircle,
  FiClock,
  FiAward,
  FiTarget,
  FiChevronDown,
  FiChevronUp,
  FiDownload,
} from "react-icons/fi";
import axios from "axios";
import html2pdf from "html2pdf.js";

const StudentExamReview = () => {
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [reviewData, setReviewData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedSubjects, setExpandedSubjects] = useState({});
  const [examType, setExamType] = useState("live");

  useEffect(() => {
    fetchReviewData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [submissionId]);

  const fetchReviewData = async () => {
    try {
      setLoading(true);

      const storedType = localStorage.getItem(`exam_${submissionId}_type`);
      const typeToUse = storedType || examType;

      const token = localStorage.getItem("userToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }

      let apiUrl;
      if (typeToUse === "live") {
        apiUrl = `${
          import.meta.env.VITE_BACKEND_URL
        }/liveExam/student/exam-review/${submissionId}?examType=live`;
      } else {
        apiUrl = `${
          import.meta.env.VITE_BACKEND_URL
        }/practice-exam/review/${submissionId}`;
      }

      const response = await axios.get(apiUrl, { headers });

      if (response.data.success) {
        const data = response.data.reviewData;
        setReviewData(data);

        const expanded = {};
        data.subjects.forEach((_, index) => {
          expanded[index] = true;
        });
        setExpandedSubjects(expanded);
      }
    } catch (err) {
      console.error("Error fetching review data:", err);
      setError("Failed to load exam review. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const toggleSubject = (index) => {
    setExpandedSubjects((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    } else if (minutes > 0) {
      return `${minutes}m ${secs}s`;
    }
    return `${secs}s`;
  };

  const getPerformanceColor = (percentage) => {
    if (percentage >= 80) return "from-green-500 to-emerald-600";
    if (percentage >= 60) return "from-blue-500 to-cyan-600";
    if (percentage >= 40) return "from-amber-500 to-orange-600";
    return "from-red-500 to-pink-600";
  };

  const getPerformanceBadge = (percentage) => {
    if (percentage >= 90)
      return { text: "Excellent", color: "bg-green-100 text-green-700" };
    if (percentage >= 80)
      return { text: "Very Good", color: "bg-blue-100 text-blue-700" };
    if (percentage >= 70)
      return { text: "Good", color: "bg-cyan-100 text-cyan-700" };
    if (percentage >= 60)
      return { text: "Average", color: "bg-amber-100 text-amber-700" };
    if (percentage >= 40)
      return { text: "Below Average", color: "bg-orange-100 text-orange-700" };
    return { text: "Needs Improvement", color: "bg-red-100 text-red-700" };
  };

  // Black & white PDF
  const generatePDF = () => {
    if (!reviewData) return;

    const {
      examInfo,
      overallStats,
      timeAnalysis,
      subjectWisePerformance,
      subjects,
    } = reviewData;
    const userInfo = JSON.parse(localStorage.getItem("userInfo"));

    const container = document.createElement("div");
    container.style.cssText =
      "position:absolute;left:-9999px;top:-9999px;width:800px;";

    const pdfContent = document.createElement("div");
    pdfContent.style.cssText =
      "padding:20px;font-family:Arial,sans-serif;background-color:#ffffff;color:#000000;";

    const stripHtml = (html) => {
      if (!html) return "";
      const tmp = document.createElement("DIV");
      tmp.innerHTML = html;
      return tmp.textContent || tmp.innerText || "";
    };

    // Header + overall + subject summary
    let htmlContent = `
      <div style="background:#ffffff;color:#000000;padding:30px;text-align:center;margin-bottom:20px;border-bottom:1px solid #000;">
        <h1 style="margin:0;font-size:28px;font-weight:bold;">EXAM REVIEW REPORT</h1>
        <h2 style="margin:10px 0 5px 0;font-size:18px;">${examInfo.title}</h2>
        <p style="margin:5px 0;font-size:14px;">Student: ${
          userInfo?.username || "N/A"
        }</p>
        <p style="margin:5px 0;font-size:12px;">Generated on ${new Date().toLocaleString()}</p>
      </div>

      <div style="margin-bottom:25px;">
        <h2 style="font-size:20px;color:#000;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:15px;">OVERALL PERFORMANCE</h2>
        <div style="background:#ffffff;padding:15px;border-radius:8px;border:1px solid #000;margin-bottom:10px;">
          <p style="margin:5px 0;font-size:14px;"><strong>Score:</strong> ${overallStats.totalMarksObtained.toFixed(
            1
          )} / ${
      overallStats.totalPossibleMarks
    } (${overallStats.percentage.toFixed(1)}%)</p>
          <p style="margin:5px 0;font-size:14px;">
            Correct: ${overallStats.correctAnswers} |
            Wrong: ${overallStats.wrongAnswers} |
            Skipped: ${overallStats.skipped}
          </p>
          <p style="margin:5px 0;font-size:14px;"><strong>Attempted:</strong> ${
            overallStats.attempted
          } / ${examInfo.totalQuestions}</p>
          ${
            overallStats.negativeMarksDeducted > 0
              ? `<p style="margin:5px 0;font-size:14px;"><strong>Negative Marks:</strong> ${overallStats.negativeMarksDeducted.toFixed(
                  1
                )}</p>`
              : ""
          }
        </div>

        <h3 style="font-size:16px;color:#000;margin:15px 0 10px 0;">Time Analysis</h3>
        <p style="margin:5px 0;font-size:14px;">
          Allocated: ${formatTime(timeAnalysis.timeAllocated)} |
          Used: ${formatTime(timeAnalysis.timeConsumed)} |
          Remaining: ${formatTime(timeAnalysis.timeRemaining)}
        </p>
      </div>

      <div style="margin-bottom:25px;">
        <h2 style="font-size:20px;color:#000;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:15px;">SUBJECT-WISE PERFORMANCE</h2>
        ${subjectWisePerformance
          .map((subject) => {
            const percentage =
              subject.maxMarks > 0
                ? ((subject.marksObtained / subject.maxMarks) * 100).toFixed(1)
                : 0;
            return `
              <div style="background:#ffffff;padding:10px;margin-bottom:8px;border-radius:6px;border:1px solid #000;">
                <p style="margin:0;font-size:14px;">
                  <strong>${subject.subjectName}:</strong>
                  ${subject.marksObtained.toFixed(1)}/${
              subject.maxMarks
            } (${percentage}%)
                  - Correct: ${subject.correct}
                  - Wrong: ${subject.wrong}
                  - Skipped: ${subject.skipped}
                </p>
              </div>
            `;
          })
          .join("")}
      </div>

      <div style="page-break-before:always;">
        <h2 style="font-size:20px;color:#000;border-bottom:2px solid #000;padding-bottom:8px;margin-bottom:15px;">QUESTION DETAILS</h2>
      </div>
    `;

    // Questions
    subjects.forEach((subject) => {
      htmlContent += `
        <div style="background:#ffffff;color:#000;padding:12px;margin:20px 0 15px 0;border-radius:6px;border:1px solid #000;">
          <h3 style="margin:0;font-size:18px;font-weight:bold;">${subject.subjectName}</h3>
        </div>
      `;

      subject.questions.forEach((question) => {
        const statusText = question.isSkipped
          ? "SKIPPED"
          : question.isCorrect
          ? "CORRECT"
          : "WRONG";
        const optionLabels = ["A", "B", "C", "D", "E"];

        htmlContent += `
          <div style="border:1px solid #000;border-radius:8px;padding:15px;margin-bottom:20px;background:#ffffff;">
            <div style="margin-bottom:10px;">
              <span style="border:1px solid #000;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:bold;margin-right:8px;">Q${
                question.questionNumber
              }</span>
              <span style="border:1px solid #000;padding:4px 12px;border-radius:4px;font-size:12px;font-weight:bold;">${statusText}</span>
              <span style="float:right;border:1px solid #000;padding:4px 12px;border-radius:4px;font-size:11px;font-weight:bold;">${question.difficulty?.toUpperCase()}</span>
            </div>

            <p style="margin:10px 0;font-size:14px;line-height:1.6;"><strong>${stripHtml(
              question.text
            )}</strong></p>

            <div style="margin:10px 0;">
              ${question.options
                .map((option, optIndex) => {
                  const optionText = stripHtml(option);
                  return `
                    <div style="background:#ffffff;border:1px solid #000;padding:10px;margin:6px 0;border-radius:6px;">
                      <span style="font-weight:bold;color:#000;">${optionLabels[optIndex]}.</span>
                      <span style="color:#000;margin-left:8px;">${optionText}</span>
                    </div>
                  `;
                })
                .join("")}
            </div>

            ${
              question.explanation
                ? `
              <div style="background:#ffffff;border:1px solid #000;padding:12px;margin-top:12px;border-radius:4px;">
                <p style="margin:0;font-size:13px;color:#000;"><strong>Explanation:</strong> ${stripHtml(
                  question.explanation
                )}</p>
              </div>
            `
                : ""
            }
          </div>
        `;
      });
    });

    pdfContent.innerHTML = htmlContent;
    container.appendChild(pdfContent);
    document.body.appendChild(container);

    const elementForPdf = pdfContent.cloneNode(true);
    elementForPdf.style.background = "#ffffff";
    elementForPdf.style.backgroundColor = "#ffffff";
    elementForPdf.style.color = "#000000";

    elementForPdf.querySelectorAll("*").forEach((el) => {
      el.style.backgroundImage = "none";
    });

    const opt = {
      margin: [10, 10, 10, 10],
      filename: `${examInfo.title.replace(/[^a-z0-9]/gi, "_")}_Review.pdf`,
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: {
        scale: 2,
        backgroundColor: "#ffffff",
        logging: false,
      },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };

    html2pdf()
      .set(opt)
      .from(elementForPdf)
      .save()
      .then(() => {
        document.body.removeChild(container);
      })
      .catch((error) => {
        console.error("PDF generation error:", error);
        document.body.removeChild(container);
      });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center">
        <div className="text-center">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 rounded-full border-4 border-indigo-200"></div>
            <div className="absolute inset-0 rounded-full border-4 border-indigo-600 border-t-transparent animate-spin"></div>
          </div>
          <p className="text-gray-700 font-bold text-xl">
            Loading exam review...
          </p>
        </div>
      </div>
    );
  }

  if (error || !reviewData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FiXCircle className="text-red-600" size={40} />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Error Loading Review
          </h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={() => navigate("/student/dashboard")}
            className="w-full py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-xl font-bold hover:from-indigo-700 hover:to-purple-700 transition-all"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  const {
    examInfo,
    overallStats,
    timeAnalysis,
    subjectWisePerformance,
    subjects,
  } = reviewData;
  const performanceBadge = getPerformanceBadge(overallStats.percentage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 pb-12">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            <div className="flex items-center gap-3">
              <button
                onClick={() => navigate("/student/dashboard")}
                className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-xl font-bold transition-all"
              >
                <FiArrowLeft size={20} />
                <span>Back to Dashboard</span>
              </button>
              <button
                onClick={generatePDF}
                className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white rounded-xl font-bold transition-all shadow-md"
              >
                <FiDownload size={20} />
                <span>Download PDF</span>
              </button>
            </div>
            <div className="text-center flex-1 mx-4">
              <h1 className="text-2xl font-bold text-gray-900">
                {examInfo.title}
              </h1>
              <p className="text-sm text-gray-600">
                {examInfo.examType} • {examInfo.totalQuestions} Questions
              </p>
            </div>
            <div
              className={`px-6 py-3 rounded-xl font-bold text-white bg-gradient-to-r ${getPerformanceColor(
                overallStats.percentage
              )}`}
            >
              {overallStats.percentage.toFixed(1)}%
            </div>
          </div>
        </div>
      </div>

      {/* Body UI (unchanged from your version) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overall Statistics */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 mb-8 border border-gray-200">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Overall Performance
            </h2>
            <span
              className={`px-4 py-2 rounded-full font-bold ${performanceBadge.color}`}
            >
              {performanceBadge.text}
            </span>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-2xl p-5 border border-blue-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <FiAward className="text-blue-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  Total Marks
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900">
                {overallStats.totalMarksObtained.toFixed(1)} /{" "}
                {overallStats.totalPossibleMarks}
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5 border border-green-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <FiCheckCircle className="text-green-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  Correct
                </span>
              </div>
              <p className="text-2xl font-bold text-green-600">
                {overallStats.correctAnswers}
              </p>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-pink-50 rounded-2xl p-5 border border-red-100">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-red-100 rounded-lg">
                  <FiXCircle className="text-red-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  Wrong
                </span>
              </div>
              <p className="text-2xl font-bold text-red-600">
                {overallStats.wrongAnswers}
              </p>
            </div>

            <div className="bg-gradient-to-br from-gray-50 to-slate-50 rounded-2xl p-5 border border-gray-200">
              <div className="flex items-center gap-3 mb-2">
                <div className="p-2 bg-gray-100 rounded-lg">
                  <FiMinusCircle className="text-gray-600" size={20} />
                </div>
                <span className="text-sm font-semibold text-gray-600">
                  Skipped
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-600">
                {overallStats.skipped}
              </p>
            </div>
          </div>

          {/* Time Analysis */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <FiClock className="text-indigo-600" />
              Time Analysis
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-semibold">
                  Time Allocated
                </span>
                <span className="font-bold text-gray-900">
                  {formatTime(timeAnalysis.timeAllocated)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-semibold">Time Used</span>
                <span className="font-bold text-indigo-600">
                  {formatTime(timeAnalysis.timeConsumed)}
                </span>
              </div>
              <div className="flex justify-between items-center p-4 bg-gray-50 rounded-xl">
                <span className="text-gray-600 font-semibold">
                  Time Remaining
                </span>
                <span className="font-bold text-green-600">
                  {formatTime(timeAnalysis.timeRemaining)}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Subject-wise Questions */}
        <div className="space-y-6">
          {subjects.map((subject, subjectIndex) => {
            const subjectPerf = subjectWisePerformance.find(
              (s) => s.subjectName === subject.subjectName
            );
            const isExpanded = expandedSubjects[subjectIndex];

            return (
              <div
                key={subjectIndex}
                className="bg-white rounded-3xl shadow-lg border border-gray-200 overflow-hidden"
              >
                {/* Subject Header */}
                <div
                  onClick={() => toggleSubject(subjectIndex)}
                  className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 cursor-pointer hover:from-indigo-700 hover:to-purple-700 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-white mb-2">
                        {subject.subjectName}
                      </h3>
                      {subjectPerf && (
                        <div className="flex gap-6 text-white text-sm">
                          <span className="flex items-center gap-1">
                            <FiCheckCircle size={16} />
                            Correct: {subjectPerf.correct}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiXCircle size={16} />
                            Wrong: {subjectPerf.wrong}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiMinusCircle size={16} />
                            Skipped: {subjectPerf.skipped}
                          </span>
                          <span className="flex items-center gap-1">
                            <FiAward size={16} />
                            Marks: {subjectPerf.marksObtained?.toFixed(
                              1
                            )} / {subjectPerf.maxMarks}
                          </span>
                        </div>
                      )}
                    </div>
                    <div className="text-white">
                      {isExpanded ? (
                        <FiChevronUp size={28} />
                      ) : (
                        <FiChevronDown size={28} />
                      )}
                    </div>
                  </div>
                </div>

                {/* Questions */}
                {isExpanded && (
                  <div className="p-6 space-y-6">
                    {subject.questions.map((question, qIndex) => {
                      const optionLabels = ["A", "B", "C", "D", "E"];

                      return (
                        <div
                          key={qIndex}
                          className={`border-2 rounded-2xl p-6 ${
                            question.isSkipped
                              ? "border-gray-300 bg-gray-50"
                              : question.isCorrect
                              ? "border-green-300 bg-green-50"
                              : "border-red-300 bg-red-50"
                          }`}
                        >
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center gap-3">
                              <span className="px-4 py-2 bg-gray-200 text-gray-800 font-bold rounded-lg">
                                Q{question.questionNumber}
                              </span>
                              {question.isSkipped ? (
                                <span className="px-3 py-1 bg-gray-200 text-gray-700 text-sm font-bold rounded-full flex items-center gap-1">
                                  <FiMinusCircle size={16} />
                                  Skipped
                                </span>
                              ) : question.isCorrect ? (
                                <span className="px-3 py-1 bg-green-200 text-green-800 text-sm font-bold rounded-full flex items-center gap-1">
                                  <FiCheckCircle size={16} />
                                  Correct
                                </span>
                              ) : (
                                <span className="px-3 py-1 bg-red-200 text-red-800 text-sm font-bold rounded-full flex items-center gap-1">
                                  <FiXCircle size={16} />
                                  Wrong
                                </span>
                              )}
                              <span className="text-sm text-gray-600 bg-white px-3 py-1 rounded-full border border-gray-300">
                                +{question.marks} | -{question.negativeMarks}
                              </span>
                            </div>
                            <span className="px-3 py-1 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full uppercase">
                              {question.difficulty}
                            </span>
                          </div>

                          <div
                            className="text-gray-900 font-medium text-lg mb-4 leading-relaxed"
                            dangerouslySetInnerHTML={{ __html: question.text }}
                          />

                          <div className="space-y-3">
                            {question.options.map((option, optIndex) => {
                              const isUserAnswer =
                                question.userAnswer === optIndex;
                              const isCorrectAnswer =
                                question.correctAnswer === optIndex;

                              let optionClass =
                                "p-4 rounded-xl border-2 transition-all ";
                              if (isCorrectAnswer) {
                                optionClass += "border-green-500 bg-green-100 ";
                              } else if (isUserAnswer) {
                                optionClass += "border-red-500 bg-red-100 ";
                              } else {
                                optionClass += "border-gray-300 bg-white ";
                              }

                              return (
                                <div key={optIndex} className={optionClass}>
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-3 flex-1">
                                      <span className="font-bold text-gray-700 text-lg">
                                        {optionLabels[optIndex]}.
                                      </span>
                                      <div
                                        className="text-gray-900 flex-1"
                                        dangerouslySetInnerHTML={{
                                          __html: option,
                                        }}
                                      />
                                    </div>
                                    <div className="flex gap-2">
                                      {isUserAnswer && (
                                        <span className="px-3 py-1 bg-blue-200 text-blue-800 text-xs font-bold rounded-full">
                                          Your Answer
                                        </span>
                                      )}
                                      {isCorrectAnswer && (
                                        <span className="px-3 py-1 bg-green-200 text-green-800 text-xs font-bold rounded-full flex items-center gap-1">
                                          <FiCheckCircle size={14} />
                                          Correct
                                        </span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>

                          {question.explanation && (
                            <div className="mt-4 p-4 bg-amber-50 border-l-4 border-amber-500 rounded-lg">
                              <h5 className="text-sm font-bold text-amber-900 mb-2 flex items-center gap-2">
                                <FiTarget />
                                Explanation
                              </h5>
                              <div
                                className="text-sm text-amber-800 leading-relaxed"
                                dangerouslySetInnerHTML={{
                                  __html: question.explanation,
                                }}
                              />
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default StudentExamReview;
