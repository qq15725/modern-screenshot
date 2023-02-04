import { cloneNode } from '../clone-node'
import { createContext, freeContext } from '../create-context'
import { embedWebFont } from '../embed-web-font'
import { embedNode } from '../embed-node'
import { removeDefaultStyleSandbox } from '../get-default-style'
import {
  consoleTime,
  consoleTimeEnd,
  createSvg,
  isElementNode,
  isSVGElementNode,
} from '../utils'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToForeignObjectSvg<T extends Node>(
  node: T,
  options?: Options,
): Promise<SVGElement> {
  if (isElementNode(node) && isSVGElementNode(node)) return node

  const context = await createContext(node, options)

  const {
    debug,
    tasks,
    svgRootStyleElement,
    font,
    progress,
  } = context

  debug && consoleTime('clone node')
  const clone = cloneNode(node, context)
  debug && consoleTimeEnd('clone node')

  removeDefaultStyleSandbox()

  if (font !== false && isElementNode(clone)) {
    debug && consoleTime('embed web font')
    await embedWebFont(clone, context)
    debug && consoleTimeEnd('embed web font')
  }

  embedNode(clone, context)

  const count = tasks.length
  let current = 0
  debug && consoleTime('embed node')
  await Promise.all(
    progress
      ? tasks.map(task => task.finally(() => progress(++current, count)))
      : tasks,
  )
  debug && consoleTimeEnd('embed node')

  const svg = createForeignObjectSvg(clone, context)
  svg.insertBefore(svgRootStyleElement, svg.children[0])

  freeContext(context)

  return svg
}

function createForeignObjectSvg(clone: Node, context: Context): SVGSVGElement {
  const { width, height } = context
  const svg = createSvg(width, height, clone.ownerDocument)
  const foreignObject = svg.ownerDocument.createElementNS(svg.namespaceURI, 'foreignObject')
  foreignObject.setAttributeNS(null, 'x', '0%')
  foreignObject.setAttributeNS(null, 'y', '0%')
  foreignObject.setAttributeNS(null, 'width', '100%')
  foreignObject.setAttributeNS(null, 'height', '100%')
  foreignObject.setAttributeNS(null, 'externalResourcesRequired', 'true')
  foreignObject.append(clone)
  svg.appendChild(foreignObject)
  return svg
}
