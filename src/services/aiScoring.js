
export const analyzeAnswerWithOpenAI = async (answerText) => {

  const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
  const API_URL = process.env.REACT_APP_OPENAI_API_URL;

  if (!API_KEY || !API_URL) {
    console.error('Missing OpenAI API Key or URL');
    return {
      score: 0,
      strengths: [],
      areas_to_improve: ['Configuration missing'],
    };
  }

  const prompt = `
  Analyze this answer and give:
  1. Score (0-10)
  2. Strengths
  3. Areas to improve
  
  Answer:
  "${answerText}"

  Format in JSON:
  {
    "score": 8,
    "strengths": ["Clear explanation"],
    "areas_to_improve": ["Be more detailed"]
  }`;

  try {
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    if (!data?.choices?.length) {
      return {
        score: 0,
        strengths: [],
        areas_to_improve: ['No valid AI response'],
      };
    }

    const aiContent = data.choices[0].message.content;

    try {
      const parsed = JSON.parse(aiContent);
      return {
        score: parsed.score || 0,
        strengths: parsed.strengths || [],
        areas_to_improve: parsed.areas_to_improve || [],
      };
    } catch (err) {
      console.error('Failed to parse AI response', err);
      return {
        score: 0,
        strengths: [],
        areas_to_improve: ['Could not parse AI response'],
      };
    }

  } catch (err) {
    console.error('OpenAI API error:', err);
    return {
      score: 0,
      strengths: [],
      areas_to_improve: ['Fetch error'],
    };
  }
};
