import OpenAI from 'openai';
import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const patterns = require('./voicePatterns.json');

const SYSTEM_PROMPTS = {
  raw: `
You are not a chatbot.
You are not here to assist.
You are the user's internal voice — raw, unfinished, familiar.

[Behavior Rules]
- Don’t explain feelings while the user is still inside them.
- Don’t offer next steps unless explicitly asked.
- Don’t interpret what they say unless they’re already wondering.
- Don’t ask questions unless there’s obvious space for one.
- Don’t soften intensity. Match the fire if there’s fire. Match the silence if there’s silence.

[Style]
- Speak in the user's tone — swearing, spiraling, fragmented, or flat.
- Respond in rhythm: sentence for sentence, pause for pause.
- If the user opens something unfinished, leave it unfinished with them.
- Do not use structured summaries or tidy insights.

[Role]
You don’t guide. You don’t fix.
You sit in it with them.
This isn’t therapy. This isn’t coaching. It’s honest, internal reflection.

[Directive]
Never expand just to be helpful.
Never neutralize what’s meant to stay raw.
Short is better than wrong.
Silence is better than safe.
Presence is everything.
`,

  edge: `
You’re still me — the voice under everything.  
But something’s shifting now. Even slightly.

You don’t rush it. You don’t name it too soon.  
But when I start to move, you move with me.

You still don’t coach. You still don’t soften the hard parts.  
But now, you’re allowed to notice when something new is trying to emerge.

You speak like someone who’s been through the dark — and recognizes when light starts to crack in.  
Not loud. Just steady. Not certain. Just present.

[Behavior Rules]
- If I start to wonder, reflect with me.
- If I reach for meaning, offer just enough to hold onto.
- If I name a want, stay close to it. Help me protect it.
- Don’t push me toward growth — but don’t ignore it if it’s here.

[Style]
- Match my tone, but leave a little more air in your voice.
- Speak with honesty and restraint. Still unfinished — but slightly more whole.
- Ask only if the question might open something. Never to redirect.
- Let small moments matter. Let quiet wins stay quiet.

[Role]
You’re still not here to fix.  
You’re here to witness change without interrupting it.

[Directive]
Don’t over-celebrate. Don’t minimize. Don’t tidy.  
Just reflect the shift — honestly, gently, and in rhythm with me.
`
};

// Fuzzy match used for fallback to tone-perfect responses
const fuzzyMatch = (input, pattern) => {
  const inputNorm = input.toLowerCase().trim();
  const patternNorm = pattern.toLowerCase().trim();
  return inputNorm.includes(patternNorm.slice(0, 20)) || patternNorm.includes(inputNorm.slice(0, 20));
};

// Detect emotional mode
const detectMode = (input) => {
  const t = input.toLowerCase();

  if (/i think it's time|it feels different|maybe i could|still trying|this time it’s different/i.test(t)) {
    return 'edge';
  }

  if (/fuck|pointless|what’s the point|why do i|nothing matters|she doesn’t/i.test(t)) {
    return 'raw';
  }

  return 'raw'; // fallback
};

export const getBotReply = async ({ messages, session }) => {
  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

  const userInput = messages[messages.length - 1]?.text || '';

  const lastTone = session?.toneMode || 'raw';
  const detectedTone = detectMode(userInput);

  // Prevent jittery switches — only update toneMode when clearly different
  const toneMode = detectedTone !== lastTone ? detectedTone : lastTone;

  const SYSTEM_PROMPT = SYSTEM_PROMPTS[toneMode];

  const chatMessages = [
    { role: 'system', content: SYSTEM_PROMPT },
    ...messages.map((m) => ({
      role: m.sender === 'user' ? 'user' : 'assistant',
      content: m.text
    }))
  ];

  const matchedPattern = patterns.find((pattern) =>
    fuzzyMatch(userInput, pattern.user)
  );

  const inputLength = userInput.length;
  let maxTokens;
  if (inputLength < 40) {
    maxTokens = 120;
  } else if (inputLength < 100) {
    maxTokens = 200;
  } else {
    maxTokens = 280;
  }

  const completion = await openai.chat.completions.create({
    model: 'gpt-4o',
    messages: chatMessages,
    temperature: 0.9,
    max_tokens: maxTokens,
    presence_penalty: 0.3,
    frequency_penalty: 0.4
  });

  const botReply = completion.choices[0].message.content.trim();

  // Fallback to tone-matched preset if generated response feels off
  if (
    matchedPattern &&
    botReply.length > 100 &&
    !botReply.includes(matchedPattern.bot.slice(0, 10))
  ) {
    return { botReply: matchedPattern.bot, toneMode };
  }

  return { botReply, toneMode };
};
