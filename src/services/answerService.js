// A simple in-memory store for user answers during a session
let userAnswers = [];

/**
 * Save or update an answer for a specific question
 * @param {number|string} questionId
 * @param {string} answerText
 * @param {number} score
 * @param {Array} strengths
 * @param {Array} areas_to_improve
 */
export const saveAnswer = (questionId, answerText, score, strengths, areas_to_improve, timestamp = new Date().toISOString()) => {
  const answers = getAllAnswers();
  answers.push({ questionId, answerText, score, strengths, areas_to_improve, timestamp }); // ✅ include timestamp
  localStorage.setItem('interview_answers', JSON.stringify(answers));
};


/**
 * Retrieve all answers
 * @returns {Array} answers
 */
export const getAllAnswers = () => {
  console.log('Fetching all answers:', userAnswers);
  return userAnswers;
};

/**
 * Clear all answers (reset interview session)
 */
export const clearAnswers = () => {
  userAnswers = [];
  console.log('All answers cleared.');
};
