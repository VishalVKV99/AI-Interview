import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllAnswers, clearAnswers } from '../services/answerService';
import { InterviewContext } from '../contexts/InterviewContext';
import { generateFeedbackPDF } from '../utils/pdfGenerator';
import { saveInterviewResult } from '../services/firebaseService';

const Feedback = () => {
  const navigate = useNavigate();
  const { questions, setCurrentQuestionIndex, user } = useContext(InterviewContext); // ✅ Added user
  const [feedback, setFeedback] = useState(null);
  const [answers, setAnswers] = useState([]);

  useEffect(() => {
    const retrievedAnswers = getAllAnswers(); // ✅ Use this consistently

    if (!retrievedAnswers.length) {
      alert("No answers found. Redirecting...");
      navigate('/interview');
      return;
    }

    // const totalScore = retrievedAnswers.reduce((acc, curr) => acc + (curr.score || 0), 0);
    // const avgScore = retrievedAnswers.length > 0 ? (totalScore / retrievedAnswers.length).toFixed(2) : 0;

    // const strengths = retrievedAnswers.flatMap(a => a.strengths || []);
    // const areasToImprove = retrievedAnswers.flatMap(a => a.areas_to_improve || []);
    // Calculate interview duration
    const startTime = retrievedAnswers.length ? new Date(retrievedAnswers[0].timestamp) : null;
    const endTime = retrievedAnswers.length ? new Date(retrievedAnswers[retrievedAnswers.length - 1].timestamp) : null;
    const interviewTime = startTime && endTime ? Math.round((endTime - startTime) / 60000) : "N/A"; // in minutes

    const finalFeedback = {
      
      // strengths: [...new Set(strengths)],
      // areasToImprove: [...new Set(areasToImprove)],
      answers: retrievedAnswers,
      interviewTime, // ✅ Store total interview time
      timestamp: new Date().toISOString()
    };


    setAnswers(retrievedAnswers);
    setFeedback(finalFeedback);
    
    // ✅ Save to Firebase Firestore
    saveInterviewResult({
      ...finalFeedback
    });
  }, [navigate]);

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

      {/* Performance Overview */}
      <div className="mt-6 text-left bg-gray-100 p-4 rounded shadow-sm">
        <h3 className="text-xl font-semibold mb-3">Your Performance</h3>
        {/* <p><strong>Total Score:</strong> {feedback.totalScore}</p>
        <p><strong>Average Score per Question:</strong> {feedback.avgScore}</p> */}
        {/* <p><strong>Strengths:</strong> {feedback.strengths.length > 0 ? feedback.strengths.join(', ') : 'None'}</p> */}
        {/* <p><strong>Areas to Improve:</strong> {feedback.areasToImprove.length > 0 ? feedback.areasToImprove.join(', ') : 'None'}</p> */}
      </div>

      {/* Answers Breakdown */}
      <div className="mt-6 bg-gray-50 p-4 rounded shadow-sm">
        {/* <h3 className="text-xl font-semibold mb-3">Answer Breakdown</h3> */}
        {answers.map((ans, idx) => (
          <div key={idx} className="mb-4 p-4 bg-white border rounded">
            <p className="mb-1">
              <strong>Q{idx + 1}:</strong> {questions.find(q => q.id === ans.questionId)?.question || 'Question not found'}
            </p>
            <p><strong>Your Answer:</strong> {ans.answerText}</p>
            {/* <p><strong>Score:</strong> {ans.score}</p> */}
            {/* <p><strong>Strengths:</strong> {ans.strengths?.join(', ') || 'None'}</p> */}
            {/* <p><strong>Areas to Improve:</strong> {ans.areas_to_improve?.join(', ') || 'None'}</p> */}
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex justify-center gap-4 mt-8">
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
            console.log("Feedback:", feedback); // Debugging log
            console.log("Answers:", answers);   // Debugging log

            if (!feedback || !answers || !Array.isArray(answers) || answers.length === 0) {
              alert("No feedback or answers found.");
              return;
            }

            generateFeedbackPDF(feedback, answers, user, questions, feedback.interviewTime);

          }}
          className="bg-green-500 text-white px-6 py-2 rounded hover:bg-green-600 transition"
        >
          Download Report
        </button>
      </div>
    </div>
  );
};

export default Feedback;
