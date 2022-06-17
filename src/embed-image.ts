import { isDataUrl } from './utils'
import { createDataUrl } from './embed-url-content'

import type { Options } from './options'

export async function embedImage<T extends HTMLElement | SVGImageElement>(
  cloned: T,
  options?: Options,
): Promise<T> {
  if (
    !(cloned instanceof HTMLImageElement && !isDataUrl(cloned.src))
    && !(cloned instanceof SVGImageElement && !isDataUrl(cloned.href.baseVal))
  ) {
    return cloned
  }

  const src = cloned instanceof HTMLImageElement
    ? cloned.src
    : cloned.href.baseVal

  const dataUrl = await createDataUrl(src, options)

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

  return cloned
}
