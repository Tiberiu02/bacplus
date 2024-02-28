"use client";

import dynamic from "next/dynamic";

const MapContainer = dynamic(
  () => import("react-leaflet").then((m) => m.MapContainer),
  {
    ssr: false,
  }
);
const CircleMarker = dynamic(
  () => import("react-leaflet").then((m) => m.CircleMarker),
  {
    ssr: false,
  }
);
const Popup = dynamic(() => import("react-leaflet").then((m) => m.Popup), {
  ssr: false,
});
const TileLayer = dynamic(
  () => import("react-leaflet").then((m) => m.TileLayer),
  {
    ssr: false,
  }
);

import MarkerIcon from "leaflet/dist/images/marker-icon.png";

import type { Icon } from "leaflet";
import { useEffect, useState } from "react";
import Link from "next/link";

export function Harta({
  data,
}: {
  data: {
    id: string;
    nume: string;
    liceu: boolean;
    gimnaziu: boolean;
    judet: string;
    long: number;
    lat: number;
    icon: boolean;
  }[];
}) {
  const [icon, setIcon] = useState<Icon | null>(null);

  useEffect(() => {
    void (async () => {
      const { Icon } = await import("leaflet");

      setIcon(
        new Icon({
          iconUrl: MarkerIcon.src,
          iconSize: [25, 41],
          iconAnchor: [12, 41],
        })
      );
    })();
  }, []);

  return (
    <MapContainer
      center={[44.44, 26.1025384]}
      zoom={12}
      className="relative h-full w-screen"
    >
      <TileLayer
        attribution='&copy; <a target="_blank" href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors | BAC+'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        detectRetina={true}
      />
      {icon &&
        data.map((institutie) => (
          <CircleMarker
            key={institutie.id}
            center={[institutie.lat, institutie.long]}
            radius={6}
            color={institutie.liceu ? "#E22" : "#2A2"}
            fillColor={institutie.liceu ? "#E88" : "#8C8"}
            fillOpacity={0.8}
            weight={4}
          >
            <Popup>
              <div className="flex w-[12rem] flex-col items-center text-center [text-wrap:balance]">
                {institutie.icon && (
                  <img
                    src={"/icons-lg/" + institutie.id + ".webp"}
                    className="mb-2 h-12 w-12"
                  />
                )}
                <div className="font-bold">{institutie.nume}</div>
                {institutie.liceu && institutie.gimnaziu && (
                  <div className="italic">liceu și gimnaziu</div>
                )}
                <div>
                  <Link
                    href={
                      institutie.liceu
                        ? `/liceu/${institutie.id}`
                        : `/scoala/${institutie.id}`
                    }
                    target="_blank"
                  >
                    Detalii
                  </Link>
                </div>
              </div>
            </Popup>
          </CircleMarker>
        ))}
    </MapContainer>
  );
}
