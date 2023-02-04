import {
  consoleTime,
  consoleTimeEnd,
  getDocument,
  isElementNode,
  waitUntilLoad,
} from './utils'
import type { Context } from './context'
import type { Options } from './options'

export async function createContext(node: Node, options?: Options | Context): Promise<Context> {
  if (
    options
    && 'svgRootStyleElement' in options
    && 'fontFamilies' in options
    && 'requests' in options
    && 'tasks' in options
  ) return options

  const debug = Boolean(options?.debug)

  const context: Context = {
    svgRootStyleElement: createSvgRootStyleElement(node),
    fontFamilies: new Set(),
    requests: new Map(),
    requestImagesCount: 0,
    tasks: [],

    // Options
    width: 0,
    height: 0,
    scale: 1,
    backgroundColor: null,
    style: null,
    filter: null,
    maximumCanvasSize: 0,
    timeout: 30000,
    progress: null,
    debug,
    fetch: {},
    font: {},
    drawImageInterval: 100,
    ...options,
  }

  debug && consoleTime('wait until load')
  await waitUntilLoad(node, context.timeout)
  debug && consoleTimeEnd('wait until load')

  const { width, height } = resolveBoundingBox(node, context)
  context.width = width
  context.height = height

  return context
}

export function freeContext(context: Context) {
  context.svgRootStyleElement = getDocument(context.svgRootStyleElement).createElement('style')
  context.fontFamilies.clear()
  context.requestImagesCount = Array.from(context.requests.values())
    .filter(v => v.type === 'image')
    .length
  context.requests.clear()
  context.tasks = []
}

function createSvgRootStyleElement(node: Node) {
  const style = getDocument(node).createElement('style')
  const cssText = style.ownerDocument.createTextNode(`
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`)
  style.appendChild(cssText)
  return style
}

function resolveBoundingBox(node: Node, context: Context) {
  let { width, height } = context

  if (isElementNode(node) && (!width || !height)) {
    const box = node.getBoundingClientRect()

    width = width
      || box.width
      || Number(node.getAttribute('width'))
      || 0

    height = height
      || box.height
      || Number(node.getAttribute('height'))
      || 0
  }

  return { width, height }
}
