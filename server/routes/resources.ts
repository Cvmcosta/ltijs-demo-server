import type { Express } from 'express'
import type { Provider } from 'ltijs'
import { authenticate } from './authenticate'
import { RESOURCES } from '../resources'

export function register(provider: Provider, app: Express): void {
  app.get('/resources', async (req, res) => {
    const context = await authenticate(provider, req, res)
    if (context === undefined) return
    res.json(RESOURCES)
  })
}
