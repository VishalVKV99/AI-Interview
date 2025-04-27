import openai from './openaiClient';

export async function generateInterviewQuestions(resumeData) {
  const { skills = [], projects = [] } = resumeData;

  const prompt = `
You are an AI interview assistant. Based on the following resume information:

Skills: ${skills.join(', ')}
Projects: ${projects.map(p => p.title).join(', ')}

Generate 5 unique, diverse, and challenging interview questions that test practical knowledge, critical thinking, or real-world application. Return only the list of questions as a JSON array of strings.
`;

  try {
    const response = await openai.chat.completions.create({
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
      model: 'gpt-3.5-turbo',
    });

    const output = response.choices[0].message.content;
    const parsed = JSON.parse(output); // Must return pure JSON from prompt
    return parsed;
  } catch (error) {
    console.error('Error generating questions:', error);
    return [];
  }
}
