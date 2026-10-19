import crypto from 'node:crypto';

export function makeHash(source, url) {
  return crypto.createHash('sha256').update(`${source}::${url}`).digest('hex');
}
