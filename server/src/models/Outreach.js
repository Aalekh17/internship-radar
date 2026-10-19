import mongoose from 'mongoose';

const outreachSchema = new mongoose.Schema(
  {
    opportunity: { type: mongoose.Schema.Types.ObjectId, ref: 'Opportunity', required: true },
    subject: String,
    body: String,
    sentAt: Date,
    followUpAt: Date,
    outcome: {
      type: String,
      enum: ['draft', 'sent', 'no_reply', 'replied', 'interview', 'offer', 'rejected'],
      default: 'draft',
    },
  },
  { timestamps: true }
);

export default mongoose.model('Outreach', outreachSchema);
