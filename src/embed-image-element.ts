import { isDataUrl, isImageElement, isSVGElementNode, loadMedia } from './utils'
import { fetchDataUrl } from './fetch'

import type { ResolvedOptions } from './options'

export async function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  clone: T,
  options: ResolvedOptions,
) {
  if (isImageElement(clone) && !isDataUrl(clone.src)) {
    clone.srcset = ''
    clone.src = await fetchDataUrl(clone.currentSrc || clone.src, options, true)
  } else if (isSVGElementNode(clone) && !isDataUrl(clone.href.baseVal)) {
    clone.href.baseVal = await fetchDataUrl(clone.href.baseVal, options, true)
  } else {
    return
  }

  await loadMedia(clone, { timeout: options.loadMediaTimeout })
}
