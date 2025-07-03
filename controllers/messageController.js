import Message from '../models/Message.js';
import Session from '../models/Session.js';
import User from '../models/User.js';
import { getBotReply } from '../utils/gpt.js';
import { extractMessageMetadata } from '../utils/tagger.js';

const isGuest = (id) => typeof id === 'string' && id.startsWith('guest_');

export const addMessage = async (req, res) => {
  const { sessionId, text } = req.body;
  const userId = req.user.id || req.user.userId;

  try {
    // 1. Verify session access
    const session = await Session.findById(sessionId);
    if (!session || session.userId.toString() !== userId) {
      return res.status(404).json({ msg: 'Session not found or access denied' });
    }

    // 2. Save user message
    const userMsg = new Message({
      userId,
      sessionId,
      sender: 'user',
      text
    });
    await userMsg.save();

    // 3. Extract metadata and update message
    const meta = await extractMessageMetadata(text, session);
    userMsg.meta = meta;
    await userMsg.save();

    // 4. Update session
    session.messages.push(userMsg._id);
    session.updatedAt = new Date();
    await session.save();

    // 5. Get last 6 messages (for tone context)
    const lastMessages = await Message.find({ sessionId })
      .sort({ timestamp: -1 })
      .limit(6)
      .lean();

    // 6. Generate bot reply
const { botReply, toneMode } = await getBotReply({
  messages: lastMessages.reverse(),
  session
});

// 7. Save bot message
const botMsg = new Message({
  userId,
  sessionId,
  sender: 'bot',
  text: botReply // ✅ now this is a string
});
await botMsg.save();

session.messages.push(botMsg._id);
session.updatedAt = new Date();
session.toneMode = toneMode; // ✅ now you're saving the actual string mode
await session.save();

    // 8. Return both messages
    res.status(201).json({ userMsg, botMsg });
  } catch (err) {
    console.error('❌ Error in addMessage:', err);
    res.status(500).json({ msg: 'Error saving message or generating reply' });
  }
};
