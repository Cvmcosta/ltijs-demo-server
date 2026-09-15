import { useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

// Every page reachable from an LTI launch gets the ltik ltijs appended as a query param (see
// LaunchContext.redirect on the server). Sends a visitor with no ltik (a direct, non-launch visit) to
// /nolti instead of leaving the page to fail on its own.
export function useLtik(): string | undefined {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const ltik = searchParams.get('ltik') ?? undefined

  useEffect(() => {
    if (ltik === undefined) navigate('/nolti', { replace: true })
  }, [ltik, navigate])

  return ltik
}
