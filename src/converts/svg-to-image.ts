import { createImage } from '../utils'

export function svgToImage<T extends SVGElement>(svg: T): HTMLImageElement {
  const xhtml = new XMLSerializer().serializeToString(svg)
  const dataUrl = `data:image/svg+xml;charset=utf-8,${ encodeURIComponent(xhtml) }`
  return createImage(dataUrl, svg.ownerDocument)
}
