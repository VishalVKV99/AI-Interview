import React, { createContext, useState, useEffect } from 'react';
import { useContext } from 'react';

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

    const generateQuestions = () => {
      const skillsArray = resumeData.skills || [];
      const projectsArray = resumeData.projects || [];

      const introQuestion = {
        id: 0,
        question: "Please introduce yourself.",
        skill: "Introduction",
      };

      const skillQuestions = skillsArray.map((skill, index) => ({
        id: index + 1,
        question: `Can you explain your experience with ${skill}?`,
        skill,
      }));

      const projectQuestions = projectsArray.map((project, index) => ({
        id: index + 1 + skillQuestions.length,
        question: `Describe your project: ${project.title}. What was your role?`,
        skill: "Projects",
      }));

      return [introQuestion, ...skillQuestions, ...projectQuestions];
    };

    const newQuestions = generateQuestions();
    setQuestions(newQuestions);
    setCurrentQuestionIndex(0); // reset question index when new data comes in
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
        setQuestions, // if you ever want to directly modify questions
        currentQuestionIndex,
        setCurrentQuestionIndex,
        resetInterview,user, setUser,
      }}
    >
      {children}
    </InterviewContext.Provider>
  );
};
