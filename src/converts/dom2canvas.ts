import { resolveOptions } from '../options'
import { dom2svg } from './dom2svg'
import { svg2image } from './svg2image'
import { image2canvas } from './image2canvas'

import type { Options } from '../options'

export async function dom2canvas<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(node, options)

  const svg = await dom2svg(node, resolved)

  const image = await svg2image(svg, resolved)

  return await image2canvas(image, resolved)
}
