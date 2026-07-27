"use client";

import dynamic from "next/dynamic";
import type { MapTrip } from "@/components/fleet-map";

const FleetMap = dynamic(() => import("@/components/fleet-map").then((mod) => mod.FleetMap), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-2xl border border-line bg-surface text-sm text-fog">
      Loading map…
    </div>
  ),
});

export function FleetMapLoader({ trips }: { trips: MapTrip[] }) {
  return <FleetMap trips={trips} />;
}
