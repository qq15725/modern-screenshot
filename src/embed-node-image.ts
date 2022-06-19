import { isDataUrl } from './utils'
import { fetchToDataUrl } from './fetch'

import type { HandleNodeFunc } from './types'

export const embedNodeImage: HandleNodeFunc = async (cloned, options) => {
  if (
    !(cloned instanceof HTMLImageElement && !isDataUrl(cloned.src))
    && !(cloned instanceof SVGImageElement && !isDataUrl(cloned.href.baseVal))
  ) {
    return
  }

  const src = cloned instanceof HTMLImageElement
    ? cloned.src
    : cloned.href.baseVal

  const dataUrl = await fetchToDataUrl(src, options)

  await new Promise((resolve, reject) => {
    cloned.onload = resolve
    cloned.onerror = reject
    if (cloned instanceof HTMLImageElement) {
      cloned.srcset = ''
      cloned.src = dataUrl
    } else {
      cloned.href.baseVal = dataUrl
    }
  })
}
