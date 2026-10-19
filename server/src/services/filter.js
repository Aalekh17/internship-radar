// Cheap keyword filter so we only store postings that could be internship-friendly.

const POSITIVE = /\b(intern|internship|interns|junior|entry[- ]level|fresher|freshers|student|new grad|graduate|apprentice|trainee)\b/i;
const NEGATIVE = /\b(senior|staff|principal|lead|director|vp|10\+ years|8\+ years|5\+ years)\b/i;

export function isRelevant(text) {
  if (!POSITIVE.test(text)) return false;
  // Skip senior-sounding headlines unless the headline also mentions interns
  const head = text.slice(0, 200);
  if (NEGATIVE.test(head) && !/\bintern/i.test(head)) return false;
  return true;
}

export function detectRemote(text) {
  return /\bremote\b/i.test(text);
}

export function detectPaid(text) {
  return /\b(paid|stipend|salary|compensation|\$\d|₹\s?\d|inr)\b/i.test(text);
}
