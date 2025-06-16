import { useState, useEffect, useContext } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { getAllAnswers, clearAnswers } from '../services/answerService';
import { InterviewContext } from '../contexts/InterviewContext';
import { generateFeedbackPDF } from '../utils/pdfGenerator';
import { saveInterviewResult } from '../services/firebaseService';

const Feedback = () => {
  const navigate = useNavigate();
  const { state } = useLocation();

  const { questions: contextQuestions, setCurrentQuestionIndex, user } = useContext(InterviewContext);
  const stateQuestions = state?.questions || [];
  const displayQuestions = stateQuestions.length ? stateQuestions : contextQuestions;

  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const retrievedAnswers = getAllAnswers();

    if (!retrievedAnswers.length) {
      alert("No answers found. Redirecting...");
      navigate('/interview');
      return;
    }

    const startTime = retrievedAnswers.length ? new Date(retrievedAnswers[0].timestamp) : null;
    const endTime = retrievedAnswers.length ? new Date(retrievedAnswers[retrievedAnswers.length - 1].timestamp) : null;
    const interviewTime = startTime && endTime ? Math.round((endTime - startTime) / 60000) : "N/A";

    const finalFeedback = {
      answers: retrievedAnswers,
      interviewTime,
      timestamp: new Date().toISOString()
    };

    setAnswers(retrievedAnswers);
    setFeedback(finalFeedback);

    saveInterviewResult({
      ...finalFeedback,
      questions: displayQuestions,
      userName: user.name,
      userEmail: user.email,
    });
  }, [navigate, displayQuestions, user]);

  if (!feedback) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p className="text-xl">Loading feedback...</p>
      </div>
    );
  }

  return (
    <div className="p-8 bg-white rounded shadow-md max-w-3xl mx-auto mt-10">
      <h1 className="text-3xl font-bold text-center mb-6">Interview Feedback</h1>

      <div className="text-center mb-8">
        <p className="text-lg mb-4">You completed the interview successfully!</p>
        <p className="text-gray-600">
          You answered <span className="font-bold">{answers.length}</span> questions.
        </p>
      </div>

      <div className="mt-6 text-left bg-gray-100 p-4 rounded shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Your Performance</h3>
      </div>

      <div className="mt-6 bg-gray-50 p-4 rounded shadow-sm">
        {answers.map((ans, idx) => (
          <div key={idx} className="mb-4 p-4 bg-white border rounded">
            <p className="mb-1">
              <strong>Q{idx + 1}:</strong> {displayQuestions.find(q => q.id === ans.questionId)?.question || 'Question not found'}
            </p>
            <p><strong>Your Answer:</strong> {ans.answerText}</p>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4 mt-8 flex-wrap">
        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            clearAnswers();
            navigate('/interview');
          }}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition"
        >
          Retake Interview
        </button>

        <button
          onClick={() => {
            setCurrentQuestionIndex(0);
            clearAnswers();
            navigate('/');
          }}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-600 transition"
        >
          Go Home
        </button>

        <button
          onClick={() => {
            if (!feedback || !answers || !Array.isArray(answers) || answers.length === 0) {
              alert("No feedback or answers found.");
              return;
            }
            generateFeedbackPDF(answers, user, displayQuestions, feedback.interviewTime);
          }}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
        >
          Download Report
        </button>

        <Link
          to={`/userdashboard/${user.email}`}
          className="bg-purple-600 text-white px-6 py-2 rounded hover:bg-purple-700 transition"
        >
          View Dashboard
        </Link>
      </div>
    </div>
  );
};

export default Feedback;