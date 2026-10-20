import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import Profile from '../models/Profile.js';

await connectDB();

await Profile.deleteMany({});
await Profile.create({
  name: 'Aalekh Vishwakarma',
  skills: ['React', 'Node.js', 'Express', 'MongoDB', 'Python', 'Machine Learning'],
  targetRoles: ['Full-stack intern', 'AI/ML intern', 'Software engineering intern'],
  interests: ['RAG', 'LLM applications', 'web development'],
  projects: [
    // Replace with your real projects and live URLs
    { name: 'Nutrofy', summary: 'One line on what it does and the tech used', url: 'https://...' },
  ],
  summaryText:
    'Full-stack and ML developer skilled in the MERN stack and machine learning. ' +
    'Interested in building AI-powered web apps such as RAG chatbots. ' +
    'Seeking a paid software or AI engineering internship.',
});

console.log('Profile saved');
await mongoose.disconnect();