import { getDefaultRequestInit } from './get-default-request-init'
import {
  IN_BROWSER,
  consoleTime,
  consoleTimeEnd,
  isElementNode,
  isSupportWebp,
  waitUntilLoad,
} from './utils'
import type { Context } from './context'
import type { Options } from './options'

export async function createContext<T extends Node>(node: T, options?: Options & { autodestruct?: boolean }): Promise<Context<T>> {
  const debug = Boolean(options?.debug)

  const ownerDocument = node.ownerDocument ?? (IN_BROWSER ? window.document : undefined)
  const ownerWindow = node.ownerDocument?.defaultView ?? (IN_BROWSER ? window : undefined)

  const context: Context<T> = {
    __CONTEXT__: true,

    // InternalContext
    node,
    ownerDocument,
    ownerWindow,
    svgStyleElement: createStyleElement(ownerDocument),
    defaultComputedStyles: new Map<string, Record<string, any>>(),
    fontFamilies: new Set<string>(),
    fontCssTexts: new Map<string, string>(),
    acceptOfImage: `${ [
      isSupportWebp(ownerDocument) && 'image/webp',
      'image/svg+xml',
      'image/*',
      '*/*',
    ].filter(Boolean).join(',') };q=0.8`,
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
    fetch: {
      requestInit: getDefaultRequestInit(options?.fetch?.bypassingCache),
      ...options?.fetch,
    },
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

export function createStyleElement(ownerDocument?: Document) {
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
