import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline, useMap } from 'react-leaflet';
import L from 'leaflet';

const createIcon = (bg, emoji) =>
  L.divIcon({
    className: 'fb-marker',
    html: `<div style="background:${bg};width:32px;height:32px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:15px;border:2px solid #fff;box-shadow:0 4px 10px rgba(0,0,0,.25)">${emoji}</div>`,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -16],
  });

const shelterIcon = createIcon('#1A804D', '📍');
const riderIcon = createIcon('#2563EB', '🚴');
const pickupIcon = createIcon('#F97316', '🍲');

function FlyTo({ center, zoom }) {
  const map = useMap();
  if (center) map.flyTo(center, zoom || map.getZoom(), { duration: 0.6 });
  return null;
}

/**
 * Light-themed map used by Nearby Shelters and live rider tracking.
 */
export default function ShelterMap({
  shelters = [],
  rider = null,
  routeLine = [],
  height = 220,
  focus = null,
  zoom = 13,
}) {
  const center = focus || shelters[0]?.location || { lat: 19.1355, lng: 72.8265 };

  return (
    <div className="rounded-2xl overflow-hidden border border-line" style={{ height }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={zoom}
        zoomControl={false}
        attributionControl
        style={{ height: '100%', width: '100%' }}
        scrollWheelZoom={false}
      >
        <TileLayer
          url="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <FlyTo center={focus} zoom={zoom} />
        {shelters.map(s => (
          <Marker key={s.id} position={[s.location.lat, s.location.lng]} icon={shelterIcon} />
        ))}
        {rider && (
          <Marker position={[rider.location.lat, rider.location.lng]} icon={riderIcon} />
        )}
        {routeLine.length > 1 && (
          <Polyline
            positions={routeLine.map(p => [p.lat, p.lng])}
            pathOptions={{ color: '#2563EB', weight: 4, opacity: 0.85, dashArray: '8 8' }}
          />
        )}
      </MapContainer>
    </div>
  );
}
