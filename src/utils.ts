import type { Options } from './options'

export function isDataUrl(url: string) {
  return url.startsWith('data:')
}

export function toArray<T>(arrayLike: any): T[] {
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
  if (url.match(/^\/\//)) {
    return window.location.protocol + url
  }

  // dataURI, mailto:, tel:, etc.
  if (url.match(/^[a-z]+:/i)) {
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

export function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

export function escapeXhtml(string: string) {
  return string
    .replace(/#/g, '%23')
    .replace(/\n/g, '%0A')
}

export function escape(string: string) {
  return string
    .replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
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

function px(node: HTMLElement | SVGSVGElement, styleProperty: string) {
  const val = window.getComputedStyle(node).getPropertyValue(styleProperty)
  return val ? parseFloat(val.replace('px', '')) : 0
}

export function getNodeWidth(node: HTMLElement | SVGSVGElement) {
  const leftBorder = px(node, 'border-left-width')
  const rightBorder = px(node, 'border-right-width')
  return (
    node.clientWidth || Number(node.getAttribute('width'))
  ) + leftBorder + rightBorder
}

export function getNodeHeight(node: HTMLElement | SVGSVGElement) {
  const topBorder = px(node, 'border-top-width')
  const bottomBorder = px(node, 'border-bottom-width')
  return (
    node.clientHeight || Number(node.getAttribute('height'))
  ) + topBorder + bottomBorder
}

export function getImageSize(node: HTMLElement | SVGSVGElement, options?: Options) {
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
  return ratio || window.devicePixelRatio || 1
}

export function canvasToBlob(
  canvas: HTMLCanvasElement,
  options: Options = {},
): Promise<Blob | null> {
  const type = options.type ?? 'image/png'
  const quality = options.quality ?? 1

  if (canvas.toBlob) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  }

  return new Promise((resolve) => {
    const binaryString = window.atob(
      canvas
        .toDataURL(type, quality)
        .split(',')[1],
    )
    const len = binaryString.length
    const binaryArray = new Uint8Array(len)
    for (let i = 0; i < len; i += 1) {
      binaryArray[i] = binaryString.charCodeAt(i)
    }
    resolve(new Blob([binaryArray], { type }))
  })
}
