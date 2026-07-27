"use client";

import { Fragment, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Polyline, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Leaflet's default marker icons reference image paths that don't survive
// a bundler. This points them at the package's own hosted assets instead
// of trying to make webpack/Turbopack bundle the images correctly.
function useLeafletIconFix() {
  useEffect(() => {
    // @ts-expect-error _getIconUrl is a private field Leaflet exposes for exactly this fix
    delete L.Icon.Default.prototype._getIconUrl;
    L.Icon.Default.mergeOptions({
      iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
      iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
      shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
    });
  }, []);
}

export interface MapTrip {
  id: string;
  status: string;
  originLabel: string;
  originLat: number;
  originLng: number;
  destinationLabel: string;
  destinationLat: number;
  destinationLng: number;
  vehicleLabel: string;
}

export function FleetMap({ trips }: { trips: MapTrip[] }) {
  useLeafletIconFix();

  const first = trips[0];
  const center: [number, number] = first ? [first.originLat, first.originLng] : [28.6139, 77.209];

  return (
    <MapContainer
      center={center}
      zoom={11}
      scrollWheelZoom={false}
      className="h-full w-full rounded-2xl"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {trips.map((trip) => (
        <Fragment key={trip.id}>
          <Marker position={[trip.originLat, trip.originLng]}>
            <Popup>
              {trip.vehicleLabel}: {trip.originLabel} to {trip.destinationLabel}
              <br />
              Status: {trip.status}
            </Popup>
          </Marker>
          <Marker position={[trip.destinationLat, trip.destinationLng]}>
            <Popup>Destination: {trip.destinationLabel}</Popup>
          </Marker>
          <Polyline
            positions={[
              [trip.originLat, trip.originLng],
              [trip.destinationLat, trip.destinationLng],
            ]}
            pathOptions={{
              color: trip.status === "DELAYED" ? "#d9603d" : "#4fb6a8",
              dashArray: "6 8",
              weight: 3,
            }}
          />
        </Fragment>
      ))}
    </MapContainer>
  );
}
