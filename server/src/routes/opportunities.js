import { Router } from 'express';
import Opportunity, { STATUSES } from '../models/Opportunity.js';
import { runAllCollectors } from '../jobs/runCollectors.js';

const router = Router();
const escapeRegex = (s) => String(s).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

// GET /api/opportunities?status=new&remote=true&q=react&page=1&limit=20
router.get('/', async (req, res) => {
  const { status, remote, q, source, kind } = req.query;
  const page = Math.max(parseInt(req.query.page) || 1, 1);
  const limit = Math.min(parseInt(req.query.limit) || 20, 100);
  const filter = {};
  if (kind) filter.kind = String(kind);
  if (status) filter.status = String(status);
  if (source) filter.source = String(source);
  if (remote === 'true') filter.remote = true;
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ title: rx }, { description: rx }];
  }

  const [items, total] = await Promise.all([
    Opportunity.find(filter, '-embedding')
      .sort({ score: -1, postedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit),
    Opportunity.countDocuments(filter),
  ]);
  res.json({ items, total, page, pages: Math.ceil(total / limit) });
});

// PATCH /api/opportunities/:id/status  { "status": "saved" }
router.patch('/:id/status', async (req, res) => {
  const { status } = req.body;
  if (!STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status' });
  const doc = await Opportunity.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, select: '-embedding' }
  );
  if (!doc) return res.status(404).json({ error: 'Not found' });
  res.json(doc);
});

// POST /api/opportunities/collect  -> run collectors right now
router.post('/collect', async (_req, res) => {
  res.json(await runAllCollectors());
});

export default router;
