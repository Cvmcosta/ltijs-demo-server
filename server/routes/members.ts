import type { Express } from 'express'
import type { Provider } from 'ltijs'
import { authenticate } from './authenticate'

export function register(provider: Provider, app: Express): void {
  app.get('/members', async (req, res) => {
    const context = await authenticate(provider, req, res)
    if (context === undefined) return

    try {
      const { members } = await context.namesAndRoles.getMembers()
      res.json(members)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(message)
      res.status(500).json({ err: message })
    }
  })
}
