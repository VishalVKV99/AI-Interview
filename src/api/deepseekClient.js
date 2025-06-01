export const getDeepSeekQuestions = async (skill) => {
const apiKey = process.env.REACT_APP_DEEPSEEK_API_KEY;

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
            content: `Generate an interview question related to the skill: ${skill}`,
          },
        ],
        max_tokens: 100,
      }),
    });

    const data = await response.json();
    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('DeepSeek API Error:', err);
    return null;
  }
};
