import type { Express } from 'express'
import type { LaunchContext, Provider } from 'ltijs'
import { authenticate } from './authenticate'

// Reads the line item without creating one -- used by GET /grade, where viewing the page shouldn't have
// the side effect of provisioning a line item that doesn't exist yet.
async function findLineItemId(context: LaunchContext): Promise<string | undefined> {
  const declared = context.idToken.services.assignmentAndGrades.lineItemId
  if (declared !== undefined) return declared
  const { lineItems } = await context.grading.getLineItems({ resourceLinkId: true })
  return lineItems[0]?.id
}

async function resolveLineItemId(context: LaunchContext): Promise<string> {
  const lineItemId = await findLineItemId(context)
  if (lineItemId !== undefined) return lineItemId
  const lineItem = await context.grading.createLineItem(
    { label: 'Grade', scoreMaximum: 100, tag: 'grade' },
    { resourceLinkId: true },
  )
  if (lineItem.id === undefined) throw new Error('Could not resolve a line item to grade.')
  return lineItem.id
}

export function register(provider: Provider, app: Express): void {
  app.get('/grade', async (req, res) => {
    const context = await authenticate(provider, req, res)
    if (context === undefined) return

    try {
      const lineItemId = await findLineItemId(context)
      if (lineItemId === undefined) {
        res.json([])
        return
      }

      const { scores } = await context.grading.getScores(lineItemId, { userId: context.idToken.user.id })
      res.json(scores)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(message)
      res.status(500).json({ err: message })
    }
  })

  app.post('/grade', async (req, res) => {
    const context = await authenticate(provider, req, res)
    if (context === undefined) return

    try {
      const score = req.body.grade as number
      const lineItemId = await resolveLineItemId(context)

      const result = await context.grading.submitScore(lineItemId, {
        scoreGiven: score,
        scoreMaximum: 100,
        activityProgress: 'Completed',
        gradingProgress: 'FullyGraded',
      })
      res.json(result)
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error)
      console.error(message)
      res.status(500).json({ err: message })
    }
  })
}
