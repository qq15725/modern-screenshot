import {
  consoleTime,
  consoleTimeEnd,
  getDocument,
  isElementNode,
  isHTMLElementNode,
  isImageElement,
  loadMedia,
  waitLoaded,
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
    tasks: [],

    // Options
    scale: 1,
    backgroundColor: null,
    style: null,
    filter: null,
    maximumCanvasSize: 16384,
    timeout: 3000,
    progress: null,
    debug,
    fetch: {},
    font: {},
    drawImageInterval: 100,
    ...options,
    ...resolveBoundingBox(node, options),
  }

  await waitForAllMediaToLoad(node, context)

  return context
}

export function freeContext(context: Context) {
  context.svgRootStyleElement = getDocument(context.svgRootStyleElement).createElement('style')
  context.fontFamilies.clear()
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

function resolveBoundingBox(node: Node, options?: Options) {
  let { width = 0, height = 0 } = options || {}

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

async function waitForAllMediaToLoad(node: Node, context: Context) {
  const { debug, timeout } = context

  debug && consoleTime('wait for all media to load')

  if (isHTMLElementNode(node)) {
    if (isImageElement(node)) {
      await loadMedia(node, { timeout })
    } else {
      await waitLoaded(node, timeout)
    }
  }

  debug && consoleTimeEnd('wait for all media to load')
}
