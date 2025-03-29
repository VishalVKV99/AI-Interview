import jsPDF from 'jspdf';
import 'jspdf-autotable';
export const generateFeedbackPDF = (feedback, answers = [],user, questions = [], interviewTime) => {
  console.log("Generating PDF...");
  console.log("Feedback:", feedback);
  console.log("Answers:", answers);
  console.log("Questions:", questions);
  console.log("Interview Time:", interviewTime);

  if (!Array.isArray(answers) || answers.length === 0) {
    console.error("Error: Answers is missing or not an array.");
    return;
  }

  if (!Array.isArray(questions) || questions.length === 0) {
    console.warn("Warning: No questions found, table might be incomplete.");
  }

  const doc = new jsPDF();

  doc.setFontSize(22);
  doc.text('AI Interview Feedback Report', 14, 20);

  doc.setFontSize(12);
  doc.text(`Date: ${new Date().toLocaleDateString()}`, 14, 30);
  doc.text(`Candidate Name: ${user?.name || 'N/A'}`, 14, 38);
  doc.text(`Email: ${user?.email || 'N/A'}`, 14, 46);
  doc.text(`Total Score: ${feedback.totalScore}`, 14, 54);
  doc.text(`Average Score: ${feedback.avgScore}`, 14, 62);
  doc.text(`Interview Duration: ${interviewTime} mins`, 14, 70);

  doc.setFontSize(14);
  doc.text('Strengths:', 14, 80);
  doc.setFontSize(12);
  doc.text(feedback.strengths.join(', ') || 'None', 14, 86);

  doc.setFontSize(14);
  doc.text('Areas to Improve:', 14, 96);
  doc.setFontSize(12);
  doc.text(feedback.areasToImprove.join(', ') || 'None', 14, 102);

  // Prepare table data with all questions
  const answerRows = answers.map((ans, index) => [
    index + 1,
    ans.question || 'N/A',
    ans.answerText || 'Not Answered',
    ans.score !== undefined ? ans.score : 'N/A',
    (ans.strengths || []).join(', ') || 'None',
    (ans.areas_to_improve || []).join(', ') || 'None'
  ]);

  doc.autoTable({
    head: [['#', 'Question', 'User Answer', 'Score', 'Strengths', 'Areas to Improve']],
    body: answerRows,
    startY: 110,
    styles: { fontSize: 10, cellPadding: 3 },
    headStyles: { fillColor: [22, 58, 92], textColor: [255, 255, 255] },
    alternateRowStyles: { fillColor: [240, 240, 240] }
  });

  doc.save('Interview_Feedback.pdf');
};