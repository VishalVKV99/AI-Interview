import mockQuestions from '../data/mockQuestion';
import { getDeepSeekQuestions } from '../api/deepseekClient';

export const generateSkillBasedQuestions = async (skills = []) => {
  const finalQuestions = [];

  for (let i = 0; i < skills.length; i++) {
    const skill = skills[i];

    // ✅ First try DeepSeek
    let question = await getDeepSeekQuestions(skill);

    // ❌ DeepSeek failed → fallback to mock
    if (!question) {
      const staticQs = mockQuestions[skill] || [];
      question = staticQs[Math.floor(Math.random() * staticQs.length)] || `Describe your experience with ${skill}.`;
    }

    finalQuestions.push({
      id: i + 1,
      question,
      skill,
    });
  }

  // ✅ Add intro question
  finalQuestions.unshift({
    id: 0,
    question: "Please introduce yourself.",
    skill: "General",
  });

  return finalQuestions;
};
