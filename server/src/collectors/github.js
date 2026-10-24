// Collector: GitHub issues labeled "good first issue" in your stack.
// Uses the official GitHub search API. Unauthenticated limit is about 10
// search requests per minute; we make 3 per run. Add GITHUB_TOKEN to .env
// for a higher limit (optional).

export const SOURCE = 'github-gfi';
const LANGUAGES = ['javascript', 'typescript', 'python'];

async function searchIssues(language) {
  const q = `label:"good first issue" state:open is:issue no:assignee language:${language}`;
  const params = new URLSearchParams({ q, sort: 'created', order: 'desc', per_page: '30' });

  const headers = {
    Accept: 'application/vnd.github+json',
    'User-Agent': 'internship-radar',
  };
  if (process.env.GITHUB_TOKEN) headers.Authorization = `Bearer ${process.env.GITHUB_TOKEN}`;

  const res = await fetch(`https://api.github.com/search/issues?${params}`, { headers });
  if (!res.ok) throw new Error(`GitHub API ${res.status} for ${language}`);
  const data = await res.json();
  return data.items || [];
}

export async function collect() {
  const results = [];

  for (const lang of LANGUAGES) {
    const issues = await searchIssues(lang);
    for (const issue of issues) {
      // repository_url looks like https://api.github.com/repos/owner/name
      const [owner, repo] = issue.repository_url.split('/').slice(-2);

      results.push({
        title: String(issue.title).slice(0, 140),
        company: `${owner}/${repo}`,
        source: SOURCE,
        kind: 'open-source',
        url: issue.html_url,
        description: (issue.body || '').slice(0, 2000),
        location: 'Remote',
        remote: true,
        paidMentioned: false,
        postedAt: new Date(issue.created_at),
      });
    }
  }
  return results;
}