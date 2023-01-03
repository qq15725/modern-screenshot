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
</style>`.replace(/(\n| {2})/ig, '')

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

export async function domToSvg<T extends Node>(
  node: T,
  options?: Options,
): Promise<SVGElement> {
  if (isElementNode(node) && isSVGElementNode(node)) return node
  options?.log?.time('resolve options')
  const resolved = await resolveOptions(node, options)
  options?.log?.timeEnd('resolve options')

  options?.log?.time('clone node')
  const clone = cloneNode(node, resolved)
  options?.log?.timeEnd('clone node')

  removeDefaultStyleSandbox()

  if (resolved.font !== false && isElementNode(clone)) {
    options?.log?.time('embed web font')
    await embedWebFont(clone, resolved)
    options?.log?.timeEnd('embed web font')
  }

  options?.log?.time('embed node')
  await embedNode(clone, resolved)
  options?.log?.timeEnd('embed node')

  return createForeignObjectSvg(clone, resolved)
}
