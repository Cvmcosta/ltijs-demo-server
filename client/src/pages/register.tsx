import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { PageShell } from '../components/page-shell'

export function Register() {
  const [searchParams] = useSearchParams()
  const openidConfiguration = searchParams.get('openid_configuration') ?? undefined
  const registrationToken = searchParams.get('registration_token') ?? undefined
  const [issuer, setIssuer] = useState<string>()
  const [status, setStatus] = useState<'idle' | 'submitting' | 'done' | 'error'>('idle')
  const [error, setError] = useState<string>()

  useEffect(() => {
    if (openidConfiguration === undefined) return
    fetch(`/register/info?openid_configuration=${encodeURIComponent(openidConfiguration)}`)
      .then(res => res.json())
      .then((data: { issuer?: string }) => setIssuer(data.issuer))
      .catch(() => {})
  }, [openidConfiguration])

  if (openidConfiguration === undefined) {
    return (
      <PageShell>
        <p className="text-center text-sm text-foreground/70">
          This page only works when opened as part of LTI dynamic registration.
        </p>
      </PageShell>
    )
  }

  async function handleConfirm() {
    setStatus('submitting')
    try {
      const response = await fetch('/register/confirm', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ openid_configuration: openidConfiguration, registration_token: registrationToken }),
      })
      if (!response.ok) {
        const body = (await response.json().catch(() => undefined)) as { err?: string } | undefined
        throw new Error(body?.err ?? `Registration failed with status ${response.status}`)
      }
      setStatus('done')
      // Same message ltijs's own default handler sends -- lets the platform close the popup/iframe it opened.
      ;(window.opener || window.parent)?.postMessage({ subject: 'org.imsglobal.lti.close' }, '*')
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err))
      setStatus('error')
    }
  }

  return (
    <PageShell>
      <h1 className="mb-2 text-center text-lg font-semibold">Register this tool</h1>
      <p className="mb-6 text-center text-sm text-foreground/70">
        {issuer !== undefined ? (
          <>
            Confirm registration with <span className="font-medium">{issuer}</span>.
          </>
        ) : (
          'Confirm registration with this platform.'
        )}
      </p>
      {status === 'done' ? (
        <p className="text-center text-sm text-foreground/70">Registered! You can close this window.</p>
      ) : (
        <button
          type="button"
          onClick={handleConfirm}
          disabled={status === 'submitting'}
          className="w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {status === 'submitting' ? 'Registering…' : 'Continue registration'}
        </button>
      )}
      {status === 'error' && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}
    </PageShell>
  )
}
