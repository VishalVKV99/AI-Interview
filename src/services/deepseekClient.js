import mockQuestions from '../data/mockInterview';

const apiKey = process.env.REACT_APP_OPENAI_API_KEY;

export const getDeepSeekQuestions = async (skill, difficulty = 'easy') => {
  if (!apiKey) {
    console.warn("OpenAI API key not provided. Using offline mock questions.");
    return getOfflineQuestion(skill);
  }

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo', // or 'gpt-4'
        messages: [
          {
            role: 'system',
            content: 'You are a technical interview question generator. Generate relevant questions based on the skill and difficulty level.'
          },
          {
            role: 'user',
            content: `Generate a ${difficulty} level interview question about ${skill}. Make it concise and practical.`
          }
        ],
        temperature: 0.7,
        max_tokens: 100,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error('OpenAI API Error:', errorData);
      return getOfflineQuestion(skill);
    }

    const data = await response.json();
    return data.choices[0]?.message?.content?.trim() || getOfflineQuestion(skill);
    
  } catch (err) {
    console.error('OpenAI API fetch error:', err);
    return getOfflineQuestion(skill);
  }
};

const getOfflineQuestion = (skill) => {
  const skillSet = mockQuestions[skill];
  if (!skillSet || skillSet.length === 0) return `What do you know about ${skill}?`;
  const randomIndex = Math.floor(Math.random() * skillSet.length);
  return skillSet[randomIndex];
};