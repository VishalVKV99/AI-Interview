// src/services/feedbackService.js
import { getAllAnswers } from './answerService';

// Mock feedback generator
export const generateFeedback = () => {
  const answers = getAllAnswers();

  if (answers.length === 0) {
    return {
      score: 0,
      strengths: [],
      areasToImprove: ['No answers found'],
    };
  }

  // Mock scoring logic: 10 points per question answered
  const score = answers.length * 10;

  return {
    score,
    strengths: ['Good participation', 'Clear communication (assumed)'],
    areasToImprove: ['More detailed answers', 'Confidence'],
  };
};
