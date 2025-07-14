import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: String, // All user IDs treated as strings (ObjectId or guest string)
    required: true
  },
  mode: {
    type: String,
    enum: ['Career', 'Relationship', 'Internal', 'Custom'],
    default: 'Internal'
  },
  toneMode: {
    type: String,
    enum: ['raw', 'edge', 'builder', 'experiment', 'drift', 'reflect', 'neutral'],
    default: 'neutral'
  },
  title: { type: String },
  summary: { type: String },
  isActive: { type: Boolean, default: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

export default mongoose.model('Session', sessionSchema);