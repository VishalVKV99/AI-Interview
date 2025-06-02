
import { useState, useEffect, useContext, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { InterviewContext } from '../contexts/InterviewContext';
import { saveAnswer, getAllAnswers, clearAnswers } from '../services/answerService';
import { analyzeAnswerWithOpenAI } from '../services/aiScoring';
import { createInterviewSession, saveAnswerToFirestore } from '../services/firebaseService';
 import { getDeepSeekQuestions } from '../services/deepseekClient';

const Interview = () => {
  const navigate = useNavigate();
  const { resumeData } = useContext(InterviewContext);
  const [showStartModal, setShowStartModal] = useState(true);

  const [questions, setQuestions] = useState([]); 
  const [tempName, setTempName] = useState('');
  const [tempEmail, setTempEmail] = useState('');
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answer, setAnswer] = useState('');
  const [completedSkills, setCompletedSkills] = useState([]);
  const [isInterviewStarted, setIsInterviewStarted] = useState(false);
  const [timer, setTimer] = useState(600); // 10 min
  const [isLoading, setIsLoading] = useState(false);


  const timerRef = useRef(null);
  const recognitionRef = useRef(null);
  const [interviewSessionId, setInterviewSessionId] = useState(null);

  const currentQuestion = questions[currentQuestionIndex];

  
useEffect(() => {
  const loadQuestions = async () => {
    if (!resumeData?.skills || !resumeData?.projects) {
      console.warn('Resume data is missing.');
      return;
    }

    const introQuestion = {
      id: 0,
      question: 'Please introduce yourself.',
      skill: 'Introduction',
    };

    const skillQuestions = await Promise.all(
      resumeData.skills.map(async (skill, idx) => {
        const questionText = await getDeepSeekQuestions(skill);
        return {
          id: idx + 1,
          question: questionText || `What do you know about ${skill}?`,
          skill: skill,
        };
      })
    );

    setQuestions([introQuestion, ...skillQuestions]);
  };

  loadQuestions();
}, [resumeData]);

  // ✅ Timer countdown logic
  useEffect(() => {
    if (!isInterviewStarted || timer <= 0) return;

    timerRef.current = setTimeout(() => setTimer(prev => prev - 1), 1000);

    if (timer === 0) {
      alert("Time's up!");
      handleEndInterview();
    }

    return () => clearTimeout(timerRef.current);
  }, [isInterviewStarted, timer]);

  const formatTime = (seconds) => `${String(Math.floor(seconds / 60)).padStart(2, '0')}:${String(seconds % 60).padStart(2, '0')}`;

  // ✅ Start interview session + mic
  const { user, setUser } = useContext(InterviewContext);

  const handleStartInterview = async () => {
    if (!tempName || !tempEmail) {
      alert("Please enter both name and email.");
      return;
    }

    setUser({ name: tempName, email: tempEmail });
    setIsInterviewStarted(true);
    setTimer(600);
    setShowStartModal(false);

    try {
      const sessionId = await createInterviewSession();
      setInterviewSessionId(sessionId);
      console.log('Interview session started:', sessionId);
    } catch (error) {
      console.error('Failed to create interview session:', error);
    }

    startSpeechRecognition();
  };



  // ✅ Start and persist speech recognition
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

    recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      if (isInterviewStarted) {
        console.log('Restarting recognition...');
        recognition.start();
      }
    };

    recognition.start();
    recognitionRef.current = recognition;
  };

  // ✅ Save answer with feedback + mark skill
  const saveCurrentAnswer = async () => {
    if (!interviewSessionId) {
      console.error('Interview session not initialized!');
      return;
    }

    if (!currentQuestion || currentQuestion.id === undefined) {
      console.error('Invalid currentQuestion:', currentQuestion);
      return;
    }

    try {
      const aiFeedback = await analyzeAnswerWithOpenAI(answer);

      const answerObj = {
        questionId: currentQuestion.id,
        questionText: currentQuestion.question,
        answerText: answer || '',
        score: aiFeedback?.score ?? 0,
        strengths: aiFeedback?.strengths ?? [],
        areas_to_improve: aiFeedback?.areas_to_improve ?? [],
        timestamp: new Date().toISOString()
      };


      console.log('Saving Answer Object:', answerObj);


      // ✅ Save locally
      saveAnswer(
        currentQuestion.id,
        answer,
        answerObj.timestamp // ✅ pass timestamp
      );

      // ✅ Save to Firestore (fixed rules)
      await saveAnswerToFirestore(interviewSessionId, answerObj);

      console.log('Answer saved to Firestore:', answerObj);

      // ✅ Mark completed skill NOW!
      const skill = currentQuestion.skill;
      if (
        skill !== 'Introduction' &&
        skill !== 'Projects' &&
        !completedSkills.includes(skill)
      ) {
        setCompletedSkills(prevSkills => [...prevSkills, skill]);
        console.log(`Skill marked: ${skill}`);
      }

    } catch (error) {
      console.error('Error saving answer:', error);
    }
  };


  // ✅ Handle next question click
  const handleNextQuestion = async () => {
    if (!answer.trim()) {
      alert('Please provide an answer before proceeding.');
      return;
    }

    if (isLoading) return;

    setIsLoading(true); // ✅ disable button
    await saveCurrentAnswer();
    setIsLoading(false); // ✅ re-enable

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setAnswer('');
    } else {
      alert('Interview Completed!');
      handleEndInterview();
    }
  };

  // ✅ End interview logic (manual or timeout)
  const handleEndInterview = () => {
    clearTimeout(timerRef.current);
    if (recognitionRef.current) recognitionRef.current.stop();

    const answers = getAllAnswers();

    if (!answers.length) {
      alert('No answers to submit!');
      return;
    }

    console.log('Submitting answers:', answers);

    navigate('/feedback', { state: { answers } });

    setTimeout(() => {
      clearAnswers();
    }, 2000);
  };
  return (
    <>
      {showStartModal && (
        <div className="fixed inset-0 z-50 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md mx-auto text-center">
            <h2 className="text-2xl font-bold mb-6 text-gray-800">Start Your Interview</h2>

            <input
              type="text"
              placeholder="Enter your name"
              className="w-full mb-4 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
            />
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full mb-6 px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={tempEmail}
              onChange={(e) => setTempEmail(e.target.value)}
            />

            <button
              onClick={handleStartInterview}
              className="bg-green-500 hover:bg-green-600 text-white font-semibold px-6 py-3 rounded-md transition-all w-full"
            >
              Start Interview
            </button>
          </div>
        </div>
      )}

      {/* Interview layout */}
      <div className="flex min-h-screen bg-white">
        <div className="w-3/4 p-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">AI Interview In Progress</h2>
            <span className="text-gray-500 text-lg">{formatTime(timer)}</span>
          </div>

          {currentQuestion ? (
            <>
              <h3 className="text-lg font-semibold mb-4">{currentQuestion.question}</h3>
              <textarea
                className="w-full p-3 border rounded mb-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                rows="6"
                placeholder="Your answer will appear here..."
                value={answer}
                readOnly
              />

              <div className="flex gap-4">
                <button
                  onClick={handleStartInterview}
                  disabled={isInterviewStarted}
                  className={`px-6 py-3 rounded text-white transition-all ${isInterviewStarted ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-500 hover:bg-green-600'}`}
                >
                  {isInterviewStarted ? 'Interview Running...' : 'Start Interview'}
                </button>

                <button
                  onClick={handleNextQuestion}
                  disabled={!isInterviewStarted}
                  className="bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600 transition-all"
                >
                  Next Question
                </button>
              </div>
            </>
          ) : (
            <div>Loading questions...</div>
          )}
        </div>

        <div className="w-1/4 bg-gray-100 p-8 border-l border-gray-300">
          <h3 className="text-lg font-semibold mb-4">Skills Progress</h3>
          <ul className="space-y-2">
            {resumeData?.skills?.map((skill, index) => (
              <li
                key={index}
                className={`p-2 rounded flex justify-between items-center ${completedSkills.includes(skill)
                    ? 'bg-green-300 text-green-800'
                    : 'bg-gray-300 text-gray-700'
                  }`}
              >
                <span>{skill}</span>
                {completedSkills.includes(skill) && <span>✅</span>}
              </li>
            ))}
          </ul>

          <button
            onClick={handleEndInterview}
            disabled={!isInterviewStarted}
            className="mt-8 w-full bg-red-500 text-white px-6 py-3 rounded hover:bg-red-600 transition-all"
          >
            Submit Answers / End Interview
          </button>
        </div>
      </div>
    </>
  );
};
export default Interview;