import type { Express } from 'express'
import type { Provider } from 'ltijs'
import { authenticate } from './authenticate'

export function register(provider: Provider, app: Express): void {
  app.post('/grade', async (req, res) => {
    const context = await authenticate(provider, req, res)
    if (context === undefined) return

    try {
      const score = req.body.grade as number

      let lineItemId = context.idToken.services.assignmentAndGrades.lineItemId
      if (lineItemId === undefined) {
        const { lineItems } = await context.grading.getLineItems({ resourceLinkId: true })
        if (lineItems.length === 0) {
          const lineItem = await context.grading.createLineItem(
            { label: 'Grade', scoreMaximum: 100, tag: 'grade' },
            { resourceLinkId: true },
          )
          lineItemId = lineItem.id
        } else {
          lineItemId = lineItems[0].id
        }
      }
      if (lineItemId === undefined) throw new Error('Could not resolve a line item to grade.')

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
