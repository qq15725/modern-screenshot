import type { Context } from './context'
import { uuid } from './utils'

export function getSandBox(context: Context): HTMLIFrameElement | undefined {
  let sandbox = context.sandbox
  if (!sandbox) {
    const { ownerDocument } = context
    try {
      if (ownerDocument) {
        sandbox = ownerDocument.createElement('iframe')
        sandbox.id = `__SANDBOX__-${uuid()}`
        sandbox.width = '0'
        sandbox.height = '0'
        sandbox.style.visibility = 'hidden'
        sandbox.style.position = 'fixed'
        ownerDocument.body.appendChild(sandbox)
        sandbox.contentWindow?.document.write('<!DOCTYPE html><meta charset="UTF-8"><title></title><body>')
        context.sandbox = sandbox
      }
    }
    catch (error) {
      context.log.warn('Failed to getSandBox', error)
    }
  }
  return sandbox
}
