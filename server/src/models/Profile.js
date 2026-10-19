import mongoose from 'mongoose';

const profileSchema = new mongoose.Schema(
  {
    name: String,
    skills: [String],
    targetRoles: [String],
    interests: [String],
    projects: [{ name: String, summary: String, url: String }],
    // Single paragraph describing you; used for embeddings in Week 2
    summaryText: String,
    embedding: { type: [Number], default: undefined },
  },
  { timestamps: true }
);

export default mongoose.model('Profile', profileSchema);
