import { isDataUrl, isImageElement, isSVGElementNode } from './utils'
import { fetchDataUrl } from './fetch'
import type { Context } from './context'

export function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  clone: T,
  context: Context,
): Promise<void>[] {
  if (isImageElement(clone) && !isDataUrl(clone.currentSrc || clone.src)) {
    const currentSrc = clone.currentSrc || clone.src
    clone.srcset = ''
    clone.dataset.originalSrc = currentSrc
    return [
      fetchDataUrl(currentSrc, context, true).then(url => {
        clone.src = url
      }),
    ]
  } else if (isSVGElementNode(clone) && !isDataUrl(clone.href.baseVal)) {
    const currentSrc = clone.href.baseVal
    clone.dataset.originalSrc = currentSrc
    return [
      fetchDataUrl(currentSrc, context, true).then(url => {
        clone.href.baseVal = url
      }),
    ]
  }
  return []
}
