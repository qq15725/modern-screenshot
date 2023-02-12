import {
  IN_BROWSER,
  consoleTime,
  consoleTimeEnd,
  isElementNode,
  waitUntilLoad,
} from './utils'
import type { Context } from './context'
import type { Options } from './options'

export async function createContext<T extends Node>(node: T, options?: Options & { autodestruct?: boolean }): Promise<Context<T>> {
  const debug = Boolean(options?.debug)

  const ownerDocument = node.ownerDocument ?? (IN_BROWSER ? window.document : undefined)
  const ownerWindow = node.ownerDocument?.defaultView ?? (IN_BROWSER ? window : undefined)

  let sandbox: HTMLIFrameElement | undefined
  if (ownerDocument) {
    sandbox = ownerDocument.createElement('iframe')
    sandbox.id = 'modern-screenshot__sandbox'
    sandbox.width = '0'
    sandbox.height = '0'
    sandbox.style.visibility = 'hidden'
    sandbox.style.position = 'fixed'
    ownerDocument.body.appendChild(sandbox)
    sandbox.contentWindow?.document.write('<!DOCTYPE html><meta charset="UTF-8"><title></title><body>')
  }

  const context: Context<T> = {
    __CONTEXT__: true,

    // InternalContext
    node,
    ownerDocument,
    ownerWindow,
    svgStyleElement: createStyleElement(ownerDocument),
    defaultComputedStyles: new Map<string, Record<string, any>>(),
    sandbox,
    fontFamilies: new Set(),
    requests: new Map(),
    requestImagesCount: 0,
    tasks: [],
    autodestruct: false,

    // Options
    width: 0,
    height: 0,
    quality: 1,
    type: 'image/png',
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

export function destroyContext(context: Context) {
  context.ownerDocument = undefined
  context.ownerWindow = undefined
  context.svgStyleElement = undefined
  context.defaultComputedStyles.clear()
  if (context.sandbox) {
    context.sandbox.remove()
    context.sandbox = undefined
  }
  context.fontFamilies.clear()
  context.requestImagesCount = 0
  context.requests.clear()
  context.tasks = []
}

function createStyleElement(ownerDocument?: Document) {
  if (!ownerDocument) return undefined
  const style = ownerDocument.createElement('style')
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
