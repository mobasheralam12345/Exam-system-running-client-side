// Generate PDF function using html2pdf
const generatePDF = () => {
  if (!reviewData) return;

  const { examInfo, overallStats, timeAnalysis, subjectWisePerformance, subjects } = reviewData;
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));

  // Create a temporary container for PDF content
  const pdfContent = document.createElement('div');
  pdfContent.style.padding = '20px';
  pdfContent.style.fontFamily = 'Arial, sans-serif';
  pdfContent.style.backgroundColor = 'white';

  // Build HTML content
  let htmlContent = `
    <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 30px; text-align: center; margin-bottom: 20px;">
      <h1 style="margin: 0; font-size: 28px; font-weight: bold;">EXAM REVIEW REPORT</h1>
      <h2 style="margin: 10px 0 5px 0; font-size: 18px;">${examInfo.title}</h2>
      <p style="margin: 5px 0; font-size: 14px;">Student: ${userInfo?.username || "N/A"}</p>
      <p style="margin: 5px 0; font-size: 12px;">Generated on ${new Date().toLocaleString()}</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1F2937; border-bottom: 3px solid #4F46E5; padding-bottom: 8px; margin-bottom: 15px;">OVERALL PERFORMANCE</h2>
      <div style="background: #F9FAFB; padding: 15px; border-radius: 8px; margin-bottom: 10px;">
        <p style="margin: 5px 0; font-size: 14px;"><strong>Score:</strong> ${overallStats.totalMarksObtained.toFixed(1)} / ${overallStats.totalPossibleMarks} (${overallStats.percentage.toFixed(1)}%)</p>
        <p style="margin: 5px 0; font-size: 14px;">
          <span style="color: #10B981; font-weight: bold;">✓ Correct: ${overallStats.correctAnswers}</span> | 
          <span style="color: #EF4444; font-weight: bold;">✗ Wrong: ${overallStats.wrongAnswers}</span> | 
          <span style="color: #6B7280; font-weight: bold;">○ Skipped: ${overallStats.skipped}</span>
        </p>
        <p style="margin: 5px 0; font-size: 14px;"><strong>Attempted:</strong> ${overallStats.attempted} / ${examInfo.totalQuestions}</p>
        ${overallStats.negativeMarksDeducted > 0 ? `<p style="margin: 5px 0; font-size: 14px; color: #EF4444;"><strong>Negative Marks:</strong> ${overallStats.negativeMarksDeducted.toFixed(1)}</p>` : ''}
      </div>

      <h3 style="font-size: 16px; color: #374151; margin: 15px 0 10px 0;">Time Analysis</h3>
      <p style="margin: 5px 0; font-size: 14px;">Allocated: ${formatTime(timeAnalysis.timeAllocated)} | Used: ${formatTime(timeAnalysis.timeConsumed)} | Remaining: ${formatTime(timeAnalysis.timeRemaining)}</p>
    </div>

    <div style="margin-bottom: 25px;">
      <h2 style="font-size: 20px; color: #1F2937; border-bottom: 3px solid #4F46E5; padding-bottom: 8px; margin-bottom: 15px;">SUBJECT-WISE PERFORMANCE</h2>
      ${subjectWisePerformance.map(subject => {
        const percentage = subject.maxMarks > 0 ? ((subject.marksObtained / subject.maxMarks) * 100).toFixed(1) : 0;
        return `
          <div style="background: #F9FAFB; padding: 10px; margin-bottom: 8px; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px;">
              <strong>${subject.subjectName}:</strong> ${subject.marksObtained.toFixed(1)}/${subject.maxMarks} (${percentage}%) - 
              <span style="color: #10B981;">${subject.correct} ✓</span>
              <span style="color: #EF4444;">${subject.wrong} ✗</span>
              <span style="color: #6B7280;">${subject.skipped} ○</span>
            </p>
          </div>
        `;
      }).join('')}
    </div>

    <div style="page-break-before: always;">
      <h2 style="font-size: 20px; color: #1F2937; border-bottom: 3px solid #4F46E5; padding-bottom: 8px; margin-bottom: 15px;">QUESTION DETAILS</h2>
    </div>
  `;

  // Add questions
  subjects.forEach((subject, subjectIndex) => {
    htmlContent += `
      <div style="background: linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%); color: white; padding: 12px; margin: 20px 0 15px 0; border-radius: 6px;">
        <h3 style="margin: 0; font-size: 18px; font-weight: bold;">${subject.subjectName}</h3>
      </div>
    `;

    subject.questions.forEach((question, qIndex) => {
      const statusText = question.isSkipped ? "SKIPPED" : question.isCorrect ? "CORRECT" : "WRONG";
      const statusColor = question.isSkipped ? "#6B7280" : question.isCorrect ? "#10B981" : "#EF4444";
      const optionLabels = ["A", "B", "C", "D", "E"];

      htmlContent += `
        <div style="border: 2px solid ${statusColor}; border-radius: 8px; padding: 15px; margin-bottom: 20px; background: ${question.isCorrect ? '#F0FDF4' : question.isSkipped ? '#F9FAFB' : '#FEF2F2'};">
          <div style="margin-bottom: 10px;">
            <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold; margin-right: 8px;">Q${question.questionNumber}</span>
            <span style="background: ${statusColor}; color: white; padding: 4px 12px; border-radius: 4px; font-size: 12px; font-weight: bold;">${statusText}</span>
            <span style="float: right; background: #E0E7FF; color: #4F46E5; padding: 4px 12px; border-radius: 4px; font-size: 11px; font-weight: bold;">${question.difficulty?.toUpperCase()}</span>
          </div>
          
          <p style="margin: 10px 0; font-size: 14px; line-height: 1.6;"><strong>${stripHtml(question.text)}</strong></p>
          
          <div style="margin: 10px 0;">
            ${question.options.map((option, optIndex) => {
              const isUserAnswer = question.userAnswer === optIndex;
              const isCorrectAnswer = question.correctAnswer === optIndex;
              let bgColor = '#FFFFFF';
              let borderColor = '#E5E7EB';
              let textColor = '#1F2937';
              
              if (isCorrectAnswer) {
                bgColor = '#D1FAE5';
                borderColor = '#10B981';
                textColor = '#065F46';
              } else if (isUserAnswer) {
                bgColor = '#FEE2E2';
                borderColor = '#EF4444';
                textColor = '#991B1B';
              }

              return `
                <div style="background: ${bgColor}; border: 2px solid ${borderColor}; padding: 10px; margin: 6px 0; border-radius: 6px;">
                  <span style="font-weight: bold; color: ${textColor};">${optionLabels[optIndex]}.</span>
                  <span style="color: ${textColor}; margin-left: 8px;">${stripHtml(option)}</span>
                  ${isCorrectAnswer ? '<span style="color: #10B981; font-weight: bold; float: right;">✓ Correct Answer</span>' : ''}
                  ${isUserAnswer && !isCorrectAnswer ? '<span style="color: #EF4444; font-weight: bold; float: right;">✗ Your Answer</span>' : ''}
                </div>
              `;
            }).join('')}
          </div>

          ${question.explanation ? `
            <div style="background: #FEF3C7; border-left: 4px solid #F59E0B; padding: 12px; margin-top: 12px; border-radius: 4px;">
              <p style="margin: 0; font-size: 13px; color: #92400E;"><strong>Explanation:</strong> ${stripHtml(question.explanation)}</p>
            </div>
          ` : ''}
        </div>
      `;
    });
  });

  pdfContent.innerHTML = htmlContent;

  // PDF options
  const opt = {
    margin: [10, 10, 10, 10],
    filename: `${examInfo.title.replace(/[^a-z0-9]/gi, '_')}_Review.pdf`,
    image: { type: 'jpeg', quality: 0.98 },
    html2canvas: { scale: 2, useCORS: true, letterRendering: true },
    jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
  };

  // Generate PDF
  html2pdf().set(opt).from(pdfContent).save();
};
