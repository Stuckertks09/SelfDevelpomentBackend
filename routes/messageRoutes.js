import express from 'express';
import { addMessage } from '../controllers/messageController.js';
import auth from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', auth, addMessage); // POST /api/messages

export default router;
