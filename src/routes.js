const router = require('express').Router()
const path = require('path')

// Requiring Ltijs
const lti = require('ltijs').Provider

// Grading route
router.post('/grade', async (req, res) => {
  try {
    const lineItem = {
      scoreMaximum: 100,
      label: 'Grade',
      tag: 'grade'
    }

    const grade = {
      scoreGiven: req.body.grade,
      activityProgress: 'Completed',
      gradingProgress: 'FullyGraded'
    }
    await lti.Grade.scorePublish(res.locals.token, grade, { resourceLinkId: true, autoCreate: lineItem })
    return res.sendStatus(201)
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(err.message)
  }
})

// Names and Roles route
router.get('/members', async (req, res) => {
  try {
    const result = await lti.NamesAndRoles.getMembers(res.locals.token, { limit: 1 })
    if (result) return res.send(result.members)
    return res.sendStatus(500)
  } catch (err) {
    console.log(err)
    return res.status(500).send(err.message)
  }
})

// Deep linking route
router.post('/deeplink', async (req, res) => {
  try {
    const resource = req.body

    const items = {
      type: 'ltiResourceLink',
      title: 'Ltijs Demo',
      custom: {
        name: resource.name,
        value: resource.value
      }
    }

    const form = await lti.DeepLinking.createDeepLinkingForm(res.locals.token, items, { message: 'Successfully Registered' })
    if (form) return res.send(form)
    return res.sendStatus(500)
  } catch (err) {
    console.log(err.message)
    return res.status(500).send(err.message)
  }
})

// Return available deep linking resources
router.get('/resources', async (req, res) => {
  const resources = [
    {
      name: 'Resource1',
      value: 'value1'
    },
    {
      name: 'Resource2',
      value: 'value2'
    },
    {
      name: 'Resource3',
      value: 'value3'
    }
  ]
  return res.send(resources)
})

// Get user and context information
router.get('/info', async (req, res) => {
  const token = res.locals.token
  const context = res.locals.context

  const info = { }
  if (token.userInfo) {
    if (token.userInfo.name) info.name = token.userInfo.name
    if (token.userInfo.email) info.email = token.userInfo.email
  }

  if (context.roles) info.roles = context.roles
  if (context.context) info.context = context.context

  return res.send(info)
})

// Wildcard route to deal with redirecting to routes that are actually React routes
router.get('*', (req, res) => res.sendFile(path.join(__dirname, '../public/index.html')))

module.exports = router
