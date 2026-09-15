import type { Express } from 'express'
import type { Provider } from 'ltijs'
import { authenticate } from './authenticate'

export function register(provider: Provider, app: Express): void {
  app.get('/info', async (req, res) => {
    const context = await authenticate(provider, req, res)
    if (context === undefined) return

    const { user, launch } = context.idToken
    res.json({ name: user.name, email: user.email, roles: user.roles, context: launch.context })
  })
}
