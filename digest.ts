import { prisma } from "@/lib/prisma";
import { generateDigestSummary } from "@/lib/groq";

function startOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date: Date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

export interface Digest {
  forDate: Date;
  summary: string;
  totalTrips: number;
  delayedTrips: number;
  onTimeRate: number;
  generatedAt: Date;
}

// Returns today's digest, generating and caching it via Groq on the first
// call of the day. Every call after that is a plain database read, so the
// model only ever runs once per day, not once per dashboard load.
export async function getOrCreateDigest(): Promise<Digest> {
  const today = startOfDay(new Date());

  const cached = await prisma.opsDigest.findUnique({ where: { forDate: today } });
  if (cached) return cached;

  const trips = await prisma.trip.findMany({
    where: { plannedDeparture: { gte: today, lte: endOfDay(new Date()) } },
    include: { vehicle: true, driver: true },
  });

  if (trips.length === 0) {
    return {
      forDate: today,
      summary: "No trips are scheduled for today yet.",
      totalTrips: 0,
      delayedTrips: 0,
      onTimeRate: 0,
      generatedAt: new Date(),
    };
  }

  const delayedTrips = trips.filter((trip) => trip.status === "DELAYED").length;
  const completed = trips.filter((trip) => trip.status === "COMPLETED");
  const onTimeCompleted = completed.filter(
    (trip) => trip.actualArrival && trip.actualArrival <= trip.plannedArrival,
  ).length;
  const onTimeRate = completed.length > 0 ? onTimeCompleted / completed.length : 1;

  const tripSummaries = trips.map((trip) => {
    const driver = trip.driver?.name ?? "unassigned";
    return `${trip.vehicle.registrationNumber} (driver: ${driver}) - ${trip.originLabel} to ${trip.destinationLabel}, status: ${trip.status}`;
  });

  let summary: string;
  try {
    summary = await generateDigestSummary({
      date: today.toDateString(),
      totalTrips: trips.length,
      delayedTrips,
      onTimeRate,
      tripSummaries,
    });
  } catch (error) {
    console.error("Groq digest generation failed:", error);
    summary = `${trips.length} trips today, ${delayedTrips} delayed, ${Math.round(
      onTimeRate * 100,
    )}% on time so far. (AI summary unavailable right now - check that GROQ_API_KEY is set.)`;
  }

  return prisma.opsDigest.create({
    data: {
      forDate: today,
      summary,
      totalTrips: trips.length,
      delayedTrips,
      onTimeRate,
    },
  });
}
