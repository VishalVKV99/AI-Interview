// utils/pdfGenerator.js
import jsPDF from 'jspdf';
import 'jspdf-autotable';

export const generateFeedbackPDF = (answers, user, questions, interviewTime) => {
  const doc = new jsPDF();
  const margin = 10;
  let y = margin;

  doc.setFontSize(18);
  doc.text('Interview Feedback Report', margin, y);
  y += 10;

  doc.setFontSize(12);
  doc.text(`Candidate Name: ${user?.name || 'Anonymous'}`, margin, y);
  y += 6;
  doc.text(`Candidate Email: ${user?.email || 'Anonymous'}`, margin, y);
  y += 6;
  doc.text(`Interview Time: ${interviewTime || 'N/A'} minutes`, margin, y);
  y += 6;
  doc.text(`Date: ${new Date().toLocaleString()}`, margin, y);
  y += 10;

  doc.setFontSize(14);
  doc.text('Your performance', margin, y);
  y += 8;

  const tableHeaders = [
    { header: '#', dataKey: 'index' },
    { header: 'Question', dataKey: 'question' },
    { header: 'Your Answer', dataKey: 'answer' },
  ];

  const tableData = answers.map((ans, idx) => {
    const questionText = questions.find(q => q.id === ans.questionId)?.question || `Question ID: ${ans.questionId}`;
    return {
      index: idx + 1,
      question: questionText,
      answer: ans.answerText || '',
    };
  });

  doc.autoTable({
    startY: y,
    head: [tableHeaders.map(col => col.header)],
    body: tableData.map(row => tableHeaders.map(col => row[col.dataKey])),
    styles: {
      fillColor: [245, 245, 245],
      textColor: 20,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
      fontSize: 9,
      overflow: 'linebreak',
      cellPadding: 2,
    },
    headStyles: {
      fillColor: [0, 102, 204],
      textColor: 255,
      fontSize: 11,
      halign: 'center',
    },
    alternateRowStyles: {
      fillColor: [255, 255, 255],
    },
    
    theme: 'striped',
    didDrawPage: function (data) {
      const pageHeight = doc.internal.pageSize.height;
      if (data.cursor.y + 10 > pageHeight) {
        doc.addPage();
      }
    },
  });

  doc.save('Interview_Feedback_Report.pdf');
};
