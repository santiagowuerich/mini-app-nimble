import { useState } from 'react'
import type { FormEvent } from 'react'

interface PasoEmailProps {
  onSuccess: (email: string) => void
  loading: boolean
  error: string | null
}

export function PasoEmail({ onSuccess, loading, error }: PasoEmailProps) {
  const [email, setEmail] = useState('')

  function handleSubmit(e: FormEvent) {
    e.preventDefault()
    const trimmed = email.trim()
    if (trimmed) onSuccess(trimmed)
  }

  return (
    <section className="email-step">
      <h2>Paso 1: Tus datos</h2>
      <p>Ingresá el email con el que te postulaste para cargar tu información.</p>
      <form onSubmit={handleSubmit}>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="tu@email.com"
          disabled={loading}
          required
          autoFocus
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Cargando…' : 'Cargar mis datos'}
        </button>
      </form>
      {error && <p className="error">{error}</p>}
    </section>
  )
}
