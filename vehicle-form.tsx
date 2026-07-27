"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

export function VehicleForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/vehicles", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        registrationNumber: form.get("registrationNumber"),
        type: form.get("type"),
        capacityKg: form.get("capacityKg"),
        status: form.get("status"),
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not add the vehicle. Try again.");
      return;
    }

    event.currentTarget.reset();
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 sm:grid-cols-4">
      <Input name="registrationNumber" placeholder="Registration number" required />
      <Select name="type" defaultValue="TRUCK" required>
        <option value="TRUCK">Truck</option>
        <option value="VAN">Van</option>
        <option value="BUS">Bus</option>
        <option value="TWO_WHEELER">Two wheeler</option>
      </Select>
      <Input name="capacityKg" type="number" placeholder="Capacity (kg)" min={1} required />
      <div className="flex gap-2">
        <Select name="status" defaultValue="ACTIVE" className="flex-1">
          <option value="ACTIVE">Active</option>
          <option value="MAINTENANCE">Maintenance</option>
          <option value="INACTIVE">Inactive</option>
        </Select>
        <Button type="submit" disabled={submitting}>
          {submitting ? "Adding…" : "Add"}
        </Button>
      </div>
      {error && <p className="text-sm text-alert sm:col-span-4">{error}</p>}
    </form>
  );
}
