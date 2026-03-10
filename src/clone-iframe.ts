import type { Context } from './context'
import { cloneNode } from './clone-node'

export function cloneIframe<T extends HTMLIFrameElement>(
  iframe: T,
  context: Context,
): HTMLIFrameElement | Promise<HTMLElement> {
  try {
    if (iframe?.contentDocument?.documentElement) {
      return cloneNode(iframe.contentDocument.documentElement, context) as Promise<HTMLElement>
    }
  }
  catch (error) {
    context.log.warn('Failed to clone iframe', error)
  }

  return iframe.cloneNode(false) as HTMLIFrameElement
}
