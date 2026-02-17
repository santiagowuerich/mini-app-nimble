import { useState, useCallback } from 'react'
import type { Candidate, Job } from './tipos'
import { getCandidateByEmail, getJobsList } from './api/clienteApi'
import { PasoEmail } from './components/PasoEmail'
import { ListaPosiciones } from './components/ListaPosiciones'
import './App.css'

type AppStatus = 'idle' | 'loading-candidate' | 'loading-jobs' | 'ready' | 'error'

export default function App() {
  const [candidate, setCandidate] = useState<Candidate | null>(null)
  const [jobs, setJobs] = useState<Job[]>([])
  const [status, setStatus] = useState<AppStatus>('idle')
  const [error, setError] = useState<string | null>(null)

  const loadCandidateAndJobs = useCallback(async (email: string) => {
    setError(null)
    setStatus('loading-candidate')
    try {
      const candidateData = await getCandidateByEmail(email)
      setCandidate(candidateData)
      setStatus('loading-jobs')
      const jobsList = await getJobsList()
      setJobs(jobsList)
      setStatus('ready')
    } catch (err) {
      setStatus('error')
      setError(err instanceof Error ? err.message : 'Error al cargar los datos.')
    }
  }, [])

  const handleApplySuccess = useCallback((_jobId: string) => {
    // Opcional: mostrar feedback global o redirigir
  }, [])

  const showEmailStep = !candidate && status !== 'loading-jobs' && status !== 'ready'

  return (
    <main className="app">
      <header className="app-header">
        <h1>Nimble Gravity — Postulación</h1>
      </header>

      {showEmailStep && (
        <PasoEmail
          onSuccess={loadCandidateAndJobs}
          loading={status === 'loading-candidate'}
          error={status === 'error' ? error : null}
        />
      )}

      {status === 'loading-jobs' && (
        <p className="loading">Cargando posiciones…</p>
      )}

      {status === 'ready' && candidate && (
        <>
          <p className="candidate-info">
            Hola, {candidate.firstName} {candidate.lastName} ({candidate.email})
          </p>
          <ListaPosiciones
            candidate={candidate}
            jobs={jobs}
            onApplySuccess={handleApplySuccess}
          />
        </>
      )}
    </main>
  )
}
