import { z } from "zod";

export const vehicleSchema = z.object({
  registrationNumber: z.string().min(3, "Enter a registration number").max(20),
  type: z.enum(["TRUCK", "VAN", "BUS", "TWO_WHEELER"]),
  capacityKg: z.coerce.number().int().positive("Capacity must be a positive number"),
  status: z.enum(["ACTIVE", "MAINTENANCE", "INACTIVE"]).default("ACTIVE"),
});

export const driverSchema = z.object({
  name: z.string().min(2, "Enter a name").max(80),
  phone: z.string().min(7, "Enter a phone number").max(20),
  licenseNumber: z.string().min(4, "Enter a license number").max(40),
  status: z.enum(["AVAILABLE", "ON_TRIP", "OFF_DUTY"]).default("AVAILABLE"),
});

export const stopInputSchema = z.object({
  label: z.string().min(1, "Enter a stop label"),
  lat: z.coerce.number().min(-90).max(90),
  lng: z.coerce.number().min(-180).max(180),
  plannedArrival: z.coerce.date(),
});

export const tripSchema = z.object({
  vehicleId: z.string().min(1, "Choose a vehicle"),
  driverId: z.string().min(1).optional().nullable(),
  originLabel: z.string().min(1, "Enter an origin"),
  originLat: z.coerce.number().min(-90).max(90),
  originLng: z.coerce.number().min(-180).max(180),
  destinationLabel: z.string().min(1, "Enter a destination"),
  destinationLat: z.coerce.number().min(-90).max(90),
  destinationLng: z.coerce.number().min(-180).max(180),
  plannedDeparture: z.coerce.date(),
  plannedArrival: z.coerce.date(),
  distanceKm: z.coerce.number().positive().optional(),
  stops: z.array(stopInputSchema).optional().default([]),
});

export const tripStatusUpdateSchema = z.object({
  status: z.enum(["SCHEDULED", "IN_TRANSIT", "DELAYED", "COMPLETED", "CANCELLED"]),
  actualDeparture: z.coerce.date().optional(),
  actualArrival: z.coerce.date().optional(),
});

export type VehicleInput = z.infer<typeof vehicleSchema>;
export type DriverInput = z.infer<typeof driverSchema>;
export type TripInput = z.infer<typeof tripSchema>;
