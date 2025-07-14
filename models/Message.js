import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  sessionId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Session',
    required: true
  },
  userId: {
    type: String, // Unified string (ObjectId or guest_123)
    required: true
  },
  sender: {
    type: String,
    enum: ['user', 'bot'],
    required: true
  },
  text: { type: String, required: true },
  meta: {
    emotion: String,
    resistanceType: String,
    patternTag: String
  },
  timestamp: { type: Date, default: Date.now }
});

export default mongoose.model('Message', messageSchema);
