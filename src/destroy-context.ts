import type { Context } from './context'

export function destroyContext(context: Context) {
  context.ownerDocument = undefined
  context.ownerWindow = undefined
  context.svgStyleElement = undefined
  context.svgDefsElement = undefined
  context.svgStyles.clear()
  context.defaultComputedStyles.clear()
  if (context.sandbox) {
    try {
      context.sandbox.remove()
    } catch (err) {
      //
    }
    context.sandbox = undefined
  }
  context.workers = []
  context.fontFamilies.clear()
  context.fontCssTexts.clear()
  context.requests.clear()
  context.tasks = []
}
