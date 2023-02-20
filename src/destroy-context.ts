import type { Context } from './context'

export function destroyContext(context: Context) {
  context.ownerDocument = undefined
  context.ownerWindow = undefined
  context.svgStyleElement = undefined
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
  context.requestImagesCount = 0
  context.requests.clear()
  context.tasks = []
}
