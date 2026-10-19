import mongoose from 'mongoose';

const companySchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    website: String,
    fundingNews: [{ title: String, url: String, date: Date }],
    techKeywords: [String],
    contactPage: String,
  },
  { timestamps: true }
);

export default mongoose.model('Company', companySchema);
