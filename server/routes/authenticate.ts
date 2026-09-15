import type { Request, Response } from 'express'
import type { LaunchContext, Provider } from 'ltijs'

// Resolves the launch context from the ltik sent by the client as a Bearer token.
export async function authenticate(provider: Provider, req: Request, res: Response): Promise<LaunchContext | undefined> {
  const authHeader = req.headers.authorization ?? ''
  const ltik = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : undefined
  if (ltik === undefined) {
    res.status(401).json({ err: 'Missing ltik.' })
    return undefined
  }
  try {
    return await provider.getLaunchContext(ltik)
  } catch (error) {
    res.status(401).json({ err: error instanceof Error ? error.message : String(error) })
    return undefined
  }
}
