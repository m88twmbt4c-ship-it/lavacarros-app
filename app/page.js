'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabaseClient'

// Distancia entre dos puntos GPS en km (fórmula de Haversine)
function distanciaKm(lat1, lng1, lat2, lng2) {
  const R = 6371
  const dLat = ((lat2 - lat1) * Math.PI) / 180
  const dLng = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2
  return R * 2 * Math.asin(Math.sqrt(a))
}

export default function Home() {
  const [direccion, setDireccion] = useState('')
  const [resultados, setResultados] = useState(null)
  const [cargando, setCargando] = useState(false)

  async function buscarPorCoordenadas(lat, lng) {
    setCargando(true)
    const { data, error } = await supabase
      .from('lavacarros')
      .select('*')
      .eq('estado', 'aprobado')

    if (!error && data) {
      const conDistancia = data
        .map((l) => ({ ...l, distancia: distanciaKm(lat, lng, l.base_lat, l.base_lng) }))
        .filter((l) => l.distancia <= l.radio_km)
        .sort((a, b) => a.distancia - b.distancia)
      setResultados(conDistancia)
    }
    setCargando(false)
  }

  function usarMiUbicacion() {
    navigator.geolocation.getCurrentPosition((pos) => {
      buscarPorCoordenadas(pos.coords.latitude, pos.coords.longitude)
    })
  }

  async function buscarPorTexto() {
    if (!direccion) return
    setCargando(true)
    // Geocodificación gratuita con Nominatim (OpenStreetMap)
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(direccion)}`
    )
    const lugares = await res.json()
    if (lugares[0]) {
      buscarPorCoordenadas(parseFloat(lugares[0].lat), parseFloat(lugares[0].lon))
    } else {
      setCargando(false)
    }
  }

  return (
    <main style={{ maxWidth: 480, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>¿Dónde está tu carro?</h1>
      <div style={{ display: 'flex', gap: 8, marginBottom: 16 }}>
        <input
          type="text"
          placeholder="Colonia, calle..."
          value={direccion}
          onChange={(e) => setDireccion(e.target.value)}
          style={{ flex: 1, padding: 8 }}
        />
        <button onClick={buscarPorTexto}>Buscar</button>
        <button onClick={usarMiUbicacion}>Ubicarme</button>
      </div>

      {cargando && <p>Buscando...</p>}

      {resultados && resultados.length === 0 && <p>No hay lavacarros en tu zona todavía.</p>}

      {resultados &&
        resultados.map((l) => (
          <div
            key={l.id}
            style={{
              background: 'white',
              borderRadius: 12,
              padding: 16,
              marginBottom: 10,
              border: '1px solid #e5e5e0',
            }}
          >
            <p style={{ fontWeight: 500, margin: 0 }}>{l.nombre}</p>
            <p style={{ fontSize: 13, color: '#666', margin: '4px 0' }}>
              a {l.distancia.toFixed(1)} km
            </p>
            <a href={`/perfil/${l.id}`} style={{ marginRight: 12 }}>Ver perfil</a>
            <a href={`tel:${l.telefono}`}>Llamar: {l.telefono}</a>
          </div>
        ))}
    </main>
  )
}
