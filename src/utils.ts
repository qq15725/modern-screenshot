export const PREFIX = '[modern-screenshot]'
export const IN_BROWSER = typeof window !== 'undefined'
export const USER_AGENT = IN_BROWSER ? window.navigator?.userAgent : undefined
export const IS_SAFARI = USER_AGENT?.includes('AppleWebKit') && !USER_AGENT?.includes('Chrome')

// Element
export const isElementNode = (node: Node): node is Element => node.nodeType === 1 // Node.ELEMENT_NODE
export const isSVGElementNode = (node: Element): node is SVGElement => typeof (node as SVGElement).className === 'object'
export const isSVGImageElementNode = (node: Element): node is SVGImageElement => isSVGElementNode(node) && node.tagName === 'IMAGE'
export const isHTMLElementNode = (node: Node): node is HTMLElement => isElementNode(node) && typeof (node as HTMLElement).style !== 'undefined' && !isSVGElementNode(node)
export const isTextNode = (node: Node): node is Text => node.nodeType === 3 // Node.TEXT_NODE
export const isImageElement = (node: Element): node is HTMLImageElement => node.tagName === 'IMG'
export const isVideoElement = (node: Element): node is HTMLVideoElement => node.tagName === 'VIDEO'
export const isCanvasElement = (node: Element): node is HTMLCanvasElement => node.tagName === 'CANVAS'
export const isTextareaElement = (node: Element): node is HTMLTextAreaElement => node.tagName === 'TEXTAREA'
export const isInputElement = (node: Element): node is HTMLInputElement => node.tagName === 'INPUT'
export const isStyleElement = (node: Element): node is HTMLStyleElement => node.tagName === 'STYLE'
export const isScriptElement = (node: Element): node is HTMLScriptElement => node.tagName === 'SCRIPT'
export const isSelectElement = (node: Element): node is HTMLSelectElement => node.tagName === 'SELECT'
export const isSlotElement = (node: Element): node is HTMLSlotElement => node.tagName === 'SLOT'
export const isIFrameElement = (node: Element): node is HTMLIFrameElement => node.tagName === 'IFRAME'

// Console
export const consoleWarn = (...args: any[]) => console.warn(PREFIX, ...args)
// eslint-disable-next-line no-console
export const consoleTime = (label: string) => console.time(`${ PREFIX } ${ label }`)
// eslint-disable-next-line no-console
export const consoleTimeEnd = (label: string) => console.timeEnd(`${ PREFIX } ${ label }`)

