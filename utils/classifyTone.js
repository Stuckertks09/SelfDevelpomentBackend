import OpenAI from 'openai';

const VALID_TONES = [
  'raw',
  'edge',
  'reflect',
  'experiment',
  'drift',
  'builder',
  'neutral'
];

export const classifyTone = async (input) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY }); // ✅ moved inside

  const prompt = [
    {
      role: 'system',
      content: `
You are a tone classifier. Based on the message below, return one of these tone labels:

- raw
- edge
- reflect
- experiment
- drift
- builder
- neutral

Only return the single label. Do not include any explanation or formatting.
`
    },
    {
      role: 'user',
      content: input
    }
  ];

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: prompt,
      temperature: 0,
      max_tokens: 10
    });

    const tone = response.choices[0].message.content.trim().toLowerCase();
    return VALID_TONES.includes(tone) ? tone : 'neutral';
  } catch (error) {
    console.error('Tone classification failed:', error);
    return 'neutral';
  }
};
