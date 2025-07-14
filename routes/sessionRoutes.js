import express from 'express';
import auth from '../middleware/authMiddleware.js';
import {
  getOrCreateSession,
  getAllSessions,
  getSessionById,
  endSession
} from '../controllers/sessionController.js';

const router = express.Router();

router.post('/', getOrCreateSession); // Create or reuse session by mode
router.get('/', auth, getAllSessions); // Get all sessions (optionally filtered)
router.get('/:id', auth, getSessionById); // Get one session by ID
router.post('/:sessionId/end', auth, endSession); // End a session

export default router;
