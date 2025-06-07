import { useState, useEffect, useRef, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewContext } from '../contexts/InterviewContext';
import {
  saveAnswer,
  getAllAnswers,
  clearAnswers,
} from '../services/answerService';
import {
  createInterviewSession,
  saveAnswerToFirestore,
} from '../services/firebaseService';
import { analyzeAnswerWithOpenAI } from '../services/aiScoring';
import { getDeepSeekQuestions } from '../services/deepseekClient';

const Interview = () => {
  const navigate = useNavigate();
  const {
    resumeData,
    user,
    setUser,
  } = useContext(InterviewContext);

  const [showStartModal, setShowStartModal] = useState(true);
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [completedSkills, setCompletedSkills] = useState([]);
  const [interviewSessionId, setInterviewSessionId] = useState(null);
  const [timer, setTimer] = useState(600);
  const [isLoading, setIsLoading] = useState(false);

  const timerRef = useRef(null);
  const recognitionRef = useRef(null);

  const currentQuestion = questions[currentQuestionIndex];

  // Load questions from resume
  useEffect(() => {
    const loadQuestions = async () => {
      if (!resumeData?.skills) return;

      const intro = {
        id: 0,
        question: 'Please introduce yourself.',
        skill: 'Introduction',
      };

      const skillsQs = await Promise.all(
        resumeData.skills.map(async (skill, i) => ({
          id: i + 1,
          question: await getDeepSeekQuestions(skill) || `What do you know about ${skill}?`,
          skill,
        }))
      );

      setQuestions([intro, ...skillsQs]);
    };

    loadQuestions();
  }, [resumeData]);

  // Timer countdown
  useEffect(() => {
    if (!isInterviewStarted || timer <= 0) return;

    timerRef.current = setTimeout(() => setTimer(prev => prev - 1), 1000);

    if (timer === 0) {
      alert("Time's up!");
      handleEndInterview();
    }

    return () => clearTimeout(timerRef.current);
  }, [isInterviewStarted, timer]);

  // Speech Recognition
  const startSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech Recognition not supported.');
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.continuous = true;
    recognition.interimResults = true;

    recognition.onresult = (event) => {
      let finalTranscript = '';
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript + ' ';
        }
      }
      if (finalTranscript) {
        setAnswer(prev => `${prev} ${finalTranscript}`.trim());
      }
    };

    recognition.onend = () => {
      if (isInterviewStarted) recognition.start();
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  const handleStartInterview = async () => {
    if (!tempName || !tempEmail) {
      alert('Please enter both name and email.');
      return;
    }

    setUser({ name: tempName, email: tempEmail });
    setIsInterviewStarted(true);
    setTimer(600);
    setShowStartModal(false);

    try {
      const sessionId = await createInterviewSession();
      setInterviewSessionId(sessionId);
    } catch (err) {
      console.error('Error starting session:', err);
    }

    startSpeechRecognition();
  };

  const saveCurrentAnswer = async () => {
    if (!interviewSessionId || !currentQuestion) return;

    try {
      const feedback = await analyzeAnswerWithOpenAI(answer);

      const answerObj = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question, // ✅ Save full question here
        answerText: answer || '',
        score: feedback?.score ?? 0,
        strengths: feedback?.strengths ?? [],
        areas_to_improve: feedback?.areas_to_improve ?? [],
        timestamp: new Date().toISOString(),

      };

      saveAnswer(currentQuestion.id, answer, answerObj.timestamp);
      await saveAnswerToFirestore(interviewSessionId, answerObj);

      if (
        currentQuestion.skill !== 'Introduction' &&
        !completedSkills.includes(currentQuestion.skill)
      ) {
        setCompletedSkills(prev => [...prev, currentQuestion.skill]);
      }
    } catch (err) {
      console.error('Error saving answer:', err);
    }
  };

  const handleNext = async () => {
    if (!answer.trim()) {
      alert('Answer is required before moving on.');
      return;
    }

    setIsLoading(true);
    await saveCurrentAnswer();
    setIsLoading(false);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
    } else {
      alert('Interview Completed!');
      handleEndInterview();
    }
  };

  const handleSkip = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(prev => prev - 1);
      setAnswer('');
    }
  };

  const handleEndInterview = () => {
    clearTimeout(timerRef.current);
    recognitionRef.current?.stop();

    const answers = getAllAnswers();
    if (!answers.length) return alert('No answers found.');

    navigate('/feedback', { state: { answers } });
    setTimeout(clearAnswers, 2000);
  };

  const formatTime = (s) => `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

  return (
    <>
      {/* Start Modal */}
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="relative bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-center">
            <button
              className="absolute top-2 right-3 text-xl text-gray-600 hover:text-red-600"
              onClick={() => setShowStartModal(false)}
            >
              ✖
            </button>
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Start Your Interview</h2>
            <input
              type="text"
              placeholder="Enter your name"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              className="w-full mb-4 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <input
              type="email"
              placeholder="Enter your email"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
              className="w-full mb-6 px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-400"
            />
            <button
              onClick={handleStartInterview}
              className="bg-green-500 text-white font-semibold px-6 py-3 rounded-md w-full hover:bg-green-600"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}

      {/* Interview UI */}
      <div className="flex min-h-screen">
        <main className="w-3/4 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">AI Interview</h2>
            <span className="text-gray-500">{formatTime(timer)}</span>
          </div>

          {currentQuestion ? (
            <>
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              <textarea
                className="w-full p-3 border rounded mb-4"
                rows="6"
                value={answer}
                readOnly
                placeholder="Your answer will appear here..."
              />

              <div className="flex gap-4">
                <button onClick={handlePrevious} className="bg-gray-400 text-white px-4 py-2 rounded">Previous</button>
                <button onClick={handleSkip} className="bg-yellow-500 text-white px-4 py-2 rounded">Skip</button>
                <button onClick={handleNext} disabled={isLoading} className="bg-blue-500 text-white px-4 py-2 rounded">Save & Next</button>
              </div>
            </>
          ) : (
            <p>Loading questions...</p>
          )}
        </main>

        <aside className="w-1/4 bg-gray-100 p-6">
          <h3 className="text-lg font-bold mb-4">Skills Progress</h3>
          <ul className="space-y-2">
            {resumeData?.skills?.map((skill, i) => (
              <li key={i} className={`p-2 rounded flex justify-between ${completedSkills.includes(skill) ? 'bg-green-300 text-green-800' : 'bg-gray-300'}`}>
                <span>{skill}</span>
                {completedSkills.includes(skill) && <span>✅</span>}
              </li>
            ))}
          </ul>

          <button
            onClick={handleEndInterview}
            className="mt-8 w-full bg-red-500 text-white py-2 rounded hover:bg-red-600"
          >
            End Interview / Submit
          </button>
        </aside>
      </div>
    </>
  );
};

export default Interview;
