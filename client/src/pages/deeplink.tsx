import { useEffect, useState } from 'react'
import { useLtik } from '../lib/use-ltik'
import { apiFetchJson } from '../lib/api'
import { useToast } from '../components/toast'
import { PageShell } from '../components/page-shell'

interface Resource {
  name: string
  value: string
}

export function DeepLink() {
  const ltik = useLtik()
  const toast = useToast()
  const [resources, setResources] = useState<Resource[]>([])

  useEffect(() => {
    if (ltik === undefined) return
    apiFetchJson<Resource[]>(ltik, '/resources')
      .then(setResources)
      .catch((error: unknown) => {
        toast.error(`Failed retrieving example resources! ${error instanceof Error ? error.message : String(error)}`)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ltik])

  if (ltik === undefined) return null

  return (
    <PageShell wide>
      <form action="/deeplink" method="POST">
        <h1 className="mb-4 text-lg font-semibold">Pick a resource to add</h1>
        <input type="hidden" name="ltik" value={ltik} />
        <ul className="divide-y divide-border rounded-lg border border-border text-sm">
          {resources.map(resource => (
            <li key={resource.value}>
              <label className="flex cursor-pointer items-center gap-3 px-4 py-3 hover:bg-foreground/5">
                <input type="radio" name="resource" value={resource.value} required className="accent-accent" />
                <span className="font-medium">{resource.name}</span>
                <span className="ml-auto text-foreground/60">{resource.value}</span>
              </label>
            </li>
          ))}
        </ul>
        <button
          type="submit"
          className="mt-6 w-full rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90"
        >
          Submit
        </button>
      </form>
    </PageShell>
  )
}
