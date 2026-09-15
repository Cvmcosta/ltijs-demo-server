import { useState } from 'react'
import { useLtik } from '../lib/use-ltik'
import { apiFetch, postJson } from '../lib/api'
import { useToast } from '../components/toast'
import { PageShell } from '../components/page-shell'
import { HomeLink } from '../components/home-link'

export function Grades() {
  const ltik = useLtik()
  const toast = useToast()
  const [grade, setGrade] = useState(70)
  const [submitting, setSubmitting] = useState(false)

  if (ltik === undefined) return null

  const submit = async () => {
    setSubmitting(true)
    try {
      await apiFetch(ltik, '/grade', postJson({ grade }))
      toast.success(`Grade ${grade} successfully sent!`)
    } catch (error) {
      toast.error(`Failed sending grade to platform! ${error instanceof Error ? error.message : String(error)}`)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <h1 className="text-lg font-semibold">Select your grade</h1>

        <div className="flex items-center gap-4">
          <input
            type="range"
            min={0}
            max={100}
            step={10}
            value={grade}
            onChange={event => setGrade(Number(event.target.value))}
            className="h-2 flex-1 cursor-pointer accent-accent"
          />
          <input
            type="number"
            min={0}
            max={100}
            value={grade}
            onChange={event => setGrade(Math.min(100, Math.max(0, Number(event.target.value))))}
            className="w-16 rounded-md border border-border bg-transparent px-2 py-1 text-center text-sm"
          />
        </div>

        <button
          type="button"
          onClick={submit}
          disabled={submitting}
          className="rounded-lg bg-accent px-4 py-3 text-sm font-medium text-accent-foreground transition-opacity hover:opacity-90 disabled:opacity-50"
        >
          {submitting ? 'Submitting…' : 'Submit'}
        </button>
      </div>
      <HomeLink ltik={ltik} />
    </PageShell>
  )
}
