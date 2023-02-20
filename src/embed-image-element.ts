import { isDataUrl, isImageElement, isSVGElementNode } from './utils'
import { contextFetch } from './fetch'
import type { Context } from './context'

export function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  clone: T,
  context: Context,
): Promise<void>[] {
  if (isImageElement(clone) && !isDataUrl(clone.currentSrc || clone.src)) {
    const url = clone.currentSrc || clone.src
    clone.srcset = ''
    clone.dataset.originalSrc = url
    return [
      contextFetch(context, {
        url,
        imageDom: clone,
        requestType: 'image',
        responseType: 'base64',
      }).then(url => {
        clone.src = url
      }),
    ]
  } else if (isSVGElementNode(clone) && !isDataUrl(clone.href.baseVal)) {
    const url = clone.href.baseVal
    clone.dataset.originalSrc = url
    return [
      contextFetch(context, {
        url,
        imageDom: clone,
        requestType: 'image',
        responseType: 'base64',
      }).then(url => {
        clone.href.baseVal = url
      }),
    ]
  }
  return []
}
