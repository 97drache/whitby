# Canada Family Trip Planner

A small family travel hub built with `Next.js`, `TypeScript`, and `Tailwind CSS`.

## Included in this starter

- Overview dashboard for the trip
- Day-by-day itinerary page
- Pre-departure checklist with browser-local progress saving
- Travel document organizer page with browser-local file storage
- Local info and emergency notes page

## Project structure

- `src/app/` - route pages
- `src/components/` - reusable UI
- `src/data/trip-data.ts` - trip content you can customize

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
- `documents` for file links, booking confirmations, and status
- `infoSections` for local numbers, addresses, and notes

## Local document privacy

- Files uploaded on the Documents page stay in the browser on that device only
- Uploaded files are not sent to Vercel or any application server
- Other visitors to the deployed site cannot see those files
- Use the `Clear all local files` button after the trip if you want to remove them

## Quality checks

```bash
npm run lint
npm run build
```

## Vercel deployment

The app is ready for Vercel, but the current machine needs a valid Vercel login before the first deployment.

Once logged in, deploy from the project folder with:

```bash
npx vercel
```

For a production deployment:

```bash
npx vercel --prod
```
