import { dom2svg, resolveOptions } from './dom2svg'
import { svg2image } from './svg2image'

import type { Dom2svgOptions } from './dom2svg'

export type Dom2imageOptions = Dom2svgOptions

export async function dom2image(node: HTMLElement, userOptions: Dom2imageOptions) {
  const options = resolveOptions(node, userOptions)
  const svg = await dom2svg(node, options)
  return await svg2image(svg, options)
}
