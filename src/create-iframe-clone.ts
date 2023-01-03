import { cloneNode } from './clone-node'
import type { ResolvedOptions } from './options'

export function createIframeClone<T extends HTMLIFrameElement>(
  iframe: T,
  options: ResolvedOptions,
): HTMLIFrameElement | HTMLBodyElement {
  try {
    if (iframe?.contentDocument?.body) {
      return cloneNode(iframe.contentDocument.body, options, iframe.contentWindow) as HTMLBodyElement
    }
  } catch {
    // Failed to clone iframe
  }

  return iframe.cloneNode(false) as HTMLIFrameElement
}
