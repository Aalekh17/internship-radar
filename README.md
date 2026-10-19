# Internship Radar

Collects hiring signals, ranks them against your profile, and helps you draft personalised outreach.

## Week 1 status
- [x] Mongoose models (Profile, Opportunity, Company, Outreach)
- [x] Hacker News "Who is hiring" collector
- [x] Dedupe (hash) + keyword filter
- [x] Cron scheduler + manual run
- [x] REST API (list, filter, update status, trigger collect)

## Run locally
```bash
cd server
cp .env.example .env      # add your MongoDB Atlas URI
npm install
npm run test:parse        # offline sanity check
npm run collect           # run collectors once
npm run dev               # start API + scheduler on :5000
```

## API
- `GET  /api/health`
- `GET  /api/opportunities?status=new&remote=true&q=react&page=1`
- `PATCH /api/opportunities/:id/status`  body: `{ "status": "saved" }`
- `POST /api/opportunities/collect`

## Add a new collector
Create `server/src/collectors/<name>.js` exporting `SOURCE` and `collect()` that returns
`[{ title, company, source, url, description, ... }]`, then register it in `collectors/index.js`.
