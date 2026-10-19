// Small helpers for turning HTML-ish API text into clean plain text.

const ENTITIES = {
  '&amp;': '&', '&lt;': '<', '&gt;': '>', '&quot;': '"', '&#x27;': "'", '&#39;': "'",
  '&#x2F;': '/', '&nbsp;': ' ',
};

export function htmlToText(html = '') {
  return html
    .replace(/<p>/gi, '\n')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<a [^>]*href="([^"]+)"[^>]*>.*?<\/a>/gi, '$1')
    .replace(/<[^>]+>/g, '')
    .replace(/&(amp|lt|gt|quot|nbsp|#x27|#39|#x2F);/g, (m) => ENTITIES[m] ?? m)
    .replace(/[ \t]+/g, ' ')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}
