'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../../../lib/supabaseClient'

export default function Perfil({ params }) {
  const [lavacarros, setLavacarros] = useState(null)
  const [calificaciones, setCalificaciones] = useState([])
  const [estrellas, setEstrellas] = useState(5)
  const [comentario, setComentario] = useState('')

  useEffect(() => {
    cargar()
  }, [])

  async function cargar() {
    const { data: l } = await supabase.from('lavacarros').select('*').eq('id', params.id).single()
    setLavacarros(l)
    const { data: c } = await supabase.from('calificaciones').select('*').eq('lavacarros_id', params.id)
    setCalificaciones(c || [])
  }

  async function enviarCalificacion() {
    await supabase.from('calificaciones').insert({
      lavacarros_id: params.id,
      estrellas,
      comentario,
      confirmado_uso: true, // el usuario confirmó "ya lo usé" antes de llegar aquí
    })
    setComentario('')
    cargar()
  }

  if (!lavacarros) return <p>Cargando...</p>

  const promedio =
    calificaciones.length > 0
      ? (calificaciones.reduce((sum, c) => sum + c.estrellas, 0) / calificaciones.length).toFixed(1)
      : 'Sin calificaciones aún'

  return (
    <main style={{ maxWidth: 420, margin: '0 auto' }}>
      <h1 style={{ fontSize: 20 }}>{lavacarros.nombre}</h1>
      <p>Calificación: {promedio} ({calificaciones.length} reseñas)</p>
      <p>{lavacarros.descripcion}</p>
      <a href={`tel:${lavacarros.telefono}`}>Llamar: {lavacarros.telefono}</a>

      <div style={{ marginTop: 24, borderTop: '1px solid #e5e5e0', paddingTop: 16 }}>
        <p style={{ fontWeight: 500 }}>¿Ya usaste este servicio?</p>
        <select value={estrellas} onChange={(e) => setEstrellas(Number(e.target.value))}>
          {[5, 4, 3, 2, 1].map((n) => (
            <option key={n} value={n}>{n} estrellas</option>
          ))}
        </select>
        <textarea
          placeholder="Cuéntanos cómo te fue"
          value={comentario}
          onChange={(e) => setComentario(e.target.value)}
          style={{ width: '100%', marginTop: 8, padding: 8 }}
        />
        <button onClick={enviarCalificacion} style={{ marginTop: 8 }}>Ya lo usé — calificar</button>
      </div>

      <div style={{ marginTop: 24 }}>
        {calificaciones.map((c) => (
          <div key={c.id} style={{ marginBottom: 10 }}>
            <p style={{ margin: 0, fontSize: 13 }}>{'⭐'.repeat(c.estrellas)} {c.comentario}</p>
          </div>
        ))}
      </div>
    </main>
  )
}
