'use client'

import { useState } from 'react'
import dynamic from 'next/dynamic'
import { supabase } from '../../lib/supabaseClient'

// El mapa se carga solo en el navegador (Leaflet no funciona en el servidor)
const Mapa = dynamic(() => import('../../components/Mapa'), { ssr: false })

export default function Registro() {
  const [nombre, setNombre] = useState('')
  const [telefono, setTelefono] = useState('')
  const [descripcion, setDescripcion] = useState('')
  const [punto, setPunto] = useState(null)
  const [radio, setRadio] = useState(5)
  const [enviado, setEnviado] = useState(false)

  async function enviar() {
    if (!nombre || !telefono || !punto) {
      alert('Falta el nombre, teléfono, o marcar tu punto base en el mapa')
      return
    }
    const { error } = await supabase.from('lavacarros').insert({
      nombre,
      telefono,
      descripcion,
      base_lat: punto.lat,
      base_lng: punto.lng,
      radio_km: radio,
      estado: 'pendiente',
    })
    if (!error) setEnviado(true)
  }

  if (enviado) {
    return <p>¡Listo! Tu registro quedó pendiente de aprobación.</p>
  }

  return (
    <main style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>Registra tu servicio a domicilio</h1>

      <label>Tu nombre o nombre del servicio</label>
      <input value={nombre} onChange={(e) => setNombre(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />

      <label>Toca el mapa para marcar tu punto base</label>
      <Mapa punto={punto} radioKm={radio} onSeleccionarPunto={setPunto} />

      <label style={{ display: 'block', marginTop: 16 }}>Radio de cobertura: {radio} km</label>
      <input
        type="range"
        min="1"
        max="20"
        value={radio}
        onChange={(e) => setRadio(Number(e.target.value))}
        style={{ width: '100%', marginBottom: 16 }}
      />

      <label>Teléfono</label>
      <input value={telefono} onChange={(e) => setTelefono(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />

      <label>Descripción breve</label>
      <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} style={{ width: '100%', marginBottom: 16, padding: 8 }} />

      <button onClick={enviar} style={{ width: '100%', padding: 10 }}>Enviar para aprobación</button>
    </main>
  )
}
