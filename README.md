<div align="center">
	<br>
	<br>
	<a href="https://cvmcosta.github.io/ltijs"><img width="360" src="https://raw.githubusercontent.com/Cvmcosta/ltijs/master/website/assets/logo.svg"></img></a>
  <a href="https://site.imsglobal.org/certifications/coursekey/ltijs"​ target='_blank'><img width="80" src="https://www.imsglobal.org/sites/default/files/IMSconformancelogoREG.png" alt="IMS Global Certified" border="0"></img></a>
</div>

# Ltijs Demo

> Ltijs v7 demo tool -- an Express backend and a Vite/React UI in one repo, one served port.

### Usage

- Requires Node.js 24 or newer
- Setup a `.env` file (see `.env.example`)
- `npm install && npm install --prefix client`
- `npm run dev` (server + client dev servers) or `npm run build && npm start` (production: client is
  built once, Express serves it)

### Architecture

- `server/` -- Express + `ltijs`'s own `ExpressHttpHandler`, serving `client/dist` as static files plus
  ltijs's default routes (`/lti/login`, `/lti/launch`, `/lti/keys`, `/lti/register`) and this app's own.
  Entry point: [server/index.ts](server/index.ts) -- constructs the `Provider`, wires up the
  `onResourceLink`/`onDeepLinking`/`onDynamicRegistration` hooks, mounts the routes below, and serves the
  client's static build. Run directly via `tsx`, no build step. This app's own routes, one file each
  under [server/routes/](server/routes/):
  - [grade.ts](server/routes/grade.ts) -- `/grade`, submits an AGS score for the launching user
  - [members.ts](server/routes/members.ts) -- `/members`, lists the course's Names and Roles
  - [resources.ts](server/routes/resources.ts) -- `/resources`, example items for the Deep Linking picker
  - [info.ts](server/routes/info.ts) -- `/info`, returns the launching user/context from the ltik
  - [deeplink.ts](server/routes/deeplink.ts) -- `/deeplink`, submits a Deep Linking response form
  - [dynamic-registration.ts](server/routes/dynamic-registration.ts) -- `/register/info` and
    `/register/confirm`, back the intermediate confirmation page (see below) that
    `onDynamicRegistration` redirects to instead of registering immediately
  - [authenticate.ts](server/routes/authenticate.ts) -- shared helper the routes above use to resolve a
    `LaunchContext` from the ltik Bearer token
- `client/` -- a Vite + React + Tailwind SPA (`react-router-dom`), replacing the old separate
  [ltijs-demo-client](https://github.com/Cvmcosta/ltijs-demo-client) repo. In dev, Vite proxies backend
  routes to Express (see `client/vite.config.ts`); in prod, Express serves the built `client/dist`
  directly, so there's a single port either way. Routes live in
  [client/src/App.tsx](client/src/App.tsx); `/register` ([client/src/pages/register.tsx](client/src/pages/register.tsx))
  is the dynamic-registration confirmation page.
