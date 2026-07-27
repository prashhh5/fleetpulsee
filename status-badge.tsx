import { cn } from "@/lib/cn";

const statusStyles: Record<string, string> = {
  ACTIVE: "bg-transit/15 text-transit",
  AVAILABLE: "bg-transit/15 text-transit",
  SCHEDULED: "bg-transit/15 text-transit",
  COMPLETED: "bg-transit/15 text-transit",
  ARRIVED: "bg-transit/15 text-transit",

  ON_TRIP: "bg-beacon/15 text-beacon",
  IN_TRANSIT: "bg-beacon/15 text-beacon",
  PENDING: "bg-beacon/15 text-beacon",

  MAINTENANCE: "bg-alert/15 text-alert",
  DELAYED: "bg-alert/15 text-alert",
  CANCELLED: "bg-alert/15 text-alert",

  INACTIVE: "bg-fog/15 text-fog",
  OFF_DUTY: "bg-fog/15 text-fog",
  SKIPPED: "bg-fog/15 text-fog",
};

export function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 font-mono text-xs uppercase tracking-wide",
        statusStyles[status] ?? "bg-fog/15 text-fog",
      )}
    >
      {status.replace(/_/g, " ")}
    </span>
  );
}
