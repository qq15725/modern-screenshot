import { cloneNode } from '../clone-node'
import { embedWebFont } from '../embed-web-font'
import { embedNode } from '../embed-node'
import { removeDefaultStyleSandbox } from '../get-default-style'
import { resolveOptions } from '../options'
import { isElementNode, isSVGElementNode } from '../utils'

import type { Options } from '../options'

const xmlns = 'http://www.w3.org/2000/svg'

function createSvg(width: number, height: number, document: Document): SVGSVGElement {
  const svg = document.createElementNS(xmlns, 'svg')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', `0 0 ${ width } ${ height }`)
  return svg
}

function createForeignObject(document: Document): SVGForeignObjectElement {
  const foreignObject = document.createElementNS(xmlns, 'foreignObject')
  foreignObject.setAttribute('x', '0')
  foreignObject.setAttribute('y', '0')
  foreignObject.setAttribute('width', '100%')
  foreignObject.setAttribute('height', '100%')
  foreignObject.setAttribute('externalResourcesRequired', 'true')
  return foreignObject
}

const fixStyles = `<style>
  .egami__background-clip--text {
    -webkit-background-clip: text;
    background-clip: text;
  }
</style>`

export async function dom2svg<T extends Node>(
  node: T,
  options?: Options,
): Promise<SVGElement> {
  if (isElementNode(node) && isSVGElementNode(node)) {
    return node
  }

  const resolvedOptions = await resolveOptions(node, options)
  const clone = await cloneNode(node, resolvedOptions)
  removeDefaultStyleSandbox()

  if (resolvedOptions.font !== false && isElementNode(clone)) {
    await embedWebFont(clone, resolvedOptions)
  }

  await embedNode(clone, resolvedOptions)
  const ownerDocument = node.ownerDocument ?? document
  const { width, height } = resolvedOptions
  const svg = createSvg(width, height, ownerDocument)
  svg.innerHTML = fixStyles
  const foreignObject = createForeignObject(ownerDocument)
  foreignObject.append(clone)
  svg.appendChild(foreignObject)
  return svg
}
