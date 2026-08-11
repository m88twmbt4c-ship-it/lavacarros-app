'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../lib/supabaseClient'

export default function Admin() {
  const [pendientes, setPendientes] = useState([])
  const [cargando, setCargando] = useState(true)
  const router = useRouter()

  useEffect(() => {
    verificarSesion()
  }, [])

  async function verificarSesion() {
    const { data: { session } } = await supabase.auth.getSession()
    if (!session) {
      router.push('/admin/login')
      return
    }
    setCargando(false)
    cargar()
  }

  async function cargar() {
    const { data } = await supabase.from('lavacarros').select('*').eq('estado', 'pendiente')
    setPendientes(data || [])
  }

  async function actualizar(id, estado) {
    await supabase.from('lavacarros').update({ estado }).eq('id', id)
    cargar()
  }

  async function cerrarSesion() {
    await supabase.auth.signOut()
    router.push('/admin/login')
  }

  if (cargando) return <p>Cargando...</p>

  return (
    <main style={{ maxWidth: 480, margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 style={{ fontSize: 20 }}>Registros pendientes</h1>
        <button onClick={cerrarSesion}>Cerrar sesión</button>
      </div>
      {pendientes.length === 0 && <p>No hay registros pendientes.</p>}
      {pendientes.map((l) => (
        <div key={l.id} style={{ background: 'white', borderRadius: 12, padding: 16, marginBottom: 10, border: '1px solid #e5e5e0' }}>
          <p style={{ fontWeight: 500, margin: 0 }}>{l.nombre}</p>
          <p style={{ fontSize: 13, color: '#666' }}>Radio {l.radio_km} km · Tel. {l.telefono}</p>
          <p style={{ fontSize: 13 }}>{l.descripcion}</p>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={() => actualizar(l.id, 'aprobado')}>Aprobar</button>
            <button onClick={() => actualizar(l.id, 'rechazado')}>Rechazar</button>
          </div>
        </div>
      ))}
    </main>
  )
}