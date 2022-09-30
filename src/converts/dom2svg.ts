import { cloneNode } from '../clone-node'
import { embedWebFont } from '../embed-web-font'
import { embedNode } from '../embed-node'
import { removeDefaultStyleSandbox } from '../get-default-style'
import { resolveOptions } from '../options'
import { isElementNode, isSVGElementNode } from '../utils'

import type { Options, ResolvedOptions } from '../options'

const fixStyles = `<style>
  .modern-screenshot__background-clip--text {
    -webkit-background-clip: text;
    background-clip: text;
  }
</style>`

function createForeignObjectSvg(clone: Node, options: ResolvedOptions): SVGSVGElement {
  const { width, height } = options
  const ownerDocument = clone.ownerDocument ?? document
  const xmlns = 'http://www.w3.org/2000/svg'
  const svg = ownerDocument.createElementNS(xmlns, 'svg')
  svg.setAttribute('viewBox', `0 0 ${ width } ${ height }`)
  const foreignObject = ownerDocument.createElementNS(xmlns, 'foreignObject')
  svg.innerHTML = fixStyles
  foreignObject.setAttributeNS(null, 'x', '0%')
  foreignObject.setAttributeNS(null, 'y', '0%')
  foreignObject.setAttributeNS(null, 'width', '100%')
  foreignObject.setAttributeNS(null, 'height', '100%')
  foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true')
  foreignObject.append(clone)
  svg.appendChild(foreignObject)
  return svg
}

export async function dom2svg<T extends Node>(
  node: T,
  options?: Options,
): Promise<SVGElement> {
  if (isElementNode(node) && isSVGElementNode(node)) {
    return node
  }

  const resolved = await resolveOptions(node, options)

  const clone = await cloneNode(node, resolved)

  removeDefaultStyleSandbox()

  if (resolved.font !== false && isElementNode(clone)) {
    await embedWebFont(clone, resolved)
  }

  await embedNode(clone, resolved)

  return createForeignObjectSvg(clone, resolved)
}
