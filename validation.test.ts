import { describe, expect, it } from "vitest";
import { vehicleSchema, driverSchema, tripSchema } from "./validation";

describe("vehicleSchema", () => {
  it("accepts a valid vehicle", () => {
    const result = vehicleSchema.safeParse({
      registrationNumber: "DL-1AB-2345",
      type: "TRUCK",
      capacityKg: 5000,
      status: "ACTIVE",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a negative capacity", () => {
    const result = vehicleSchema.safeParse({
      registrationNumber: "DL-1AB-2345",
      type: "TRUCK",
      capacityKg: -10,
    });
    expect(result.success).toBe(false);
  });

  it("rejects an unknown vehicle type", () => {
    const result = vehicleSchema.safeParse({
      registrationNumber: "DL-1AB-2345",
      type: "SUBMARINE",
      capacityKg: 5000,
    });
    expect(result.success).toBe(false);
  });
});

describe("driverSchema", () => {
  it("accepts a valid driver", () => {
    const result = driverSchema.safeParse({
      name: "Ramesh Yadav",
      phone: "9810000001",
      licenseNumber: "DL-0420110012345",
    });
    expect(result.success).toBe(true);
  });

  it("rejects a name that is too short", () => {
    const result = driverSchema.safeParse({
      name: "R",
      phone: "9810000001",
      licenseNumber: "DL-0420110012345",
    });
    expect(result.success).toBe(false);
  });
});

describe("tripSchema", () => {
  const baseTrip = {
    vehicleId: "vehicle_1",
    originLabel: "Warehouse",
    originLat: 28.5,
    originLng: 77.2,
    destinationLabel: "Depot",
    destinationLat: 28.6,
    destinationLng: 77.3,
    plannedDeparture: "2026-08-01T09:00:00.000Z",
    plannedArrival: "2026-08-01T11:00:00.000Z",
  };

  it("accepts a trip with no stops", () => {
    const result = tripSchema.safeParse(baseTrip);
    expect(result.success).toBe(true);
  });

  it("accepts a trip with stops", () => {
    const result = tripSchema.safeParse({
      ...baseTrip,
      stops: [
        {
          label: "Checkpoint",
          lat: 28.55,
          lng: 77.25,
          plannedArrival: "2026-08-01T10:00:00.000Z",
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects an out-of-range latitude", () => {
    const result = tripSchema.safeParse({ ...baseTrip, originLat: 200 });
    expect(result.success).toBe(false);
  });
});
