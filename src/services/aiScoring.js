const API_KEY = process.env.REACT_APP_OPENAI_API_KEY;
const API_URL = process.env.REACT_APP_OPENAI_API_URL || 'https://api.openai.com/v1/chat/completions';

export const analyzeAnswerWithAI = async (question, userAnswer) => {
  if (!API_KEY || !API_URL) {
    console.error('Missing OpenAI configuration');
    return getErrorResponse('Service configuration error');
  }

  const prompt = {
    analysis_requirements: {
      accuracy: "0-100 scale based on technical correctness",
      correctness: "boolean if answer is fundamentally correct",
      strengths: "3 key positive aspects",
      improvements: "3 specific areas for improvement",
      ideal_answer: "brief model answer summary"
    },
    question: question,
    answer: userAnswer,
    evaluation_rubric: {
      technical_accuracy: 40,
      completeness: 30,
      clarity: 20,
      relevance: 10
    }
  };

  try {
    console.log('Starting AI analysis for question:', question.substring(0, 50) + '...');
    const startTime = Date.now();

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${API_KEY}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [{
          role: 'system',
          content: 'You are a technical interview evaluation system. Analyze answers strictly.'
        }, {
          role: 'user',
          content: JSON.stringify(prompt)
        }],
        temperature: 0.3,
        max_tokens: 500,
        response_format: { type: "json_object" }
      }),
    });

    if (response.status === 429) {
      console.warn('Rate limited');
      return getErrorResponse('Server busy, please try again later', 429);
    }

    if (!response.ok) {
      console.error('API Error:', response.status);
      return getErrorResponse(`API Error: ${response.status}`);
    }

    const data = await response.json();
    const processingTime = (Date.now() - startTime) / 1000;
    console.log(`Analysis completed in ${processingTime}s`);

    const result = parseAIResponse(data);
    return {
      ...result,
      processingTime,
      question: question,
      analyzedAt: new Date().toISOString()
    };

  } catch (error) {
    console.error('Analysis failed:', error);
    return getErrorResponse('Analysis service unavailable');
  }
};

// Helper functions
const parseAIResponse = (data) => {
  try {
    const content = data.choices[0]?.message?.content;
    if (!content) throw new Error('Empty response');

    const result = JSON.parse(content);

    // Validate response structure
    if (typeof result.accuracy !== 'number') throw new Error('Invalid accuracy');
    if (typeof result.isCorrect !== 'boolean') throw new Error('Invalid correctness');

    return {
      accuracy: Math.max(0, Math.min(100, result.accuracy)),
      isCorrect: result.isCorrect,
      strengths: result.strengths?.slice(0, 3) || [],
      improvements: result.improvements?.slice(0, 3) || [],
      idealAnswer: result.idealAnswer || '',
      rawResponse: content
    };
  } catch (error) {
    console.error('Response parsing error:', error);
    return getErrorResponse('Invalid analysis response');
  }
};

const getErrorResponse = (message, code = 500) => ({
  accuracy: 0,
  isCorrect: false,
  strengths: [],
  improvements: [message],
  idealAnswer: '',
  isError: true,
  errorCode: code
});