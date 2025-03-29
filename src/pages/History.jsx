import React, { useEffect, useState } from 'react';
import { getInterviewResults } from '../services/firebaseService';
import { generateFeedbackPDF } from '../utils/pdfGenerator';
import { auth } from '../firebase';

const History = () => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const currentUser = auth.currentUser;

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const data = await getInterviewResults();
        // Filter only current user's results (important)
        const userResults = data.filter(result => result.userId === currentUser?.uid);
        setResults(userResults);
      } catch (error) {
        console.error('Error fetching interview results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, [currentUser]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading history...</p>
      </div>
    );
  }

  if (!results.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">No past interviews found.</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Interview History</h1>

      <table className="min-w-full bg-white border border-gray-300 shadow">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="py-3 px-4 border-b">Date</th>
            <th className="py-3 px-4 border-b">Score</th>
            <th className="py-3 px-4 border-b text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          {results.map((result, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b">{new Date(result.timestamp).toLocaleDateString()}</td>
              <td className="py-3 px-4 border-b">{result.totalScore || 0}</td>
              <td className="py-3 px-4 border-b text-center">
                <button
                  onClick={() => generateFeedbackPDF(result, result.answers || [])}
                  className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                >
                  Download Report
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default History;
