"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { Button } from "@/components/ui/button";

interface VehicleOption {
  id: string;
  registrationNumber: string;
}

interface DriverOption {
  id: string;
  name: string;
}

interface StopDraft {
  label: string;
  lat: string;
  lng: string;
  plannedArrival: string;
}

const emptyStop = (): StopDraft => ({ label: "", lat: "", lng: "", plannedArrival: "" });

export function TripForm({
  vehicles,
  drivers,
}: {
  vehicles: VehicleOption[];
  drivers: DriverOption[];
}) {
  const router = useRouter();
  const [stops, setStops] = useState<StopDraft[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    const form = new FormData(event.currentTarget);

    const response = await fetch("/api/trips", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        vehicleId: form.get("vehicleId"),
        driverId: form.get("driverId") || null,
        originLabel: form.get("originLabel"),
        originLat: form.get("originLat"),
        originLng: form.get("originLng"),
        destinationLabel: form.get("destinationLabel"),
        destinationLat: form.get("destinationLat"),
        destinationLng: form.get("destinationLng"),
        plannedDeparture: form.get("plannedDeparture"),
        plannedArrival: form.get("plannedArrival"),
        distanceKm: form.get("distanceKm") || undefined,
        stops: stops
          .filter((stop) => stop.label && stop.lat && stop.lng && stop.plannedArrival)
          .map((stop) => ({
            label: stop.label,
            lat: stop.lat,
            lng: stop.lng,
            plannedArrival: stop.plannedArrival,
          })),
      }),
    });

    setSubmitting(false);

    if (!response.ok) {
      const body = await response.json().catch(() => null);
      setError(body?.error ?? "Could not schedule the trip. Check the fields and try again.");
      return;
    }

    event.currentTarget.reset();
    setStops([]);
    router.refresh();
  }

  function updateStop(index: number, patch: Partial<StopDraft>) {
    setStops((prev) => prev.map((stop, i) => (i === index ? { ...stop, ...patch } : stop)));
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid gap-3 sm:grid-cols-2">
        <Select name="vehicleId" required defaultValue="">
          <option value="" disabled>
            Choose a vehicle
          </option>
          {vehicles.map((vehicle) => (
            <option key={vehicle.id} value={vehicle.id}>
              {vehicle.registrationNumber}
            </option>
          ))}
        </Select>
        <Select name="driverId" defaultValue="">
          <option value="">Unassigned</option>
          {drivers.map((driver) => (
            <option key={driver.id} value={driver.id}>
              {driver.name}
            </option>
          ))}
        </Select>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="originLabel" placeholder="Origin label" required />
        <Input name="originLat" type="number" step="any" placeholder="Origin latitude" required />
        <Input name="originLng" type="number" step="any" placeholder="Origin longitude" required />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="destinationLabel" placeholder="Destination label" required />
        <Input
          name="destinationLat"
          type="number"
          step="any"
          placeholder="Destination latitude"
          required
        />
        <Input
          name="destinationLng"
          type="number"
          step="any"
          placeholder="Destination longitude"
          required
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        <Input name="plannedDeparture" type="datetime-local" required />
        <Input name="plannedArrival" type="datetime-local" required />
        <Input name="distanceKm" type="number" step="any" placeholder="Distance (km, optional)" />
      </div>

      <div className="flex flex-col gap-3 rounded-lg border border-line p-4">
        <div className="flex items-center justify-between">
          <p className="font-mono text-xs uppercase tracking-widest text-fog">Stops (optional)</p>
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStops((prev) => [...prev, emptyStop()])}
          >
            Add stop
          </Button>
        </div>
        {stops.map((stop, index) => (
          <div key={index} className="grid gap-2 sm:grid-cols-4">
            <Input
              placeholder="Stop label"
              value={stop.label}
              onChange={(event) => updateStop(index, { label: event.target.value })}
            />
            <Input
              placeholder="Latitude"
              type="number"
              step="any"
              value={stop.lat}
              onChange={(event) => updateStop(index, { lat: event.target.value })}
            />
            <Input
              placeholder="Longitude"
              type="number"
              step="any"
              value={stop.lng}
              onChange={(event) => updateStop(index, { lng: event.target.value })}
            />
            <Input
              type="datetime-local"
              value={stop.plannedArrival}
              onChange={(event) => updateStop(index, { plannedArrival: event.target.value })}
            />
          </div>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="submit" disabled={submitting}>
          {submitting ? "Scheduling…" : "Schedule trip"}
        </Button>
        {error && <p className="text-sm text-alert">{error}</p>}
      </div>
    </form>
  );
}
