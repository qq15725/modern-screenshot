import { isCanvasElement, isImageElement, isVideoElement } from './utils'
import { createCanvasClone } from './create-canvas-clone'
import { createVideoClone } from './create-video-clone'
import { createImageClone } from './create-image-clone'

export function createElementClone<T extends HTMLElement | SVGElement>(
  node: T,
): HTMLElement | SVGElement {
  if (isCanvasElement(node)) {
    return createCanvasClone(node)
  }

  if (isVideoElement(node)) {
    return createVideoClone(node)
  }

  if (isImageElement(node)) {
    return createImageClone(node)
  }

  return node.cloneNode(false) as T
}
