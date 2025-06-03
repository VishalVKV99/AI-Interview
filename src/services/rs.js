// // src/services/reportService.js
// import jsPDF from 'jspdf';
// import 'jspdf-autotable';
// import { getFirestore, collection, addDoc, getDocs, query, where } from 'firebase/firestore';


// const db = getFirestore();

// // Save report data to Firestore
// export const saveInterviewReport = async (userId, reportData) => {
//   try {
//     const docRef = await addDoc(collection(db, 'reports'), {
//       userId,
//       ...reportData,
//       timestamp: Date.now()
//     });
//     console.log('Report saved with ID:', docRef.id);
//   } catch (error) {
//     console.error('Error saving report:', error);
//   }
// };

// // Fetch reports for a specific user
// export const getUserReports = async (userId) => {
//   try {
//     const q = query(collection(db, 'reports'), where('userId', '==', userId));
//     const snapshot = await getDocs(q);
//     return snapshot.docs.map(doc => doc.data());
//   } catch (error) {
//     console.error('Error fetching reports:', error);
//     return [];
//   }
// };

// // Generate PDF report
// export const generatePDFReport = (interviewResults) => {
//   const doc = new jsPDF();

//   doc.setFontSize(18);
//   doc.text('AI Interview Report', 14, 22);

//   doc.setFontSize(12);
//   doc.text(`Candidate: ${interviewResults.userName || 'N/A'}`, 14, 32);

//   const tableData = interviewResults.answers.map((ans, index) => [
//     index + 1,
//     ans.question,
//     ans.answer,
//   ]);

//   doc.autoTable({
//     head: [['#', 'Question', 'Answer']],
//     body: tableData,
//     startY: 50
//   });

//   doc.save('AI_Interview_Report.pdf');
// };
