import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { useLtik } from '../lib/use-ltik'
import { apiFetchJson } from '../lib/api'
import { useToast } from '../components/toast'
import { PageShell } from '../components/page-shell'

interface LaunchInfo {
  name?: string
  email?: string
  roles?: string[]
  context?: Record<string, unknown>
}

export function Home() {
  const ltik = useLtik()
  const toast = useToast()
  const [info, setInfo] = useState<LaunchInfo>()

  useEffect(() => {
    if (ltik === undefined) return
    apiFetchJson<LaunchInfo>(ltik, '/info')
      .then(setInfo)
      .catch((error: unknown) => {
        toast.error(`Failed retrieving launch info! ${error instanceof Error ? error.message : String(error)}`)
      })
    // toast is stable across renders (from Context); including it would re-run this on every render.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ltik])

  if (ltik === undefined) return null

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {info !== undefined && (info.name !== undefined || info.email !== undefined) && (
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">User</h2>
            <dl className="divide-y divide-border rounded-lg border border-border text-sm">
              {info.name !== undefined && (
                <div className="flex justify-between gap-4 px-3 py-2">
                  <dt className="text-foreground/60">Name</dt>
                  <dd className="font-medium">{info.name}</dd>
                </div>
              )}
              {info.email !== undefined && (
                <div className="flex justify-between gap-4 px-3 py-2">
                  <dt className="text-foreground/60">Email</dt>
                  <dd className="font-medium">{info.email}</dd>
                </div>
              )}
            </dl>
          </section>
        )}

        {info?.roles !== undefined && info.roles.length > 0 && (
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">Roles</h2>
            <ul className="flex flex-wrap gap-2">
              {info.roles.map(role => (
                <li key={role} className="rounded-full border border-border px-3 py-1 text-xs">
                  {role}
                </li>
              ))}
            </ul>
          </section>
        )}

        {info?.context !== undefined && (
          <section>
            <h2 className="mb-2 text-sm font-semibold uppercase tracking-wide text-foreground/60">Context</h2>
            <dl className="divide-y divide-border rounded-lg border border-border text-sm">
              {Object.entries(info.context).map(([key, value]) => (
                <div key={key} className="flex justify-between gap-4 px-3 py-2">
                  <dt className="text-foreground/60">{key}</dt>
                  <dd className="truncate font-medium">{String(value)}</dd>
                </div>
              ))}
            </dl>
          </section>
        )}

        <section>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-foreground/60">Services</h2>
          <div className="flex gap-3">
            <Link
              to={`/grades?ltik=${ltik}`}
              className="flex-1 rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Grades
            </Link>
            <Link
              to={`/namesandroles?ltik=${ltik}`}
              className="flex-1 rounded-lg bg-accent px-4 py-3 text-center text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
            >
              Names &amp; Roles
            </Link>
          </div>
        </section>
      </div>
    </PageShell>
  )
}
