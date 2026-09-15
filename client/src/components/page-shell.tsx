import type { ReactNode } from 'react'
import { Logo } from './logo'

export function PageShell({ children, wide = false }: { children: ReactNode; wide?: boolean }) {
  return (
    <main className="flex min-h-screen flex-col items-center gap-8 px-4 py-12">
      <Logo />
      <div
        className={`w-full ${wide ? 'max-w-3xl' : 'max-w-md'} rounded-2xl border border-border bg-surface p-6 shadow-sm sm:p-8`}
      >
        {children}
      </div>
    </main>
  )
}
