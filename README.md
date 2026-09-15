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
  ltijs's default routes (`/lti/login`, `/lti/launch`, `/lti/keys`, `/lti/register`) and this app's own
  (`/grade`, `/members`, `/resources`, `/deeplink`, `/info`). Run directly via `tsx`, no build step.
- `client/` -- a Vite + React + Tailwind SPA (`react-router-dom`), replacing the old separate
  [ltijs-demo-client](https://github.com/Cvmcosta/ltijs-demo-client) repo. In dev, Vite proxies backend
  routes to Express (see `client/vite.config.ts`); in prod, Express serves the built `client/dist`
  directly, so there's a single port either way.

Deep Linking's picker submits a real `<form method="POST" action="/deeplink">` rather than a fetch call,
since the platform's auto-submit response needs to load as a genuine new document for its `<script>` to
run.
