# API reference

Every route below lives under `src/app/api/` and is a Next.js Route Handler. All of them require an active session (the Better Auth session cookie); calling any of them signed out returns:

```json
{ "error": "Not signed in" }
```
with HTTP status `401`.

Dates are ISO 8601 strings. IDs are strings (cuids).

## Vehicles

### `GET /api/vehicles`
Returns every vehicle, most recently created first.

**200** → `Vehicle[]`

### `POST /api/vehicles`
Creates a vehicle.

**Body**
```json
{
  "registrationNumber": "DL-1AB-2345",
  "type": "TRUCK",
  "capacityKg": 8000,
  "status": "ACTIVE"
}
```
`type` is one of `TRUCK | VAN | BUS | TWO_WHEELER`. `status` is one of `ACTIVE | MAINTENANCE | INACTIVE` and defaults to `ACTIVE` if omitted.

**201** → the created `Vehicle`
**400** → `{ "error": "Invalid vehicle data", "issues": ... }` (Zod's flattened error shape)

### `PATCH /api/vehicles/:id`
Partial update, same body shape as `POST`, all fields optional.

**200** → the updated `Vehicle`

### `DELETE /api/vehicles/:id`
**200** → `{ "success": true }`
**409** → if the vehicle still has trips referencing it (deletes are `RESTRICT`ed at the database level on purpose - reassign or remove those trips first)

## Drivers

### `GET /api/drivers`
Returns every driver, most recently created first.

### `POST /api/drivers`
```json
{
  "name": "Ramesh Yadav",
  "phone": "9810000001",
  "licenseNumber": "DL-0420110012345",
  "status": "AVAILABLE"
}
```
`status` is one of `AVAILABLE | ON_TRIP | OFF_DUTY`.

### `PATCH /api/drivers/:id`
Partial update, same shape as `POST`.

### `DELETE /api/drivers/:id`
**200** → `{ "success": true }`. Unlike vehicles, deleting a driver does not fail if they have trips - their trips just become unassigned (`driverId` is set to `null`).

## Trips

### `GET /api/trips`
Returns every trip with its `vehicle`, `driver`, and `stops` (ordered by sequence) included.

### `POST /api/trips`
```json
{
  "vehicleId": "clv...",
  "driverId": "clv... or null",
  "originLabel": "Okhla Phase 2 Warehouse",
  "originLat": 28.5355,
  "originLng": 77.2712,
  "destinationLabel": "Connaught Place",
  "destinationLat": 28.6315,
  "destinationLng": 77.2167,
  "plannedDeparture": "2026-08-01T09:00:00.000Z",
  "plannedArrival": "2026-08-01T11:00:00.000Z",
  "distanceKm": 18.3,
  "stops": [
    { "label": "Checkpoint", "lat": 28.55, "lng": 77.25, "plannedArrival": "2026-08-01T10:00:00.000Z" }
  ]
}
```
`stops` is optional. Sequence numbers are assigned automatically from array order, starting at 1.

**201** → the created `Trip`, with `stops`, `vehicle`, and `driver` included

### `PATCH /api/trips/:id`
Used for status changes, not full edits.
```json
{ "status": "IN_TRANSIT", "actualDeparture": "2026-08-01T09:05:00.000Z" }
```
`status` is one of `SCHEDULED | IN_TRANSIT | DELAYED | COMPLETED | CANCELLED`. `actualDeparture` / `actualArrival` are optional - the dashboard's status control sets them automatically when you move a trip to `IN_TRANSIT` or `COMPLETED`.

### `DELETE /api/trips/:id`
**200** → `{ "success": true }`. Cascades to delete the trip's stops.

## Digest

### `GET /api/digest`
Returns today's AI-generated ops summary, generating it via Groq on the first call of the day and reading a cached row every call after that.

**200**
```json
{
  "forDate": "2026-07-26T00:00:00.000Z",
  "summary": "3 trips today, 1 delayed...",
  "totalTrips": 3,
  "delayedTrips": 1,
  "onTimeRate": 0.5,
  "generatedAt": "2026-07-26T06:12:00.000Z"
}
```

If `GROQ_API_KEY` is missing or the Groq call fails, this still returns `200` with a summary computed directly from the trip data instead of failing the request.
