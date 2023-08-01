import { createLogger } from './create-logger'
import { getDefaultRequestInit } from './get-default-request-init'
import {
  IN_BROWSER,
  SUPPORT_WEB_WORKER,
  XMLNS,
  consoleWarn,
  isContext,
  isElementNode,
  supportWebp,
  waitUntilLoad,
} from './utils'
import type { Context, Request } from './context'
import type { Options } from './options'

export async function orCreateContext<T extends Node>(context: Context<T>): Promise<Context<T>>
export async function orCreateContext<T extends Node>(node: T, options?: Options): Promise<Context<T>>
export async function orCreateContext(node: any, options?: Options): Promise<Context> {
  return isContext(node) ? node : createContext(node, { ...options, autoDestruct: true })
}

export async function createContext<T extends Node>(node: T, options?: Options & { autoDestruct?: boolean }): Promise<Context<T>> {
  const { scale = 1, workerUrl, workerNumber = 1 } = options || {}

  const debug = Boolean(options?.debug)
  const features = options?.features ?? true

  const ownerDocument = node.ownerDocument ?? (IN_BROWSER ? window.document : undefined)
  const ownerWindow = node.ownerDocument?.defaultView ?? (IN_BROWSER ? window : undefined)
  const requests = new Map<string, Request>()

  const context: Context<T> = {
    // Options
    width: 0,
    height: 0,
    quality: 1,
    type: 'image/png',
    scale,
    backgroundColor: null,
    style: null,
    filter: null,
    maximumCanvasSize: 0,
    timeout: 30000,
    progress: null,
    debug,
    fetch: {
      requestInit: getDefaultRequestInit(options?.fetch?.bypassingCache),
      placeholderImage: 'data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7',
      bypassingCache: false,
      ...options?.fetch,
    },
    font: {},
    drawImageInterval: 100,
    workerUrl: null,
    workerNumber,
    onCloneNode: null,
    onEmbedNode: null,
    onCreateForeignObjectSvg: null,
    autoDestruct: false,
    ...options,

    // InternalContext
    __CONTEXT__: true,
    log: createLogger(debug),
    node,
    ownerDocument,
    ownerWindow,
    dpi: scale === 1 ? null : 96 * scale,
    svgStyleElement: createStyleElement(ownerDocument),
    svgDefsElement: ownerDocument?.createElementNS(XMLNS, 'defs'),
    svgStyles: new Map(),
    defaultComputedStyles: new Map(),
    workers: [
      ...new Array(
        SUPPORT_WEB_WORKER && workerUrl && workerNumber
          ? workerNumber
          : 0,
      ),
    ].map(() => {
      try {
        const worker = new Worker(workerUrl!)
        worker.onmessage = async event => {
          const { url, result } = event.data
          if (result) {
            requests.get(url)?.resolve?.(result)
          } else {
            requests.get(url)?.reject?.(new Error(`Error receiving message from worker: ${ url }`))
          }
        }
        worker.onmessageerror = event => {
          const { url } = event.data
          requests.get(url)?.reject?.(new Error(`Error receiving message from worker: ${ url }`))
        }
        return worker
      } catch (error) {
        consoleWarn('Failed to new Worker', error)
        return null
      }
    }).filter(Boolean) as any,
    fontFamilies: new Set(),
    fontCssTexts: new Map(),
    acceptOfImage: `${ [
      supportWebp(ownerDocument) && 'image/webp',
      'image/svg+xml',
      'image/*',
      '*/*',
    ].filter(Boolean).join(',') };q=0.8`,
    requests,
    drawImageCount: 0,
    tasks: [],

    features,
    isEnable: (key: string): boolean => {
      if (typeof features === 'boolean') {
        return features
      }
      return (features as any)[key] ?? true
    },
  }

  context.log.time('wait until load')
  await waitUntilLoad(node, context.timeout)
  context.log.timeEnd('wait until load')

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
