require('dotenv').config()
const path = require('path')
const routes = require('./src/routes')

const lti = require(process.env.LTIJS).Provider

// Setup
lti.setup(process.env.LTI_KEY,
  {
    url: 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME + '?authSource=admin',
    connection: { user: process.env.DB_USER, pass: process.env.DB_PASS }
  }, {
    staticPath: path.join(__dirname, './public'), // Path to static files
    cookies: { secure: false } // Cookies can be passed through insecure connections (http), allows for local testing
  })

// Whitelisting the main app route and /nolti to use them as a landing page when accessed outside of LMSs
lti.whitelist(lti.appRoute(), '/nolti')

// When receiving successful LTI launch redirects to app
lti.onConnect(async (token, req, res, next) => {
  if (token) return res.sendFile(path.join(__dirname, './public/index.html'))
  else lti.redirect(res, '/nolti') // Redirects to landing page
})

// When receiving deep linking request redirects to deep link React screen
lti.onDeepLinking(async (connection, request, response) => {
  return lti.redirect(response, '/deeplink', { isNewResource: true })
})

lti.app.use(routes)

// Setup function
const setup = async () => {
  await lti.deploy({ port: process.env.PORT })

  /**
   * Register platform
   */
  /* await lti.registerPlatform({
    url: 'http://localhost/moodle',
    name: 'Platform',
    clientId: 'CLIENTID',
    authenticationEndpoint: 'http://localhost/moodle/mod/lti/auth.php',
    accesstokenEndpoint: 'http://localhost/moodle/mod/lti/token.php',
    authConfig: { method: 'JWK_SET', key: 'http://localhost/moodle/mod/lti/certs.php' }
  }) */
}

setup()
