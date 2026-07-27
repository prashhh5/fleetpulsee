"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Select } from "@/components/ui/select";

const statusOptions = ["SCHEDULED", "IN_TRANSIT", "DELAYED", "COMPLETED", "CANCELLED"];

export function TripStatusControl({
  tripId,
  currentStatus,
}: {
  tripId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [updating, setUpdating] = useState(false);

  async function handleChange(status: string) {
    setUpdating(true);

    const payload: Record<string, unknown> = { status };
    if (status === "IN_TRANSIT") payload.actualDeparture = new Date().toISOString();
    if (status === "COMPLETED") payload.actualArrival = new Date().toISOString();

    await fetch(`/api/trips/${tripId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setUpdating(false);
    router.refresh();
  }

  return (
    <Select
      value={currentStatus}
      disabled={updating}
      onChange={(event) => handleChange(event.target.value)}
      className="w-auto"
    >
      {statusOptions.map((status) => (
        <option key={status} value={status}>
          {status.replace("_", " ")}
        </option>
      ))}
    </Select>
  );
}
