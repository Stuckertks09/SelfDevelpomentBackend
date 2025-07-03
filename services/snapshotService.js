import User from '../models/User.js';
import Message from '../models/Message.js';
import OpenAI from 'openai';

export const updatePersonalitySnapshot = async (userId) => {
  try {
    const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const messages = await Message.find({
      sender: 'user',
      sessionId: { $exists: true },
      userId
    })
      .sort({ timestamp: -1 })
      .limit(50)
      .lean();

    if (!messages.length) return null;

    const messageTexts = messages.map((m, i) => `${i + 1}. ${m.text}`).join('\n');

    const prompt = `
You are building a personality snapshot based on a user's journaling and reflective dialogue.

Based on the following recent entries, return a JSON object with:
- knownLoops: array of common patterns or thoughts (e.g., "delay", "inner critic")
- emotionalToneTendency: map of tones and weights (e.g., { "anxiety": 0.6, "hope": 0.3 })
- breakthroughs: short list of key insights or turning points
- typicalResistance: brief phrase describing how resistance shows up
- currentIdentityState: 1 sentence summarizing who the user is trying to become

User messages:
${messageTexts}

Return only valid JSON. Do not include any explanation or intro text.
`;

    const res = await openai.chat.completions.create({
      model: 'gpt-4o',
      messages: [{ role: 'user', content: prompt }],
      temperature: 0.4,
      max_tokens: 500
    });

    const raw = res.choices[0].message.content.trim();
    console.log('🧠 GPT raw:', raw);

    // 🧹 Clean: remove non-JSON prefix/suffix if GPT adds fluff
    const start = raw.indexOf('{');
    const end = raw.lastIndexOf('}');
    const cleaned = raw.slice(start, end + 1);

    let snapshot;
    try {
      snapshot = JSON.parse(cleaned);
    } catch (err) {
      console.error('❌ Snapshot JSON parse error:', cleaned);
      return null;
    }

    await User.findByIdAndUpdate(userId, {
      personalitySnapshot: snapshot
    });

    console.log('✅ Snapshot saved for user:', userId);
    return snapshot;
  } catch (err) {
    console.error('❌ Error updating snapshot:', err.message);
    return null;
  }
};
