import { prisma } from "@/lib/prisma";
import { Card } from "@/components/ui/card";
import { StatusBadge } from "@/components/status-badge";
import { VehicleForm } from "./vehicle-form";

export default async function VehiclesPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { trips: true } } },
  });

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h1 className="text-2xl font-semibold text-paper">Vehicles</h1>
        <p className="text-sm text-fog">{vehicles.length} registered</p>
      </div>

      <Card>
        <p className="mb-4 font-mono text-xs uppercase tracking-widest text-fog">Add a vehicle</p>
        <VehicleForm />
      </Card>

      <Card className="p-0">
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="border-b border-line text-fog">
              <th className="px-6 py-3 font-normal">Registration</th>
              <th className="px-6 py-3 font-normal">Type</th>
              <th className="px-6 py-3 font-normal">Capacity</th>
              <th className="px-6 py-3 font-normal">Status</th>
              <th className="px-6 py-3 font-normal">Trips</th>
            </tr>
          </thead>
          <tbody>
            {vehicles.map((vehicle) => (
              <tr key={vehicle.id} className="border-b border-line last:border-0">
                <td className="px-6 py-3 font-mono text-paper">{vehicle.registrationNumber}</td>
                <td className="px-6 py-3 text-paper">{vehicle.type.replace("_", " ")}</td>
                <td className="px-6 py-3 text-paper">{vehicle.capacityKg} kg</td>
                <td className="px-6 py-3">
                  <StatusBadge status={vehicle.status} />
                </td>
                <td className="px-6 py-3 text-paper">{vehicle._count.trips}</td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-6 text-center text-fog">
                  No vehicles yet. Add the first one above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
