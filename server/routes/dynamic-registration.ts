import type { Express } from 'express'
import type { Provider } from 'ltijs'

// Backs the /register confirmation page (see client/src/pages/register.tsx). Unauthenticated -- unlike
// the other routes here, this runs before any launch/ltik exists.
export function register(provider: Provider, app: Express): void {
  app.get('/register/info', async (req, res) => {
    const openidConfiguration = req.query.openid_configuration as string | undefined
    if (openidConfiguration === undefined) {
      res.status(400).json({ err: 'Missing openid_configuration.' })
      return
    }

    try {
      const configuration = await provider.dynamicRegistrationService!.getOpenIDConfiguration(openidConfiguration)
      res.json({ issuer: configuration.issuer })
    } catch (error) {
      res.status(500).json({ err: error instanceof Error ? error.message : String(error) })
    }
  })

  app.post('/register/confirm', async (req, res) => {
    const { openid_configuration: openidConfiguration, registration_token: registrationToken } = req.body as {
      openid_configuration?: string
      registration_token?: string
    }
    if (openidConfiguration === undefined) {
      res.status(400).json({ err: 'Missing openid_configuration.' })
      return
    }

    try {
      await provider.dynamicRegistrationService!.register(openidConfiguration, registrationToken)
      res.json({ success: true })
    } catch (error) {
      res.status(500).json({ err: error instanceof Error ? error.message : String(error) })
    }
  })
}
