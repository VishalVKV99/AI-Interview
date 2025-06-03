// import React, { useEffect, useState } from 'react';
// import { useAuth } from '../contexts/AuthContext';
// import {
//   LineChart, Line, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer
// } from 'recharts';

// import { saveInterviewReport, getUserReports, generatePDFReport } from '../services/reportService';

// const Dashboard = () => {
//   const { currentUser } = useAuth();
//   const [reportData, setReportData] = useState([]);
//   const [selectedCategory, setSelectedCategory] = useState('All');

//   useEffect(() => {
//     const fetchData = async () => {
//       if (currentUser?.uid) {
//         const data = await getUserReports(currentUser.uid);
//         setReportData(data);
//       }
//     };
//     fetchData();
//   }, [currentUser]);

//   const filteredReports = selectedCategory === 'All'
//     ? reportData
//     : reportData.filter(report => report.category === selectedCategory);

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Welcome, {currentUser?.displayName}</h1>

//       {/* Step 2: Category Filter */}
//       <div className="mb-6">
//         <label className="block font-semibold mb-2">Filter by Category:</label>
//         <select
//           className="border px-3 py-2 rounded"
//           value={selectedCategory}
//           onChange={(e) => setSelectedCategory(e.target.value)}
//         >
//           <option value="All">All</option>
//           <option value="DSA">DSA</option>
//           <option value="HR">HR</option>
//           <option value="System Design">System Design</option>
//         </select>
//       </div>

//       {/* Step 4: Performance Chart */}
//       <h2 className="text-xl font-semibold mb-2">Performance Over Time</h2>
//       <ResponsiveContainer width="100%" height={300}>
//         <LineChart data={filteredReports}>
//           <CartesianGrid strokeDasharray="3 3" />
//           <XAxis dataKey="timestamp" tickFormatter={(ts) => new Date(ts).toLocaleDateString()} />
//           <YAxis domain={[0, 10]} />
//           <Tooltip labelFormatter={(ts) => new Date(ts).toLocaleString()} />
//           <Line type="monotone" dataKey="score" stroke="#8884d8" />
//         </LineChart>
//       </ResponsiveContainer>

//       {/* Step 3 & 4: Report List with Download and Feedback Breakdown */}
//       <h2 className="text-xl font-semibold mt-6">Interview History</h2>
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
//         {filteredReports.map((report, index) => (
//           <div key={index} className="p-4 border rounded shadow bg-white">
//             <p><strong>Date:</strong> {new Date(report.timestamp).toLocaleDateString()}</p>
//             <p><strong>Score:</strong> {report.score}</p>
//             <p><strong>Category:</strong> {report.category}</p>
//             {report.feedback && <p><strong>Feedback:</strong> {report.feedback}</p>}

//             {/* Optional strengths and improvement feedback */}
//             {report.strengths && report.strengths.length > 0 && (
//               <p><strong>Strengths:</strong> {report.strengths.join(', ')}</p>
//             )}
//             {report.areasToImprove && report.areasToImprove.length > 0 && (
//               <p><strong>Areas to Improve:</strong> {report.areasToImprove.join(', ')}</p>
//             )}

//             {/* Step 3: PDF Download */}
//             <button
//               className="mt-3 px-4 py-1 bg-blue-600 text-white rounded"
//               onClick={() => generatePDFReport(report)}
//             >
//               Download PDF
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
