import { isDataUrl, isImageElement, isSVGElementNode, loadMedia } from './utils'
import { fetchDataUrl } from './fetch'

import type { ResolvedOptions } from './options'

export async function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  clone: T,
  options: ResolvedOptions,
) {
  if (isImageElement(clone) && !isDataUrl(clone.currentSrc || clone.src)) {
    const originSrc = clone.currentSrc || clone.src
    clone.srcset = ''
    clone.dataset.originalSrc = originSrc
    clone.src = await fetchDataUrl(originSrc, options, true)
  } else if (isSVGElementNode(clone) && !isDataUrl(clone.href.baseVal)) {
    const originSrc = clone.href.baseVal
    clone.dataset.originalSrc = originSrc
    clone.href.baseVal = await fetchDataUrl(originSrc, options, true)
  } else {
    return
  }

  await loadMedia(clone, { timeout: options.timeout })
}
