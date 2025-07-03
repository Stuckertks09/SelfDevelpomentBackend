import Session from '../models/Session.js';

// Helper to detect guest
const isGuest = (id) => typeof id === 'string' && id.startsWith('guest_');

/**
 * GET or create the most recent active session by mode
 */
export const getOrCreateSession = async (req, res) => {
  const { mode } = req.body;
  const userId = req.user.id || req.user.userId;

  try {
    let session = await Session.findOne({ userId, mode, isActive: true })
      .sort({ updatedAt: -1 })
      .populate({ path: 'messages', options: { sort: { timestamp: 1 } } });

    if (!session) {
      session = new Session({
        userId,
        mode,
        title: `${mode} Session`,
        messages: []
      });
      await session.save();
    }

    res.json(session);
  } catch (err) {
    console.error('❌ Error fetching/creating session:', err);
    res.status(500).json({ msg: 'Error fetching or creating session' });
  }
};

/**
 * GET all sessions (optionally filtered by mode or activity)
 */
export const getAllSessions = async (req, res) => {
  const userId = req.user.id || req.user.userId;
  const { mode, active } = req.query;

  // Guests can’t access past sessions
  if (isGuest(userId)) {
    return res.status(403).json({ msg: 'Guests cannot access session history' });
  }

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
    console.error('❌ Error fetching sessions:', err);
    res.status(500).json({ msg: 'Error fetching sessions' });
  }
};

/**
 * GET a single session by ID
 */
export const getSessionById = async (req, res) => {
  const userId = req.user.id || req.user.userId;

  try {
    const session = await Session.findOne({
      _id: req.params.id,
      userId
    }).populate({ path: 'messages', options: { sort: { timestamp: 1 } } });

    if (!session) return res.status(404).json({ msg: 'Session not found' });

    res.json(session);
  } catch (err) {
    console.error('❌ Error retrieving session by ID:', err);
    res.status(500).json({ msg: 'Error retrieving session' });
  }
};

/**
 * Mark a session as inactive
 */
export const endSession = async (req, res) => {
  const userId = req.user.id || req.user.userId;

  try {
    const session = await Session.findOne({
      _id: req.params.sessionId,
      userId
    });

    if (!session) return res.status(404).json({ msg: 'Session not found' });

    session.isActive = false;
    await session.save();

    res.json({ msg: 'Session marked inactive' });
  } catch (err) {
    console.error('❌ Error ending session:', err);
    res.status(500).json({ msg: 'Failed to end session' });
  }
};
