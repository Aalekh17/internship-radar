// Collector: Hacker News "Ask HN: Who is hiring?" monthly threads.
// Uses the free HN Algolia API (no key needed).

import { htmlToText } from '../services/text.js';
import { isRelevant, detectRemote, detectPaid } from '../services/filter.js';

const BASE = 'https://hn.algolia.com/api/v1';
export const SOURCE = 'hn-whoishiring';

async function getJSON(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HN API ${res.status} for ${url}`);
  return res.json();
}

async function latestThreadIds(count = 2) {
  const url = `${BASE}/search_by_date?tags=story,author_whoishiring&query=${encodeURIComponent('Who is hiring')}&hitsPerPage=10`;
  const data = await getJSON(url);
  return data.hits
    .filter((h) => /who is hiring\?/i.test(h.title) && !/freelancer/i.test(h.title))
    .slice(0, count)
    .map((h) => h.objectID);
}

// HN posts usually start like: "Company | Role | Location | Remote"
export function parsePost(rawHtml, id, createdAt) {
  const text = htmlToText(rawHtml);
  const firstLine = text.split('\n')[0] || '';
  const parts = firstLine.split('|').map((s) => s.trim()).filter(Boolean);

  const company = parts[0]?.slice(0, 80) || 'Unknown';
  const title = (parts[1] || firstLine).slice(0, 140) || 'Hiring post';

  return {
    title,
    company,
    source: SOURCE,
    url: `https://news.ycombinator.com/item?id=${id}`,
    description: text,
    location: parts.find((p) => /remote|india|onsite|hybrid|,/i.test(p)) || undefined,
    remote: detectRemote(text),
    paidMentioned: detectPaid(text),
    postedAt: createdAt ? new Date(createdAt) : undefined,
  };
}

export async function collect() {
  const ids = await latestThreadIds(2);
  const results = [];

  for (const threadId of ids) {
    const thread = await getJSON(`${BASE}/items/${threadId}`);
    for (const c of thread.children || []) {
      if (!c.text) continue; // deleted or dead comment
      const post = parsePost(c.text, c.id, c.created_at);
      if (isRelevant(post.description)) results.push(post);
    }
  }
  return results;
}
