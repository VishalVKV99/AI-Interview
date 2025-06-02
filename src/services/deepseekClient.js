import mockQuestions from '../data/mockInterview';

const apiKey = process.env.VITE_DEEPSEEK_API_KEY;

export const getDeepSeekQuestions = async (skill) => {
  if (!apiKey) {
    console.warn("DeepSeek API key not provided. Using offline mock questions.");
    return getOfflineQuestion(skill);
  }

  try {
    const response = await fetch('https://api.deepseek.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'deepseek-chat',
        messages: [
          {
            role: 'user',
            content: `Generate a unique interview question related to the skill: ${skill}`,
          },
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.choices?.[0]?.message?.content) {
      console.error('DeepSeek API failed. Using offline mock question.');
      return getOfflineQuestion(skill);
    }

    return data.choices[0].message.content.trim();
  } catch (err) {
    console.error('DeepSeek fetch error:', err);
    return getOfflineQuestion(skill);
  }
};

const getOfflineQuestion = (skill) => {
  const skillSet = mockQuestions[skill];
  if (!skillSet || skillSet.length === 0) return `What do you know about ${skill}?`;
  const randomIndex = Math.floor(Math.random() * skillSet.length);
  return skillSet[randomIndex];
};
