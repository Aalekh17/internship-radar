// Offline sanity check (no DB or network): npm run test:parse
import assert from 'node:assert';
import { parsePost } from '../collectors/hn.js';
import { isRelevant } from './filter.js';
import { makeHash } from './dedupe.js';

const sample = 'Acme AI | ML Intern | Remote (India ok) | Paid stipend<p>We are hiring a <a href="https://acme.ai/jobs" rel="nofollow">student intern</a> to work on RAG &amp; React.';
const post = parsePost(sample, 123, '2026-10-01T00:00:00Z');

assert.equal(post.company, 'Acme AI');
assert.equal(post.title, 'ML Intern');
assert.equal(post.remote, true);
assert.equal(post.paidMentioned, true);
assert.ok(post.description.includes('RAG & React'));
assert.ok(isRelevant(post.description));
assert.equal(isRelevant('Senior Staff Engineer | Remote | 10+ years'), false);
assert.equal(makeHash('a', 'u'), makeHash('a', 'u'));
assert.notEqual(makeHash('a', 'u'), makeHash('b', 'u'));
console.log('All offline tests passed');
