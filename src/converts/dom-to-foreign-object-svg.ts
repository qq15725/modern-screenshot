import { cloneNode } from '../clone-node'
import { createContext } from '../create-context'
import { destroyContext } from '../destroy-context'
import { embedWebFont } from '../embed-web-font'
import { embedNode } from '../embed-node'
import {
  consoleTime,
  consoleTimeEnd,
  consoleWarn,
  createSvg,
  isContext,
  isElementNode,
  isSVGElementNode,
} from '../utils'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToForeignObjectSvg<T extends Node>(node: T, options?: Options): Promise<SVGElement>
export async function domToForeignObjectSvg<T extends Node>(context: Context<T>): Promise<SVGElement>
export async function domToForeignObjectSvg(node: any, options?: any) {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true })

  if (isElementNode(context.node) && isSVGElementNode(context.node)) return context.node

  const {
    debug,
    tasks,
    svgStyleElement,
    font,
    progress,
    autodestruct,
    onCloneNode,
    onEmbedNode,
    onCreateForeignObjectSvg,
  } = context

  debug && consoleTime('clone node')
  const clone = cloneNode(context.node, context, true)
  debug && consoleTimeEnd('clone node')

  onCloneNode?.(clone)

  if (font !== false && isElementNode(clone)) {
    debug && consoleTime('embed web font')
    await embedWebFont(clone, context)
    debug && consoleTimeEnd('embed web font')
  }

  debug && consoleTime('embed node')
  embedNode(clone, context)
  const count = tasks.length
  let current = 0
  const runTask = async () => {
    while (true) {
      const task = tasks.pop()
      if (!task) break
      try {
        await task
      } catch (error) {
        consoleWarn('Failed to run task', error)
      }
      progress?.(++current, count)
    }
  }
  progress?.(current, count)
  await Promise.all([...Array(4)].map(runTask))
  debug && consoleTimeEnd('embed node')

  onEmbedNode?.(clone)

  const svg = createForeignObjectSvg(clone, context)
  svgStyleElement && svg.insertBefore(svgStyleElement, svg.children[0])

  autodestruct && destroyContext(context)

  onCreateForeignObjectSvg?.(svg)

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
