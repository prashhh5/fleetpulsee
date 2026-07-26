import Link from "next/link";

const stats = [
  { label: "Vehicle status", value: "Live" },
  { label: "Manual check-in calls", value: "None" },
  { label: "Daily ops report", value: "Auto-generated" },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen">
      <header className="flex items-center justify-between px-6 py-6 md:px-12">
        <span className="font-mono text-sm tracking-widest text-fog">
          FLEETPULSE
        </span>
        <Link
          href="/sign-in"
          className="rounded-full border border-line px-4 py-2 text-sm text-paper transition hover:border-beacon hover:text-beacon"
        >
          Sign in
        </Link>
      </header>

      <section className="mx-auto flex max-w-5xl flex-col gap-10 px-6 pb-24 pt-12 md:px-12 md:pt-20">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-transit">
          Fleet operations
        </p>

        <h1 className="max-w-3xl text-4xl font-semibold leading-tight text-paper md:text-6xl">
          Stop calling drivers to ask where they are.
        </h1>

        <p className="max-w-xl text-lg text-fog">
          FleetPulse tracks every vehicle, route, and delivery window in one
          dashboard, and writes the day&apos;s ops summary for you.
        </p>

        <RoutePath />

        <div className="flex flex-wrap items-center gap-4">
          <Link
            href="/sign-up"
            className="rounded-full bg-beacon px-6 py-3 text-sm font-medium text-ink transition hover:opacity-90"
          >
            Create an account
          </Link>
          <Link
            href="/sign-in"
            className="text-sm text-fog underline-offset-4 transition hover:text-paper hover:underline"
          >
            I already have one
          </Link>
        </div>

        <dl className="grid grid-cols-1 gap-8 border-t border-line pt-10 sm:grid-cols-3">
          {stats.map((stat) => (
            <div key={stat.label}>
              <dt className="font-mono text-xs uppercase tracking-widest text-fog">
                {stat.label}
              </dt>
              <dd className="mt-2 text-3xl font-semibold text-paper">
                {stat.value}
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </main>
  );
}

function RoutePath() {
  const d = "M10 60 C 150 60, 150 20, 300 20 S 450 60, 590 60";

  return (
    <svg
      viewBox="0 0 600 80"
      className="h-16 w-full max-w-xl text-transit"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={d}
        stroke="currentColor"
        strokeWidth="2"
        strokeDasharray="6 8"
        opacity="0.4"
      />
      <circle cx="10" cy="60" r="4" fill="currentColor" />
      <circle cx="300" cy="20" r="4" fill="currentColor" />
      <circle cx="590" cy="60" r="4" fill="currentColor" />
      <circle r="5" fill="var(--color-beacon)">
        <animateMotion dur="6s" repeatCount="indefinite" path={d} />
      </circle>
    </svg>
  );
}
