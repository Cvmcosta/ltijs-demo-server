require('dotenv').config()
const path = require('path')
const routes = require('./src/routes')

const lti = require('ltijs').Provider

// Setup
lti.setup(process.env.LTI_KEY,
  {
    url: 'mongodb://' + process.env.DB_HOST + '/' + process.env.DB_NAME + '?authSource=admin',
  }, {
    staticPath: path.join(__dirname, './public'), // serve os arquivos estáticos do React build
    cookies: {
      secure: false,
      sameSite: ''
    },
    devMode: true
  })

// Quando a conexão LTI for estabelecida, envia o React buildado
lti.onConnect(async (token, req, res) => {
  return res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Quando receber deep linking, pode manter a mesma lógica
lti.onDeepLinking(async (token, req, res) => {
  return lti.redirect(res, '/deeplink', { newResource: true })
})

// Rota customizada, mantém o que já tem
lti.app.use(routes)

// Fallback: qualquer rota desconhecida envia o React
lti.app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'))
})

// Deploy do servidor
const setup = async () => {
  await lti.deploy({ port: process.env.PORT })

  // Registro da plataforma (se precisar)
  /*
  await lti.registerPlatform({
    url: 'http://localhost/moodle',
    name: 'Platform',
    clientId: 'CLIENTID',
    authenticationEndpoint: 'http://localhost/moodle/mod/lti/auth.php',
    accesstokenEndpoint: 'http://localhost/moodle/mod/lti/token.php',
    authConfig: { method: 'JWK_SET', key: 'http://localhost/moodle/mod/lti/certs.php' }
  })
  */
}

setup()