export const isDataUrl = (url: string) => url.startsWith('data:')
export function resolveUrl(url: string, baseUrl: string | null): string {
  // url is absolute already
  if (url.match(/^[a-z]+:\/\//i)) return url

  // url is absolute already, without protocol
  if (IN_BROWSER && url.match(/^\/\//)) return window.location.protocol + url

  // dataURI, mailto:, tel:, etc.
  if (url.match(/^[a-z]+:/i)) return url

  if (!IN_BROWSER) return url

  const doc = getDocument().implementation.createHTMLDocument()
  const base = doc.createElement('base')
  const a = doc.createElement('a')
  doc.head.appendChild(base)
  doc.body.appendChild(a)
  if (baseUrl) base.href = baseUrl
  a.href = url
  return a.href
}

export function getDocument<T extends Node>(target?: T | null): Document {
  return (
    (
      target && isElementNode(target as any)
        ? target?.ownerDocument
        : target
    ) ?? window.document
  ) as any
}

export function createSvg(width: number, height: number, ownerDocument?: Document | null): SVGSVGElement {
  const svg = getDocument(ownerDocument).createElementNS('http://www.w3.org/2000/svg', 'svg')
  svg.setAttributeNS(null, 'width', width.toString())
  svg.setAttributeNS(null, 'height', height.toString())
  svg.setAttributeNS(null, 'viewBox', `0 0 ${ width } ${ height }`)
  return svg
}

export function svgToDataUrl(svg: SVGElement) {
  const xhtml = new XMLSerializer().serializeToString(svg)
  return `data:image/svg+xml;charset=utf-8,${ encodeURIComponent(xhtml) }`
}

export function createImage(url: string, ownerDocument?: Document | null, useCORS = false): HTMLImageElement {
  const img = getDocument(ownerDocument).createElement('img')
  if (useCORS) {
    img.crossOrigin = 'anonymous'
  }
  img.decoding = 'sync'
  img.loading = 'eager'
  img.src = url
  return img
}

type Media = HTMLVideoElement | HTMLImageElement | SVGImageElement

interface LoadMediaOptions {
  ownerDocument?: Document
  timeout?: number
}

export function loadMedia<T extends Media>(media: T, options?: LoadMediaOptions): Promise<T>
export function loadMedia(media: string, options?: LoadMediaOptions): Promise<HTMLImageElement>
export function loadMedia(media: any, options?: LoadMediaOptions): Promise<any> {
  return new Promise(resolve => {
    const { timeout, ownerDocument } = options ?? {}
    const node: Media = typeof media === 'string'
      ? createImage(media, getDocument(ownerDocument))
      : media
    let timer: any = null
    let removeEventListeners: null | (() => void) = null

    function onResolve() {
      resolve(node)
      timer && clearTimeout(timer)
      removeEventListeners?.()
    }

    if (timeout) {
      timer = setTimeout(onResolve, timeout)
    }

    if (isVideoElement(node)) {
      const poster = node.poster
      if (poster) {
        return loadMedia(poster, options).then(resolve)
      }
      const currentSrc = (node.currentSrc || node.src)
      if (node.readyState >= 2 || !currentSrc) {
        return onResolve()
      }
      const onLoadeddata = onResolve
      const onError = (error: any) => {
        consoleWarn(
          'Video load failed',
          currentSrc,
          error,
        )
        onResolve()
      }
      removeEventListeners = () => {
        node.removeEventListener('loadeddata', onLoadeddata)
        node.removeEventListener('error', onError)
      }
      node.addEventListener('loadeddata', onLoadeddata, { once: true })
      node.addEventListener('error', onError, { once: true })
    } else {
      const currentSrc = isSVGImageElementNode(node)
        ? node.href.baseVal
        : (node.currentSrc || node.src)

      if (!currentSrc) {
        return onResolve()
      }

      const onLoad = async () => {
        if (isImageElement(node) && 'decode' in node) {
          try {
            await node.decode()
          } catch (error) {
            consoleWarn(
              'Failed to decode image, trying to render anyway',
              node.dataset.originalSrc || currentSrc,
              error,
            )
          }
        }
        onResolve()
      }

      const onError = (error: any) => {
        consoleWarn(
          'Image load failed',
          node.dataset.originalSrc || currentSrc,
          error,
        )
        onResolve()
      }

      if (isImageElement(node) && node.complete) {
        return onLoad()
      }

      removeEventListeners = () => {
        node.removeEventListener('load', onLoad)
        node.removeEventListener('error', onError)
      }

      node.addEventListener('load', onLoad, { once: true })
      node.addEventListener('error', onError, { once: true })
    }
  })
}

export async function waitUntilLoad(node: Node, timeout: number) {
  if (isHTMLElementNode(node)) {
    if (isImageElement(node) || isVideoElement(node)) {
      await loadMedia(node, { timeout })
    } else {
      await Promise.all(
        ['img', 'video'].flatMap(selectors => {
          return Array.from(node.querySelectorAll(selectors))
            .map(el => loadMedia(el as any, { timeout }))
        }),
      )
    }
  }
}

export const uuid = (function uuid() {
  // generate uuid for className of pseudo elements.
  // We should not use GUIDs, otherwise pseudo elements sometimes cannot be captured.
  let counter = 0

  // ref: http://stackoverflow.com/a/6248722/2519373
  const random = () =>
    // eslint-disable-next-line no-bitwise
    `0000${ ((Math.random() * 36 ** 4) << 0).toString(36) }`.slice(-4)

  return () => {
    counter += 1
    return `u${ random() }${ counter }`
  }
})()

const MIMES = {
  woff: 'application/font-woff',
  woff2: 'application/font-woff',
  ttf: 'application/font-truetype',
  eot: 'application/vnd.ms-fontobject',
  png: 'image/png',
  jpg: 'image/jpeg',
  jpeg: 'image/jpeg',
  gif: 'image/gif',
  tiff: 'image/tiff',
  svg: 'image/svg+xml',
  webp: 'image/webp',
} as const

const EXT_RE = /\.([^.\/?]+?)(\?.*)?$/
export function getMimeType(url: string): string | undefined {
  return MIMES[url.match(EXT_RE)?.[1]?.toLowerCase() as keyof typeof MIMES]
}
