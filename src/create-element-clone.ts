import { createIframeClone } from './create-iframe-clone'
import { isCanvasElement, isIFrameElement, isImageElement, isVideoElement } from './utils'
import { createCanvasClone } from './create-canvas-clone'
import { createVideoClone } from './create-video-clone'
import { createImageClone } from './create-image-clone'
import type { Context } from './context'

export function createElementClone<T extends HTMLElement | SVGElement>(
  node: T,
  context: Context,
): HTMLElement | SVGElement {
  if (isCanvasElement(node)) {
    return createCanvasClone(node)
  }

  if (isIFrameElement(node)) {
    return createIframeClone(node, context)
  }

  if (isImageElement(node)) {
    return createImageClone(node)
  }

  if (isVideoElement(node)) {
    return createVideoClone(node)
  }

  return node.cloneNode(false) as T
}
