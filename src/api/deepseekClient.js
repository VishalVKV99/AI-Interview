const apiKey = process.env.VITE_DEEPSEEK_API_KEY;

export const getDeepSeekQuestions = async (skill) => {
  if (!apiKey) {
    console.warn("DeepSeek API key not provided.");
    return null;
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

    if (!response.ok) {
      console.error('DeepSeek error:', data);
      return null;
    }

    return data.choices?.[0]?.message?.content?.trim() || null;
  } catch (err) {
    console.error('DeepSeek fetch error:', err);
    return null;
  }
};
