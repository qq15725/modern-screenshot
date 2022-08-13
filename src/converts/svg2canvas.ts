import { resolveOptions } from '../options'
import { svg2image } from './svg2image'
import { image2canvas } from './image2canvas'

import type { Options } from '../options'

export async function svg2canvas<T extends SVGElement>(
  svg: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(svg, options)

  const image = await svg2image(svg)

  return await image2canvas(image, resolved)
}
