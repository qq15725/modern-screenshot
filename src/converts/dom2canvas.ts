import { dom2svg } from './dom2svg'
import { svg2canvas } from './svg2canvas'

import type { Options } from '../options'

export async function dom2canvas<T extends Node>(
  node: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  return await svg2canvas(
    node instanceof SVGElement
      ? node
      : await dom2svg(node, options),
    options,
  )
}
