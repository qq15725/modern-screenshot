import { cloneNode } from '../clone-node'
import { embedNode } from '../embed-node'
import { resolveOptions } from '../options'

import type { Options } from '../options'

export async function dom2svg<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<SVGSVGElement> {
  const { width, height } = resolveOptions(node, options)
  let clone = await cloneNode(node, options)
  clone = await embedNode(clone, options)
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  const foreignObject = document.createElementNS('http://www.w3.org/2000/svg', 'foreignObject')
  foreignObject.setAttribute('x', '0')
  foreignObject.setAttribute('y', '0')
  foreignObject.setAttribute('width', '100%')
  foreignObject.setAttribute('height', '100%')
  foreignObject.innerHTML = new XMLSerializer().serializeToString(clone)
  svg.appendChild(foreignObject)
  return svg
}
