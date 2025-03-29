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
export const saveAnswer = (questionId, answerText, score, strengths = [], areas_to_improve = []) => {
  if (!questionId) {
    console.error('Question ID is required to save an answer!');
    return;
  }

  const existingIndex = userAnswers.findIndex(ans => ans.questionId === questionId);

  const answerEntry = {
    questionId,
    answerText,
    score,
    strengths,
    areas_to_improve
  };

  if (existingIndex > -1) {
    userAnswers[existingIndex] = answerEntry;
    console.log(`Answer Updated [Question ${questionId}]`, answerEntry);
  } else {
    userAnswers.push(answerEntry);
    console.log(`Answer Added [Question ${questionId}]`, answerEntry);
  }
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
