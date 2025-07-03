import User from '../models/User.js';
import { updatePersonalitySnapshot } from '../services/snapshotService.js';

const isGuest = (id) => typeof id === 'string' && id.startsWith('guest_');

/**
 * GET current snapshot
 */
export const getSnapshot = async (req, res) => {
  const userId = req.user.id || req.user.userId;

  if (isGuest(userId)) {
    return res.status(403).json({ msg: 'Guests do not have personality snapshots' });
  }

  try {
    const user = await User.findById(userId).lean();
    res.json(user?.personalitySnapshot || {});
  } catch (err) {
    console.error('❌ Error fetching snapshot:', err);
    res.status(500).json({ msg: 'Could not fetch snapshot' });
  }
};

/**
 * POST refresh snapshot
 */
export const refreshSnapshot = async (req, res) => {
  const userId = req.user.id || req.user.userId;

  if (isGuest(userId)) {
    return res.status(403).json({ msg: 'Guests cannot refresh personality snapshots' });
  }

  try {
    const snapshot = await updatePersonalitySnapshot(userId);

    if (!snapshot) {
      return res.status(500).json({ msg: 'Snapshot generation failed' });
    }

    res.json({
      msg: 'Snapshot updated',
      personalitySnapshot: snapshot
    });
  } catch (err) {
    console.error('❌ Snapshot refresh error:', err);
    res.status(500).json({ msg: 'Snapshot update failed' });
  }
};
