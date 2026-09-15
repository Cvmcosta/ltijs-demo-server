import type { Express } from 'express'
import type { Provider } from 'ltijs'
import { register as registerGrade } from './grade'
import { register as registerMembers } from './members'
import { register as registerResources } from './resources'
import { register as registerInfo } from './info'
import { register as registerDeepLink } from './deeplink'
import { register as registerDynamicRegistration } from './dynamic-registration'

export function registerRoutes(provider: Provider, app: Express): void {
  registerGrade(provider, app)
  registerMembers(provider, app)
  registerResources(provider, app)
  registerInfo(provider, app)
  registerDeepLink(provider, app)
  registerDynamicRegistration(provider, app)
}
