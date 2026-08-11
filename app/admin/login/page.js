'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { supabase } from '../../../lib/supabaseClient'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  async function iniciarSesion() {
    setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) {
      setError('Correo o contraseña incorrectos')
    } else {
      router.push('/admin')
    }
  }

  return (
    <main style={{ maxWidth: 360, margin: '80px auto' }}>
      <h1 style={{ fontSize: 20 }}>Iniciar sesión</h1>

      <label>Correo</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        style={{ width: '100%', marginBottom: 16, padding: 8 }}
      />

      <label>Contraseña</label>
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        style={{ width: '100%', marginBottom: 16, padding: 8 }}
      />

      {error && <p style={{ color: 'red', fontSize: 13 }}>{error}</p>}

      <button onClick={iniciarSesion} style={{ width: '100%', padding: 10 }}>
        Entrar
      </button>
    </main>
  )
}