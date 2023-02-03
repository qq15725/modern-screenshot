import { cloneNode } from './clone-node'
import { consoleWarn } from './utils'
import type { Context } from './context'

export function createIframeClone<T extends HTMLIFrameElement>(
  iframe: T,
  context: Context,
): HTMLIFrameElement | HTMLBodyElement {
  try {
    if (iframe?.contentDocument?.body) {
      return cloneNode(iframe.contentDocument.body, context, iframe.contentWindow) as HTMLBodyElement
    }
  } catch (error) {
    consoleWarn('Failed to clone iframe', error)
  }

  return iframe.cloneNode(false) as HTMLIFrameElement
}
