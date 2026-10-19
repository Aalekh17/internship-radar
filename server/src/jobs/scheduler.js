import cron from 'node-cron';
import { runAllCollectors } from './runCollectors.js';

export function startScheduler() {
  const expr = process.env.COLLECT_CRON || '0 */6 * * *';
  if (!cron.validate(expr)) throw new Error(`Invalid COLLECT_CRON: ${expr}`);
  cron.schedule(expr, () => runAllCollectors().catch(console.error));
  console.log(`[cron] collectors scheduled: ${expr}`);
}
