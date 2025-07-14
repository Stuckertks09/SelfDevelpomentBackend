import Session from '../models/Session.js';

const isGuest = (id) => id?.startsWith('guest_');

export const getOrCreateSession = async (req, res) => {
  const { mode = 'Internal' } = req.body;
  const userId = (req.user?.id || req.user?.userId)?.toString() || null;

  try {
    let session;

    if (userId) {
      // Logged-in user: find existing session
      session = await Session.findOne({ userId, mode, isActive: true })
        .sort({ updatedAt: -1 })
        .populate({ path: 'messages', options: { sort: { timestamp: 1 } } });

      if (!session) {
        session = new Session({ userId, mode, title: `${mode} Session`, messages: [] });
        await session.save();
      }
    } else {
      // Guest user: always create new session (no userId)
      session = new Session({ mode, title: `${mode} Session`, messages: [] });
      await session.save();
    }

    res.json(session);
  } catch (err) {
    console.error('❌ Error in getOrCreateSession:', err);
    res.status(500).json({ msg: 'Error creating or fetching session' });
  }
};

export const getAllSessions = async (req, res) => {
  const userId = (req.user?.id || req.user?.userId)?.toString();
  if (isGuest(userId)) return res.status(403).json({ msg: 'Guests cannot access history' });

  const { mode, active } = req.query;
  const query = { userId };
  if (mode) query.mode = mode;
  if (active === 'true') query.isActive = true;
  if (active === 'false') query.isActive = false;

  try {
    const sessions = await Session.find(query)
      .sort({ updatedAt: -1 })
      .populate({ path: 'messages', options: { sort: { timestamp: 1 } } });
    res.json(sessions);
  } catch (err) {
    console.error('❌ Error in getAllSessions:', err);
    res.status(500).json({ msg: 'Failed to fetch sessions' });
  }
};

export const getSessionById = async (req, res) => {
  const userId = (req.user?.id || req.user?.userId)?.toString();
  const sessionId = req.params.id;

  try {
    const session = await Session.findById(sessionId).populate({
      path: 'messages',
      options: { sort: { timestamp: 1 } }
    });

    if (!session || session.userId !== userId) {
      return res.status(404).json({ msg: 'Session not found or access denied' });
    }

    res.json(session);
  } catch (err) {
    console.error('❌ Error in getSessionById:', err);
    res.status(500).json({ msg: 'Error retrieving session' });
  }
};

export const endSession = async (req, res) => {
  const userId = (req.user?.id || req.user?.userId)?.toString();
  const sessionId = req.params.sessionId;

  try {
    const session = await Session.findById(sessionId);
    if (!session || session.userId !== userId) {
      return res.status(404).json({ msg: 'Session not found or access denied' });
    }

    session.isActive = false;
    await session.save();

    res.json({ msg: 'Session ended' });
  } catch (err) {
    console.error('❌ Error in endSession:', err);
    res.status(500).json({ msg: 'Error ending session' });
  }
};
