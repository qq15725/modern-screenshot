import type { Options } from './options'

export const IN_BROWSER = typeof window !== 'undefined'

export function isDataUrl(url: string) {
  return url.startsWith('data:')
}

export function arrayFrom<T>(arrayLike: any): T[] {
  const arr: T[] = []
  for (let i = 0, l = arrayLike.length; i < l; i += 1) {
    arr.push(arrayLike[i])
  }
  return arr
}

export function makeDataUrl(content: string, mimeType: string) {
  return `data:${ mimeType };base64,${ content }`
}

export function resolveUrl(url: string, baseUrl: string | null): string {
  // url is absolute already
  if (url.match(/^[a-z]+:\/\//i)) {
    return url
  }

  // url is absolute already, without protocol
  if (IN_BROWSER && url.match(/^\/\//)) {
    return window.location.protocol + url
  }

  // dataURI, mailto:, tel:, etc.
  if (url.match(/^[a-z]+:/i)) {
    return url
  }

  if (!IN_BROWSER) {
    return url
  }

  const doc = document.implementation.createHTMLDocument()
  const base = doc.createElement('base')
  const a = doc.createElement('a')

  doc.head.appendChild(base)
  doc.body.appendChild(a)

  if (baseUrl) {
    base.href = baseUrl
  }

  a.href = url

  return a.href
}

export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = reject
    img.crossOrigin = 'anonymous'
    img.decoding = 'sync'
    img.src = url
  })
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
} as const

const EXT_RE = /\.([^.\/]+?)$/

export function getMimeType(url: string): string {
  const ext = url.match(EXT_RE)?.[1]?.toLowerCase()
  return MIMES[ext as keyof typeof MIMES] ?? ext
}

function px(node: Node, styleProperty: string) {
  if (node instanceof Element && IN_BROWSER) {
    const val = window.getComputedStyle(node).getPropertyValue(styleProperty)
    return val
      ? parseFloat(val.replace('px', ''))
      : 0
  }
  return 0
}

export function getNodeWidth(node: Node) {
  return (
    node instanceof Element
      ? (node.clientWidth || Number(node.getAttribute('width')))
      : 0
  )
      + px(node, 'border-left-width')
      + px(node, 'border-right-width')
}

export function getNodeHeight(node: Node) {
  return (
    node instanceof Element
      ? (node.clientHeight || Number(node.getAttribute('height')))
      : 0
  )
    + px(node, 'border-top-width')
    + px(node, 'border-bottom-width')
}

export function getImageSize(node: Node, options?: Options) {
  return {
    width: options?.width ?? getNodeWidth(node),
    height: options?.height ?? getNodeHeight(node),
  }
}

export function getPixelRatio() {
  let ratio
  let FINAL_PROCESS
  try {
    FINAL_PROCESS = process
  } catch (e) {
    // pass
  }
  const val
    = FINAL_PROCESS && FINAL_PROCESS.env
      ? FINAL_PROCESS.env.devicePixelRatio
      : null
  if (val) {
    ratio = parseInt(val, 10)
    if (Number.isNaN(ratio)) {
      ratio = 1
    }
  }
  return ratio || (IN_BROWSER && window.devicePixelRatio) || 1
}
