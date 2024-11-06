import type { Context } from './context'

export function destroyContext(context: Context): void {
  context.ownerDocument = undefined
  context.ownerWindow = undefined
  context.svgStyleElement = undefined
  context.svgDefsElement = undefined
  context.svgStyles.clear()
  context.defaultComputedStyles.clear()
  if (context.sandbox) {
    try {
      context.sandbox.remove()
    }
    catch (err) {
      context.log.warn('Failed to destroyContext', err)
    }
    context.sandbox = undefined
  }
  context.workers = []
  context.fontFamilies.clear()
  context.fontCssTexts.clear()
  context.requests.clear()
  context.tasks = []
}
