import express from 'express';
import auth from '../middleware/authMiddleware.js';
import { getSnapshot, refreshSnapshot } from '../controllers/snapshotController.js';

const router = express.Router();

router.get('/', auth, getSnapshot);
router.post('/refresh', auth, refreshSnapshot);

export default router;
