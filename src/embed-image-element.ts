import { isDataUrl, isImageElement, isSVGElementNode, loadImage } from './utils'
import { fetchDataUrl } from './fetch'

import type { ResolvedOptions } from './options'

export async function embedImageElement<T extends HTMLImageElement | SVGImageElement>(
  clone: T,
  options: ResolvedOptions,
) {
  if (isImageElement(clone) && !isDataUrl(clone.src)) {
    clone.srcset = ''
    clone.src = await fetchDataUrl(clone.src, options, true)
  } else if (isSVGElementNode(clone) && !isDataUrl(clone.href.baseVal)) {
    clone.href.baseVal = await fetchDataUrl(clone.href.baseVal, options, true)
  } else {
    return
  }

  return await loadImage(clone)
}