# Deployment guide

This walks through everything from "I have this folder of code" to "it's live on the internet and redeploys itself on every push." Follow it in order. Every command is meant to be copy-pasted exactly as written into a terminal, from inside the `fleetpulse` folder unless noted otherwise.

## 0. What you need before starting

- **Node.js 20 or newer.** Check with `node -v`. If that fails or shows an older version, install it from [nodejs.org](https://nodejs.org).
- **A GitHub account.**
- **A Vercel account** - sign up at [vercel.com](https://vercel.com) with your GitHub account, it's free for this.
- **A Groq account** - sign up at [console.groq.com](https://console.groq.com), also free.

## 1. Install dependencies

```
npm install
```

This also runs `prisma generate` automatically afterward (that's the `postinstall` script in `package.json`), which reads `prisma/schema.prisma` and generates the typed database client the app imports from `@/generated/prisma`.

## 2. Create a database

The easiest path, since it's built to pair directly with the ORM this project uses:

```
npx prisma init --db
```

This creates a free hosted Postgres database and prints a connection string. Copy it.

If you'd rather use something else (Neon, Vercel Postgres, Supabase, your own Postgres), that works too - you just need the connection string in the same `postgresql://...` format.

## 3. Set up your environment file

```
cp .env.example .env
```

Open `.env` and fill in:

- **`DATABASE_URL`** - the connection string from step 2.
- **`BETTER_AUTH_SECRET`** - generate one with:
  ```
  npx @better-auth/cli secret
  ```
  Paste the output in.
- **`BETTER_AUTH_URL`** - leave as `http://localhost:3000` for now.
- **`GROQ_API_KEY`** - from [console.groq.com/keys](https://console.groq.com/keys), click "Create API Key" and paste it in.

## 4. Create the database tables

```
npx prisma migrate deploy
```

This applies the migration already committed in `prisma/migrations/` to your database. If it fails for any reason, the guaranteed-to-work fallback is:

```
npx prisma db push
```

which reads `schema.prisma` directly and syncs your database to match it.

## 5. Load demo data (optional but recommended)

```
npx prisma db seed
```

This adds a few vehicles, drivers, and trips so the dashboard isn't empty the first time you look at it.

## 6. Run it locally

```
npm run dev
```

Open `http://localhost:3000`. Click "Create an account", sign up with any email and an 8+ character password, and you should land on the dashboard with the seeded data visible.

If something's broken, this is the point to fix it, before pushing anywhere.

## 7. Push the code to GitHub

If you've never used Git before, this is the whole sequence, run from inside the `fleetpulse` folder:

```
git init
git add .
git commit -m "Initial commit: FleetPulse foundation, auth, dashboard, API routes, CI/CD"
```

Then go to [github.com/new](https://github.com/new), create a new **empty** repository (don't check "Add a README", you already have one), name it `fleetpulse`, and copy the commands GitHub shows you under "…or push an existing repository from the command line". They'll look like:

```
git remote add origin https://github.com/YOUR-USERNAME/fleetpulse.git
git branch -M main
git push -u origin main
```

Refresh the GitHub page - your code should be there. `.env` will **not** be there, on purpose, `.gitignore` excludes it so your secrets never get committed.

## 8. Create the Vercel project

```
npm install --global vercel
vercel login
vercel link
```

`vercel link` will ask a few questions: choose "Link to existing project?" → **No**, then accept the defaults for project name and directory. This creates a `.vercel/project.json` file locally with your project and org IDs - you won't commit this file, it's already in `.gitignore`.

**Important:** don't separately import this repo through the Vercel dashboard's "Add New Project" flow. That would connect Vercel's own auto-deploy to your GitHub pushes, running at the same time as the GitHub Actions workflow below and deploying everything twice. `vercel link` alone is enough for what this project needs.

## 9. Add environment variables in Vercel

Go to your project on [vercel.com](https://vercel.com) → **Settings → Environment Variables**, and add these four, all scoped to **Production**:

| Key | Value |
|---|---|
| `DATABASE_URL` | same connection string from step 2 |
| `BETTER_AUTH_SECRET` | same value from step 3 |
| `BETTER_AUTH_URL` | your production URL, e.g. `https://fleetpulse-yourname.vercel.app` (Vercel shows you this after your first deploy - you can come back and fill this in once you know it) |
| `GROQ_API_KEY` | same value from step 3 |

## 10. Add the three GitHub Secrets

The GitHub Actions workflow at `.github/workflows/ci.yml` needs these to deploy on your behalf. In your GitHub repo, go to **Settings → Secrets and variables → Actions → New repository secret**, and add:

- **`VERCEL_TOKEN`** - from [vercel.com/account/tokens](https://vercel.com/account/tokens), click "Create Token", give it any name, no expiration needed for a portfolio project.
- **`VERCEL_ORG_ID`** - open the `.vercel/project.json` file that `vercel link` created locally, copy the `orgId` value.
- **`VERCEL_PROJECT_ID`** - same file, copy the `projectId` value.

None of these three are secrets the app itself uses at runtime, they exist only so GitHub Actions is allowed to deploy to your Vercel account. The four in step 9 are what the running app actually reads.

## 11. Ship it

```
git add .
git commit -m "Configure deployment"
git push
```

That push triggers `.github/workflows/ci.yml`: it lints, runs the unit tests, typechecks, builds, and - only if all of that passes and you're on `main` - deploys to Vercel. Watch it run under the **Actions** tab of your GitHub repo.

## 12. Verify

- The Actions tab shows a green check on the workflow run.
- Your Vercel dashboard shows a new Production deployment.
- Visiting the production URL shows the FleetPulse landing page, and signing up gets you into a working dashboard with the AI digest, the map, and all three CRUD sections.

From here, every `git push` to `main` that passes CI redeploys automatically. Nothing further to run by hand.
