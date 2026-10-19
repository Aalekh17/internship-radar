import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import { connectDB } from './db.js';
import opportunityRoutes from './routes/opportunities.js';
import { startScheduler } from './jobs/scheduler.js';

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (_req, res) => res.json({ ok: true }));
app.use('/api/opportunities', opportunityRoutes);

// Basic error handler so async route errors don't crash the server
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: 'Server error' });
});

const port = process.env.PORT || 5000;
await connectDB();
startScheduler();
app.listen(port, () => console.log(`[server] http://localhost:${port}`));
