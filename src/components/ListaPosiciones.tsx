import { useState } from 'react'
import type { FormEvent } from 'react'
import type { Candidate, Job } from '../tipos'
import { applyToJob } from '../api/clienteApi'

interface ListaPosicionesProps {
  candidate: Candidate
  jobs: Job[]
  onApplySuccess: (jobId: string) => void
}

export function ListaPosiciones({ candidate, jobs, onApplySuccess }: ListaPosicionesProps) {
  const [repoUrls, setRepoUrls] = useState<Record<string, string>>({})
  const [submittingId, setSubmittingId] = useState<string | null>(null)
  const [errorByJob, setErrorByJob] = useState<Record<string, string>>({})
  const [successByJob, setSuccessByJob] = useState<Record<string, boolean>>({})

  function handleRepoUrlChange(jobId: string, value: string) {
    setRepoUrls((prev) => ({ ...prev, [jobId]: value }))
    setErrorByJob((prev) => ({ ...prev, [jobId]: '' }))
  }

  async function handleSubmit(e: FormEvent, job: Job) {
    e.preventDefault()
    const repoUrl = (repoUrls[job.id] ?? '').trim()
    if (!repoUrl) {
      setErrorByJob((prev) => ({ ...prev, [job.id]: 'Ingresá la URL del repositorio.' }))
      return
    }
    setSubmittingId(job.id)
    setErrorByJob((prev) => ({ ...prev, [job.id]: '' }))
    try {
      await applyToJob({
        uuid: candidate.uuid,
        jobId: job.id,
        candidateId: candidate.candidateId,
        repoUrl,
      })
      setSuccessByJob((prev) => ({ ...prev, [job.id]: true }))
      onApplySuccess(job.id)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Error al enviar la postulación.'
      setErrorByJob((prev) => ({ ...prev, [job.id]: message }))
    } finally {
      setSubmittingId(null)
    }
  }

  if (jobs.length === 0) {
    return (
      <section className="job-list">
        <p>No hay posiciones disponibles.</p>
      </section>
    )
  }

  return (
    <section className="job-list">
      <h2>Posiciones abiertas</h2>
      <p>Elegí la posición, ingresá la URL de tu repo de GitHub y enviá tu postulación.</p>
      <ul>
        {jobs.map((job) => (
          <li key={job.id} className="job-item">
            <h3>{job.title}</h3>
            <form onSubmit={(e) => handleSubmit(e, job)}>
              <input
                type="url"
                value={repoUrls[job.id] ?? ''}
                onChange={(e) => handleRepoUrlChange(job.id, e.target.value)}
                placeholder="https://github.com/tu-usuario/tu-repo"
                disabled={!!successByJob[job.id] || submittingId !== null}
              />
              <button
                type="submit"
                disabled={!!successByJob[job.id] || submittingId !== null}
              >
                {submittingId === job.id ? 'Enviando…' : 'Submit'}
              </button>
            </form>
            {errorByJob[job.id] && (
              <p className="error">{errorByJob[job.id]}</p>
            )}
            {successByJob[job.id] && (
              <p className="success">Postulación enviada correctamente.</p>
            )}
          </li>
        ))}
      </ul>
    </section>
  )
}
