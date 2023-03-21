import { IN_FIREFOX, IN_SAFARI, isDataUrl, isImageElement, isSVGElementNode } from './utils'
import { contextFetch } from './fetch'
import type { Context } from './context'

export function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  clone: T,
  context: Context,
): Promise<void>[] {
  if (isImageElement(clone)) {
    const originalSrc = clone.currentSrc || clone.src

    if (!isDataUrl(originalSrc)) {
      return [
        contextFetch(context, {
          url: originalSrc,
          imageDom: clone,
          requestType: 'image',
          responseType: 'dataUrl',
        }).then(url => {
          if (!url) return
          clone.srcset = ''
          clone.dataset.originalSrc = originalSrc
          clone.src = url || ''
        }),
      ]
    }

    if ((IN_SAFARI || IN_FIREFOX) && originalSrc.includes('data:image/svg+xml')) {
      context.drawImageCount++
    }
  } else if (isSVGElementNode(clone) && !isDataUrl(clone.href.baseVal)) {
    const originalSrc = clone.href.baseVal
    return [
      contextFetch(context, {
        url: originalSrc,
        imageDom: clone,
        requestType: 'image',
        responseType: 'dataUrl',
      }).then(url => {
        if (!url) return
        clone.dataset.originalSrc = originalSrc
        clone.href.baseVal = url || ''
      }),
    ]
  }
  return []
}
