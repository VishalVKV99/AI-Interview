import mockQuestions from '../data/mockQuestion';
import { getDeepSeekQuestions } from '../api/deepseekClient';


export const generateSkillBasedQuestions = async (skills = []) => {
  const finalQuestions = [];

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];

    // First try static
    const staticQs = mockQuestions[skill] || [];
    const staticQuestion = staticQs[Math.floor(Math.random() * staticQs.length)];

    // Try DeepSeek as fallback if static not found
    let question = staticQuestion;

    if (!question) {
      const aiQuestion = await getDeepSeekQuestions(skill);
      if (aiQuestion) {
        question = aiQuestion;
      }
    }

    if (question) {
      finalQuestions.push({
        id: i + 1,
        question,
        skill,
      });
    }
  }

  // Add intro
  finalQuestions.unshift({
    id: 0,
    question: "Please introduce yourself.",
    skill: "General",
  });

  return finalQuestions;
};
