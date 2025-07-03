import express from 'express';
import { register, login } from '../controllers/authController.js';
import { createGuestToken } from '../controllers/authController.js';

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/ping', (req, res) => res.send('pong'));
router.post('/guest', createGuestToken);

export default router;
