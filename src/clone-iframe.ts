import { cloneNode } from './clone-node'
import { consoleWarn } from './utils'
import type { Context } from './context'

export function cloneIframe<T extends HTMLIFrameElement>(
  iframe: T,
  context: Context,
): HTMLIFrameElement | Promise<HTMLBodyElement> {
  try {
    if (iframe?.contentDocument?.body) {
      return cloneNode(iframe.contentDocument.body, context) as Promise<HTMLBodyElement>
    }
  } catch (error) {
    consoleWarn('Failed to clone iframe', error)
  }

  return iframe.cloneNode(false) as HTMLIFrameElement
}
