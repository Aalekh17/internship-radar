// Run collectors manually: npm run collect
import 'dotenv/config';
import mongoose from 'mongoose';
import { connectDB } from '../db.js';
import { runAllCollectors } from './runCollectors.js';

await connectDB();
await runAllCollectors();
await mongoose.disconnect();
