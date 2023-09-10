import { IN_FIREFOX, IN_SAFARI, isDataUrl, isImageElement, isSVGElementNode } from './utils'
import { contextFetch } from './fetch'
import type { Context } from './context'

export function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  cloned: T,
  context: Context,
): Promise<void>[] {
  if (isImageElement(cloned)) {
    const originalSrc = cloned.currentSrc || cloned.src

    if (!isDataUrl(originalSrc)) {
      return [
        contextFetch(context, {
          url: originalSrc,
          imageDom: cloned,
          requestType: 'image',
          responseType: 'dataUrl',
        }).then(url => {
          if (!url) return
          cloned.srcset = ''
          cloned.dataset.originalSrc = originalSrc
          cloned.src = url || ''
        }),
      ]
    }

    if (IN_SAFARI || IN_FIREFOX) {
      context.drawImageCount++
    }
  } else if (isSVGElementNode(cloned) && !isDataUrl(cloned.href.baseVal)) {
    const originalSrc = cloned.href.baseVal
    return [
      contextFetch(context, {
        url: originalSrc,
        imageDom: cloned,
        requestType: 'image',
        responseType: 'dataUrl',
      }).then(url => {
        if (!url) return
        cloned.dataset.originalSrc = originalSrc
        cloned.href.baseVal = url || ''
      }),
    ]
  }
  return []
}
