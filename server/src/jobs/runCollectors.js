import Opportunity from '../models/Opportunity.js';
import { collectors } from '../collectors/index.js';
import { makeHash } from '../services/dedupe.js';

export async function runAllCollectors() {
  const summary = [];

  for (const c of collectors) {
    try {
      const items = await c.collect();
      if (items.length === 0) {
        summary.push({ source: c.SOURCE, found: 0, inserted: 0 });
        continue;
      }

      // $setOnInsert keeps existing docs untouched (preserves your status/notes)
      const ops = items.map((item) => {
        const hash = makeHash(item.source, item.url);
        return {
          updateOne: {
            filter: { hash },
            update: { $setOnInsert: { ...item, hash } },
            upsert: true,
          },
        };
      });

      const res = await Opportunity.bulkWrite(ops, { ordered: false });
      summary.push({ source: c.SOURCE, found: items.length, inserted: res.upsertedCount });
    } catch (err) {
      // One broken source should never stop the others
      console.error(`[collector:${c.SOURCE}] failed:`, err.message);
      summary.push({ source: c.SOURCE, error: err.message });
    }
  }

  console.log('[collect] done', JSON.stringify(summary));
  return summary;
}
