import mongoose from 'mongoose';

const sessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.Mixed, // Allows ObjectId or guest string
    required: true
  },
  mode: {
    type: String,
    enum: ['Career', 'Relationship', 'Internal', 'Custom'],
    default: 'Internal'
  },
  toneMode: {
    type: String,
    enum: ['raw', 'edge', 'builder', 'protective', 'float', 'rebuild'],
    default: 'raw'
  },
  title: { type: String },
  summary: { type: String },
  isActive: { type: Boolean, default: true },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Message' }],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});


export default mongoose.model('Session', sessionSchema);
