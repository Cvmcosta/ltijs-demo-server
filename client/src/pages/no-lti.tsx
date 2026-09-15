import { PageShell } from '../components/page-shell'

export function NoLti() {
  return (
    <PageShell>
      <p className="text-center text-sm text-foreground/70">This page only works when opened from an LTI launch.</p>
    </PageShell>
  )
}
