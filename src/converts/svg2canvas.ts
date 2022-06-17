import { createImage, escapeXhtml } from '../utils'

import type { Options } from '../options'

export async function svg2canvas<T extends SVGSVGElement>(
  svg: T,
  options: Options = {},
): Promise<HTMLCanvasElement> {
  const image = await createImage(
    `data:image/svg+xml;charset=utf-8,${ escapeXhtml(svg.outerHTML) }`,
  )
  const canvas = document.createElement('canvas')
  canvas.width = options.width!
  canvas.height = options.height!
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(image, 0, 0)
  return canvas
}
