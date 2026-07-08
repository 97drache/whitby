# Canada Family Trip Planner

A small family travel hub built with `Next.js`, `TypeScript`, and `Tailwind CSS`.

## Included

- Overview dashboard for the trip
- Day-by-day itinerary page
- Pre-departure checklist with browser-local progress saving
- Documents page locked by a family PIN
- Shared eTA / eTicket uploads for Yongwoon, Miyoung, Yireh, and Yiel
- Local info and emergency notes page

## Family documents security

- The Documents page asks for the family PIN before anything is shown
- Family PIN default is `0114`
- After unlock, uploaded files are shared with every family member who enters the same PIN
- Visitors without the PIN cannot view or download the documents
- On Vercel, files should be stored in private Blob storage (`BLOB_READ_WRITE_TOKEN`)
- In local development, files are saved under `.data/shared-docs` (gitignored)

## Environment variables

Set these in Vercel Project Settings -> Environment Variables:

```bash
FAMILY_PIN=0114
FAMILY_SESSION_SECRET=any-long-random-string
BLOB_READ_WRITE_TOKEN=your-vercel-blob-token
```

## Project structure

- `src/app/` - route pages and API routes
- `src/components/` - reusable UI
- `src/data/trip-data.ts` - trip content you can customize
- `src/lib/` - family auth and document storage helpers

## Run locally

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Customize your trip

Update these sections in `src/data/trip-data.ts`:

- `tripOverview` for destination, dates, and family members
- `itinerary` for daily schedule and reservation references
- `checklist` for family prep items
- `documents` / `uploadSlots` for document notes and upload slots
- `infoSections` for local numbers, addresses, and notes

## Quality checks

```bash
npm run lint
npm run build
```

## Deploy via Git

```bash
git add .
git commit -m "your message"
git push
```

If Vercel is connected to `https://github.com/97drache/whitby.git`, the push will trigger deployment.
