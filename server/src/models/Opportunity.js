import mongoose from 'mongoose';

export const STATUSES = ['new', 'saved', 'drafted', 'sent', 'replied', 'interview', 'rejected', 'skipped'];

const opportunitySchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    company: { type: String, default: 'Unknown' },
    source: { type: String, required: true }, // e.g. 'hn-whoishiring'
    url: { type: String, required: true },
    // sha256 of source + URL; prevents duplicates
    hash: { type: String, required: true, unique: true },
    description: { type: String, default: '' },
    location: String,
    remote: { type: Boolean, default: false },
    paidMentioned: { type: Boolean, default: false },
    postedAt: Date,
    // Filled in Week 2
    embedding: { type: [Number], default: undefined },
    score: { type: Number, default: 0 },
    scoreReasons: [String],
    status: { type: String, enum: STATUSES, default: 'new', index: true },
  },
  { timestamps: true }
);

opportunitySchema.index({ score: -1, postedAt: -1 });

export default mongoose.model('Opportunity', opportunitySchema);
