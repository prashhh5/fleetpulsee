# FleetPulse

Fleet operations dashboard — track vehicles, drivers, and routes, with a daily AI-generated ops summary.

> **Status: early build.** This README grows into full setup, deployment, and API docs as the project gets finished. Right now it covers what exists: the data model, auth, and project foundation.

## What this is

A small logistics/fleet ops platform for a business running a delivery or transit fleet. An ops manager or dispatcher can:

- register vehicles and drivers
- schedule and track trips, stop by stop, on a map
- see a live dashboard of fleet status
- get a written daily summary of the day's operations, generated automatically

## Stack

- **Framework:** Next.js 16 (App Router), TypeScript, React 19
- **Styling:** Tailwind CSS v4
- **Database:** PostgreSQL via Prisma ORM 7
- **Auth:** Better Auth, email and password, sessions stored in the database
- **Maps:** Leaflet with free OpenStreetMap tiles (no API key needed)
- **AI digest:** Groq API

## Getting set up locally

1. Install dependencies:
   ```
   npm install
   ```
2. Copy `.env.example` to `.env` and fill in the values. Full instructions for getting each one land here as those pieces get built.
3. Push the schema to your database:
   ```
   npx prisma migrate dev --name init
   ```
4. Run the dev server:
   ```
   npm run dev
   ```

## Project structure so far

```
prisma/schema.prisma       the data model
src/lib/prisma.ts          database client
src/lib/auth.ts            auth server config
src/lib/auth-client.ts     auth client hooks
src/app/                   pages and API routes
```

More sections (deployment, CI/CD, full API reference, screenshots) get added as those parts are built.
