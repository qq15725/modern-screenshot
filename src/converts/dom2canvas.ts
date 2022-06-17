import { resolveOptions } from '../options'
import { dom2svg } from './dom2svg'
import { svg2canvas } from './svg2canvas'

import type { Options } from '../options'

export async function dom2canvas<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<HTMLCanvasElement> {
  const resolved = resolveOptions(node, options)
  return await svg2canvas(
    node instanceof SVGSVGElement
      ? node
      : await dom2svg(node, resolved),
    resolved,
  )
}
