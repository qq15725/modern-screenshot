import { createImage } from '../utils'

import type { Options } from '../options'

export function svg2image<T extends SVGElement>(
  svg: T,
  _options?: Options,
): HTMLImageElement {
  const xhtml = new XMLSerializer().serializeToString(svg)

  const dataUrl = `data:image/svg+xml;charset=utf-8,${ encodeURIComponent(xhtml) }`

  return createImage(dataUrl, svg.ownerDocument)
}
