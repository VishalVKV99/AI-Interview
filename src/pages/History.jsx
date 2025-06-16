import { useEffect, useState } from 'react';
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

        const sortedResults = data.sort(
          (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
        );

        setResults(sortedResults);
      } catch (error) {
        console.error('Error fetching interview results:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchResults();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-lg font-semibold">Loading history.....</p>
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
    <div className="p-8 max-w-5xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">Interview History</h1>

      <table className="min-w-full bg-white border border-gray-300 shadow text-sm rounded-md overflow-hidden">
        <thead>
          <tr className="bg-blue-100 text-left text-gray-700">
            <th className="py-3 px-4 border-b">#</th>
            <th className="py-3 px-4 border-b">Email</th>
            <th className="py-3 px-4 border-b">Date</th>
            <th className="py-3 px-4 border-b text-center">Download </th>
          </tr>
        </thead>
        <tbody>

          {results.map((result, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="py-3 px-4 border-b">{index + 1}</td>
              <td className="py-3 px-4 border-b">{result.userEmail || currentUser?.email || 'Anonymous'}</td>
              <td className="py-3 px-4 border-b">
                {result.timestamp
                  ? new Date(result.timestamp).toLocaleString()
                  : 'N/A'}
              </td>
              <td className="py-3 px-4 border-b text-center">
                <button
                  onClick={() =>
                    generateFeedbackPDF(
                      result.answers || [], // ✅ answers
                      {                     // ✅ user object
                        name: result.userName || 'Anonymous',
                        email: result.userEmail || currentUser?.email || 'Anonymous'
                      },
                      result.questions || [], // ✅ questions
                      result.interviewTime || 'N/A' // ✅ interviewTime
                    )
                  }

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
