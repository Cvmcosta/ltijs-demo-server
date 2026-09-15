// Attaches the ltik a launch redirect carried in the URL (see useLtik) as a Bearer token on a request to
// one of this app's own routes -- the other end of the contract server/routes.ts's authenticate() expects.
export async function apiFetch(ltik: string, path: string, init: RequestInit = {}): Promise<Response> {
  const headers = new Headers(init.headers)
  headers.set('Authorization', `Bearer ${ltik}`)

  const response = await fetch(path, { ...init, headers, credentials: 'include' })
  if (!response.ok) {
    const body = (await response.json().catch(() => undefined)) as { err?: string; message?: string } | undefined
    throw new Error(body?.err ?? body?.message ?? `Request to ${path} failed with status ${response.status}`)
  }
  return response
}

export async function apiFetchJson<T>(ltik: string, path: string, init?: RequestInit): Promise<T> {
  const response = await apiFetch(ltik, path, init)
  return (await response.json()) as T
}

export function postJson(body: unknown): RequestInit {
  return { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }
}
