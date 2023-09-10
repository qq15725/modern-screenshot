import type { Context } from './context'

// Constants
export const PREFIX = '[modern-screenshot]'
export const IN_BROWSER = typeof window !== 'undefined'
export const SUPPORT_WEB_WORKER = IN_BROWSER && 'Worker' in window
export const SUPPORT_ATOB = IN_BROWSER && 'atob' in window
export const SUPPORT_BTOA = IN_BROWSER && 'btoa' in window
export const USER_AGENT = IN_BROWSER ? window.navigator?.userAgent : ''
export const IN_CHROME = USER_AGENT.includes('Chrome')
export const IN_SAFARI = USER_AGENT.includes('AppleWebKit') && !IN_CHROME
export const IN_FIREFOX = USER_AGENT.includes('Firefox')

// Context
export const isContext = <T extends Node>(value: any): value is Context<T> => value && '__CONTEXT__' in value

// CSS
export const isCssFontFaceRule = (rule: CSSRule): rule is CSSFontFaceRule => rule.constructor.name === 'CSSFontFaceRule'
export const isCSSImportRule = (rule: CSSRule): rule is CSSImportRule => rule.constructor.name === 'CSSImportRule'

// Element
export const isElementNode = (node: Node): node is Element => node.nodeType === 1 // Node.ELEMENT_NODE
export const isSVGElementNode = (node: Element): node is SVGElement => typeof (node as SVGElement).className === 'object'
export const isSVGImageElementNode = (node: Element): node is SVGImageElement => node.tagName === 'image'
export const isSVGUseElementNode = (node: Element): node is SVGUseElement => node.tagName === 'use'
export const isHTMLElementNode = (node: Node): node is HTMLElement => isElementNode(node) && typeof (node as HTMLElement).style !== 'undefined' && !isSVGElementNode(node)
export const isCommentNode = (node: Node): node is Text => node.nodeType === 8 // Node.COMMENT_NODE
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

// Supports
export const supportWebp = (ownerDocument?: Document) => {
  const canvas = ownerDocument?.createElement?.('canvas')
  if (canvas) {
    canvas.height = canvas.width = 1
  }
  return canvas
    && 'toDataURL' in canvas
    && Boolean(canvas.toDataURL('image/webp').includes('image/webp'))
}

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

export const XMLNS = 'http://www.w3.org/2000/svg'

export function createSvg(width: number, height: number, ownerDocument?: Document | null): SVGSVGElement {
  const svg = getDocument(ownerDocument).createElementNS(XMLNS, 'svg')
  svg.setAttributeNS(null, 'width', width.toString())
  svg.setAttributeNS(null, 'height', height.toString())
  svg.setAttributeNS(null, 'viewBox', `0 0 ${ width } ${ height }`)
  return svg
}

export function svgToDataUrl(svg: SVGElement, removeControlCharacter: boolean) {
  let xhtml = new XMLSerializer().serializeToString(svg)

  if (removeControlCharacter) {
    xhtml = xhtml
      // https://www.w3.org/TR/xml/#charsets
      // eslint-disable-next-line no-control-regex
      .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\uD800-\uDFFF\uFFFE\uFFFF]/ug, '')
  }

  return `data:image/svg+xml;charset=utf-8,${ encodeURIComponent(xhtml) }`
}

// To Blob
export async function canvasToBlob(canvas: HTMLCanvasElement, type = 'image/png', quality = 1): Promise<Blob> {
  try {
    return await new Promise((resolve, reject) => {
      canvas.toBlob(blob => {
        if (blob) {
          resolve(blob)
        } else {
          reject(new Error('Blob is null'))
        }
      }, type, quality)
    })
  } catch (error) {
    if (SUPPORT_ATOB) {
      consoleWarn('Failed canvas to blob', { type, quality }, error)
      return dataUrlToBlob(canvas.toDataURL(type, quality))
    }
    throw error
  }
}
export function dataUrlToBlob(dataUrl: string) {
  const [header, base64] = dataUrl.split(',')
  const type = header.match(/data:(.+);/)?.[1] ?? undefined
  const decoded = window.atob(base64)
  const length = decoded.length
  const buffer = new Uint8Array(length)
  for (let i = 0; i < length; i += 1) {
    buffer[i] = decoded.charCodeAt(i)
  }
  return new Blob([buffer], { type })
}

// Blob to
export function readBlob(blob: Blob, type: 'dataUrl'): Promise<string>
export function readBlob(blob: Blob, type: 'arrayBuffer'): Promise<ArrayBuffer>
export function readBlob(blob: Blob, type: 'dataUrl' | 'arrayBuffer') {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(reader.error)
    reader.onabort = () => reject(new Error(`Failed read blob to ${ type }`))
    if (type === 'dataUrl') {
      reader.readAsDataURL(blob)
    } else if (type === 'arrayBuffer') {
      reader.readAsArrayBuffer(blob)
    }
  })
}
export const blobToDataUrl = (blob: Blob) => readBlob(blob, 'dataUrl')
export const blobToArrayBuffer = (blob: Blob) => readBlob(blob, 'arrayBuffer')

export function createImage(url: string, ownerDocument?: Document | null): HTMLImageElement {
  const img = getDocument(ownerDocument).createElement('img')
  img.decoding = 'sync'
  img.loading = 'eager'
  img.src = url
  return img
}

type Media = HTMLVideoElement | HTMLImageElement | SVGImageElement

interface LoadMediaOptions {
  ownerDocument?: Document
  timeout?: number
  onError?: (error: Error) => void
}

export function loadMedia<T extends Media>(media: T, options?: LoadMediaOptions): Promise<T>
export function loadMedia(media: string, options?: LoadMediaOptions): Promise<HTMLImageElement>
export function loadMedia(media: any, options?: LoadMediaOptions): Promise<any> {
  return new Promise(resolve => {
    const { timeout, ownerDocument, onError: userOnError } = options ?? {}
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
      const currentSrc = (node.currentSrc || node.src)
      if (!currentSrc) {
        if (node.poster) {
          return loadMedia(node.poster, options).then(resolve)
        }
        return onResolve()
      }
      if (node.readyState >= 2) {
        return onResolve()
      }
      const onLoadeddata = onResolve
      const onError = (error: any) => {
        consoleWarn(
          'Failed video load',
          currentSrc,
          error,
        )
        userOnError?.(error)
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
          'Failed image load',
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

export function splitFontFamily(fontFamily?: string): undefined | string[] {
  return fontFamily
    ?.split(',')
    // Chrome  '__Niconne_7b96fe, __Niconne_Fallback_7b96fe'
    // Firefox '"__Niconne_7b96fe", "__Niconne_Fallback_7b96fe"'
    .map(val => val.trim().replace(/"|'/g, '').toLowerCase())
    .filter(Boolean)
}
