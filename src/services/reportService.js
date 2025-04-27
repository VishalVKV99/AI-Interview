// src/services/reportService.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generatePDFReport = (interviewResults) => {
  const doc = new jsPDF();

  doc.setFontSize(18);
  doc.text('AI Interview Report', 14, 22);

  doc.setFontSize(12);
  doc.text(`Candidate: ${interviewResults.userName || 'N/A'}`, 14, 32);
  // doc.text(`Total Score: ${interviewResults.totalScore || 0}/10`, 14, 40);

  const tableData = interviewResults.answers.map((ans, index) => [
    index + 1,
    ans.question,
    ans.answer,
    // ans.score,
    // ans.strengths.join(', '),
    // ans.areasToImprove.join(', ')
  ]);

  doc.autoTable({
    head: [['#', 'Question', 'Answer', ]],
    body: tableData,
    startY: 50
  });

  doc.save('AI_Interview_Report.pdf');
};
