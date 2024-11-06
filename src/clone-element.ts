import type { Context } from './context'
import { cloneCanvas } from './clone-canvas'
import { cloneIframe } from './clone-iframe'
import { cloneImage } from './clone-image'
import { cloneVideo } from './clone-video'
import {
  isCanvasElement,
  isIFrameElement,
  isImageElement,
  isVideoElement,
} from './utils'

export function cloneElement<T extends HTMLElement | SVGElement>(
  node: T,
  context: Context,
): (HTMLElement | SVGElement) | Promise<HTMLElement | SVGElement> {
  if (isCanvasElement(node)) {
    return cloneCanvas(node, context)
  }

  if (isIFrameElement(node)) {
    return cloneIframe(node, context)
  }

  if (isImageElement(node)) {
    return cloneImage(node)
  }

  if (isVideoElement(node)) {
    return cloneVideo(node, context)
  }

  return node.cloneNode(false) as T
}
