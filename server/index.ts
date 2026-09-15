import 'dotenv/config'
import path from 'node:path'
import express from 'express'
import { Provider, ExpressHttpHandler } from 'ltijs'
import { registerRoutes } from './routes'

const logger = { debug: console.debug, warn: console.warn, error: console.error }

const httpHandler = new ExpressHttpHandler(logger, { port: Number(process.env.PORT) || 3000 })
httpHandler.app.use(express.static(path.join(import.meta.dirname, '../client/dist'), { index: '_' }))

const provider = new Provider({
  database: {
    url: `mongodb://${process.env.DB_HOST}/${process.env.DB_NAME}?authSource=admin`,
    connection: { user: process.env.DB_USER, pass: process.env.DB_PASS },
  },
  httpHandler,
  dynamicRegistration: {
    url: process.env.TOOL_URL as string,
    name: process.env.TOOL_NAME as string,
    autoActivate: true
  },
})

// A successful launch/deep-linking request hands off to the matching page, carrying the ltik along as a
// query param (LaunchContext.redirect appends it automatically).
provider.onResourceLink(async (context, _request, response) => {
  context.redirect(response, '/')
})
provider.onDeepLinking(async (context, _request, response) => {
  context.redirect(response, '/deeplink')
})

// The LMS opens the registration URL directly (no launch/ltik yet), so we just forward its two query
// params to a client page that shows what's being registered and requires a button click to proceed --
// see server/routes/dynamic-registration.ts for the endpoints that page calls.
provider.onDynamicRegistration(async (request, response) => {
  const params = new URLSearchParams()
  if (request.query.openid_configuration) params.set('openid_configuration', String(request.query.openid_configuration))
  if (request.query.registration_token) params.set('registration_token', String(request.query.registration_token))
  response.redirect(`/register?${params.toString()}`)
})

registerRoutes(provider, httpHandler.app)

// SPA fallback: any path not already handled (a react-router route like /grades on a full page load)
// gets the client's index.html so client-side routing can take over.
httpHandler.app.use((_req, res) => {
  res.sendFile(path.join(import.meta.dirname, '../client/dist/index.html'))
})

await provider.listen()
