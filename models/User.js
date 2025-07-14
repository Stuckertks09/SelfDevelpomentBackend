import mongoose from 'mongoose';

const personalitySnapshotSchema = new mongoose.Schema({
  knownLoops: [String], // e.g., ['inner critic', 'delay']
  emotionalToneTendency: {
    type: Map,
    of: Number // e.g., { anxiety: 0.6, hope: 0.4 }
  },
  breakthroughs: [String], // plain text e.g., ['Set boundary with boss']
  typicalResistance: String, // e.g., 'starts strong, fades'
  currentIdentityState: String // e.g., 'reinventing, still attached to past'
}, { _id: false }); // prevent sub-doc ID

const userSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  personalitySnapshot: personalitySnapshotSchema // <-- here
});

export default mongoose.model('User', userSchema, 'users');
