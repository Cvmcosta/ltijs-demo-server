import type { Express } from 'express'
import type { Provider } from 'ltijs'
import { RESOURCES } from '../resources'

// Deep Linking's response has to load as a real, top-level document -- the auto-submit <form>/<script>
// ltijs's createDeepLinkingForm returns only runs its script as part of loading a *new* page, not when
// injected into an already-open one via client-side JS. So the picker submits here as a genuine
// <form method="POST">, not a fetch() call -- which also means the ltik travels as a hidden form field
// instead of an Authorization header, since a plain HTML form can't set custom headers.
export function register(provider: Provider, app: Express): void {
  app.post('/deeplink', async (req, res) => {
    const ltik = req.body.ltik as string | undefined
    const resource = RESOURCES.find(candidate => candidate.value === req.body.resource)

    if (ltik === undefined) {
      res.status(401).send('Missing ltik.')
      return
    }
    if (resource === undefined) {
      res.status(400).send('Unknown resource selected.')
      return
    }

    try {
      const context = await provider.getLaunchContext(ltik)
      const form = await context.deepLinking.createDeepLinkingForm(
        { type: 'ltiResourceLink', title: 'Ltijs Demo', custom: { name: resource.name, value: resource.value } },
        { message: 'Successfully Registered' },
      )
      res.type('html').send(form)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(message)
      res.status(500).send(message)
    }
  })
}
