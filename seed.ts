import { PrismaClient } from "../src/generated/prisma";
import { PrismaPg } from "@prisma/adapter-pg";

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL! });
const prisma = new PrismaClient({ adapter });

// Dates are computed relative to right now, so the seed data always looks
// like "today" no matter when someone actually runs this.
function hoursFromNow(hours: number) {
  return new Date(Date.now() + hours * 60 * 60 * 1000);
}

async function main() {
  console.log("Seeding FleetPulse...");

  await prisma.stop.deleteMany();
  await prisma.trip.deleteMany();
  await prisma.vehicle.deleteMany();
  await prisma.driver.deleteMany();

  const [truck1, van1, truck2, twoWheeler] = await Promise.all([
    prisma.vehicle.create({
      data: { registrationNumber: "DL-1AB-2345", type: "TRUCK", capacityKg: 8000, status: "ACTIVE" },
    }),
    prisma.vehicle.create({
      data: { registrationNumber: "DL-1AB-6721", type: "VAN", capacityKg: 1500, status: "ACTIVE" },
    }),
    prisma.vehicle.create({
      data: { registrationNumber: "HR-26-9981", type: "TRUCK", capacityKg: 10000, status: "MAINTENANCE" },
    }),
    prisma.vehicle.create({
      data: { registrationNumber: "DL-3C-4410", type: "TWO_WHEELER", capacityKg: 50, status: "ACTIVE" },
    }),
  ]);

  const [ramesh, suresh, anita] = await Promise.all([
    prisma.driver.create({
      data: { name: "Ramesh Yadav", phone: "9810000001", licenseNumber: "DL-0420110012345", status: "ON_TRIP" },
    }),
    prisma.driver.create({
      data: { name: "Suresh Kumar", phone: "9810000002", licenseNumber: "DL-0420110012346", status: "AVAILABLE" },
    }),
    prisma.driver.create({
      data: { name: "Anita Sharma", phone: "9810000003", licenseNumber: "DL-0420110012347", status: "ON_TRIP" },
    }),
  ]);

  // Finished yesterday, on time
  await prisma.trip.create({
    data: {
      vehicleId: truck1.id,
      driverId: ramesh.id,
      originLabel: "Okhla Phase 2 Warehouse",
      originLat: 28.5355,
      originLng: 77.2712,
      destinationLabel: "Sector 18 Noida",
      destinationLat: 28.5697,
      destinationLng: 77.326,
      plannedDeparture: hoursFromNow(-30),
      actualDeparture: hoursFromNow(-30),
      plannedArrival: hoursFromNow(-27),
      actualArrival: hoursFromNow(-27.2),
      distanceKm: 14.5,
      status: "COMPLETED",
    },
  });

  // Finished yesterday, late
  await prisma.trip.create({
    data: {
      vehicleId: van1.id,
      driverId: suresh.id,
      originLabel: "Gurgaon Cyber Hub",
      originLat: 28.495,
      originLng: 77.089,
      destinationLabel: "Manesar Industrial Area",
      destinationLat: 28.354,
      destinationLng: 76.935,
      plannedDeparture: hoursFromNow(-26),
      actualDeparture: hoursFromNow(-25.7),
      plannedArrival: hoursFromNow(-24),
      actualArrival: hoursFromNow(-22.8),
      distanceKm: 22.1,
      status: "COMPLETED",
    },
  });

  // In progress right now, with stops
  const inTransit = await prisma.trip.create({
    data: {
      vehicleId: truck1.id,
      driverId: ramesh.id,
      originLabel: "Okhla Phase 2 Warehouse",
      originLat: 28.5355,
      originLng: 77.2712,
      destinationLabel: "Connaught Place",
      destinationLat: 28.6315,
      destinationLng: 77.2167,
      plannedDeparture: hoursFromNow(-1),
      actualDeparture: hoursFromNow(-0.9),
      plannedArrival: hoursFromNow(1),
      distanceKm: 18.3,
      status: "IN_TRANSIT",
    },
  });

  await prisma.stop.createMany({
    data: [
      {
        tripId: inTransit.id,
        sequence: 1,
        label: "Lajpat Nagar Hub",
        lat: 28.5677,
        lng: 77.2434,
        plannedArrival: hoursFromNow(-0.2),
        actualArrival: hoursFromNow(-0.15),
        status: "ARRIVED",
      },
      {
        tripId: inTransit.id,
        sequence: 2,
        label: "India Gate Checkpoint",
        lat: 28.6129,
        lng: 77.2295,
        plannedArrival: hoursFromNow(0.4),
        status: "PENDING",
      },
    ],
  });

  // Running late right now
  await prisma.trip.create({
    data: {
      vehicleId: van1.id,
      driverId: anita.id,
      originLabel: "Faridabad Sector 24",
      originLat: 28.3915,
      originLng: 77.3105,
      destinationLabel: "Greater Noida Hub",
      destinationLat: 28.4744,
      destinationLng: 77.504,
      plannedDeparture: hoursFromNow(-3),
      actualDeparture: hoursFromNow(-2.5),
      plannedArrival: hoursFromNow(-0.5),
      distanceKm: 31.0,
      status: "DELAYED",
    },
  });

  // Scheduled for later today
  await prisma.trip.create({
    data: {
      vehicleId: twoWheeler.id,
      originLabel: "Okhla Phase 2 Warehouse",
      originLat: 28.5355,
      originLng: 77.2712,
      destinationLabel: "Saket District Centre",
      destinationLat: 28.5245,
      destinationLng: 77.2066,
      plannedDeparture: hoursFromNow(4),
      plannedArrival: hoursFromNow(5),
      distanceKm: 9.8,
      status: "SCHEDULED",
    },
  });

  console.log("Seeded 4 vehicles, 3 drivers, 5 trips (2 completed, 1 in transit, 1 delayed, 1 scheduled).");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
