import OpenAI from 'openai';

export const extractMessageMetadata = async (text, session = null) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const prompt = `
You're an internal dialogue analyst.

Given the user's message, return a JSON object with:
- emotion: 1 word (e.g., "anxious", "hopeful", "angry", "calm", etc.)
- resistanceType: 1 word (e.g., "avoidance", "self-doubt", "perfectionism", or "none")
- patternTag: 1 word (e.g., "loop", "breakthrough", "drift", "clarity", or "none")

Message:
"${text}"

Only return a valid JSON object like:
{ "emotion": "anxious", "resistanceType": "avoidance", "patternTag": "loop" }
`;

  try {
    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.2,
      max_tokens: 100
    });

    const raw = res.choices[0].message.content.trim();
    const cleaned = raw.replace(/^```(json)?\s*|\s*```$/g, '');
    const metadata = JSON.parse(cleaned);

    console.log('🧠 Extracted Metadata:', metadata);
    if (session?.toneMode) {
      console.log('🎭 Current Session Tone Mode:', session.toneMode);
    }

    return metadata;
  } catch (err) {
    console.error('❌ Metadata parse error:', err.message);
    return {
      emotion: null,
      resistanceType: null,
      patternTag: null
    };
  }
};
