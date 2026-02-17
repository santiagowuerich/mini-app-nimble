const BASE_URL = 'https://botfilter-h5ddh6dye8exb7ha.centralus-01.azurewebsites.net'

import type { Candidate, Job, ApplyToJobPayload } from '../tipos'

export async function getCandidateByEmail(email: string): Promise<Candidate> {
  const params = new URLSearchParams({ email })
  const res = await fetch(`${BASE_URL}/api/candidate/get-by-email?${params}`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export async function getJobsList(): Promise<Job[]> {
  const res = await fetch(`${BASE_URL}/api/jobs/get-list`)
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}

export async function applyToJob(payload: ApplyToJobPayload): Promise<{ ok: boolean }> {
  const res = await fetch(`${BASE_URL}/api/candidate/apply-to-job`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })
  if (!res.ok) {
    const text = await res.text()
    throw new Error(text || `Error ${res.status}: ${res.statusText}`)
  }
  return res.json()
}
