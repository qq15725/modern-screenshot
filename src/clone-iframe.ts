import type { Context } from './context'
import { cloneNode } from './clone-node'

export function cloneIframe<T extends HTMLIFrameElement>(
  iframe: T,
  context: Context,
): HTMLIFrameElement | Promise<HTMLBodyElement> {
  try {
    if (iframe?.contentDocument?.body) {
      return cloneNode(iframe.contentDocument.body, context) as Promise<HTMLBodyElement>
    }
  }
  catch (error) {
    context.log.warn('Failed to clone iframe', error)
  }

  return iframe.cloneNode(false) as HTMLIFrameElement
}
