import React, { createContext, useState, useEffect, useContext } from 'react';
import { getDeepSeekQuestions } from '../api/deepseekClient'; // ✅ correct name
import mockQuestion from '../data/mockQuestion'; // Optional fallback questions

// Create the context
export const InterviewContext = createContext();
export const useInterview = () => useContext(InterviewContext);

// Provider component
export const InterviewProvider = ({ children }) => {
  const [resumeData, setResumeData] = useState({
    skills: [],
    projects: [],
  });

  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [user, setUser] = useState({
    name: "",
    email: "",
  });

  // Effect to auto-generate questions when resumeData updates
  useEffect(() => {
    if (!resumeData) return;

    const generateQuestions = async () => {
      const skillsArray = resumeData.skills || [];
      const projectsArray = resumeData.projects || [];

      const introQuestion = {
        id: 0,
        question: "Please introduce yourself.",
        skill: "Introduction",
      };

      // Fetch DeepSeek-based questions for each skill
      const skillQuestions = await Promise.all(
        skillsArray.map(async (skill, index) => {
          const apiQuestion = await getDeepSeekQuestions(skill);
          return {
            id: index + 1,
            question: apiQuestion || `Can you explain your experience with ${skill}?`,
            skill,
          };
        })
      );

      const projectQuestions = projectsArray.map((project, index) => ({
        id: index + 1 + skillQuestions.length,
        question: `Describe your project: ${project.title}. What was your role?`,
        skill: "Projects",
      }));

      return [introQuestion, ...skillQuestions, ...projectQuestions];
    };

    // Trigger async question generation
    (async () => {
      const newQuestions = await generateQuestions();
      setQuestions(newQuestions);
      setCurrentQuestionIndex(0); // reset question index
    })();
  }, [resumeData]);

  // Reset interview data
  const resetInterview = () => {
    setCurrentQuestionIndex(0);
    setResumeData({
      skills: [],
      projects: [],
    });
    setQuestions([]);
  };

  return (
    <InterviewContext.Provider
      value={{
        resumeData,
        setResumeData,
        questions,
        setQuestions,
        currentQuestionIndex,
        setCurrentQuestionIndex,
        resetInterview,
        user,
        setUser,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
