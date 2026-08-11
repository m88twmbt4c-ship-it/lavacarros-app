'use client'

import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet'
import 'leaflet/dist/leaflet.css'

function ClickHandler({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng)
    },
  })
  return null
}

export default function Mapa({ centro, punto, radioKm, onSeleccionarPunto }) {
  return (
    <MapContainer
      center={centro || [27.4863, -109.9407]}
      zoom={13}
      style={{ height: '260px', width: '100%', borderRadius: '8px' }}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution="&copy; OpenStreetMap contributors"
      />
      {onSeleccionarPunto && <ClickHandler onSelect={onSeleccionarPunto} />}
      {punto && <Marker position={[punto.lat, punto.lng]} />}
      {punto && radioKm && (
        <Circle center={[punto.lat, punto.lng]} radius={radioKm * 1000} />
      )}
    </MapContainer>
  )
}
