import type { Options } from './options'

export type Request = {
  type: 'image' | 'text'
  resolve?: (response: string) => void
  reject?: (error: Error) => void
  response: Promise<string>
}

export interface InternalContext<T extends Node> {
  /**
   * FLAG
   */
  __CONTEXT__: true

  /**
   * Logger
   */
  log: {
    time: (label: string) => void
    timeEnd: (label: string) => void
    warn: (...args: any[]) => void
  }

  /**
   * Node
   */
  node: T

  /**
   * Owner document
   */
  ownerDocument?: Document

  /**
   * Owner window
   */
  ownerWindow?: Window

  /**
   * DPI
   *
   * scale === 1 ? null : 96 * scale
   */
  dpi: number | null

  /**
   * The `style` element under the root `svg` element
   */
  svgStyleElement?: HTMLStyleElement

  /**
   * The `defs` element under the root `svg` element
   */
  svgDefsElement?: SVGDefsElement

  /**
   * The `svgStyleElement` class styles
   *
   * Map<cssText, class[]>
   */
  svgStyles: Map<string, string[]>

  /**
   * The map of default `getComputedStyle` for all tagnames
   */
  defaultComputedStyles: Map<string, Map<string, any>>

  /**
   * The IFrame sandbox used to get the `defaultComputedStyles`
   */
  sandbox?: HTMLIFrameElement

  /**
   * Web Workers
   */
  workers: Worker[]

  /**
   * The set of `font-family` values for all cloend elements
   */
  fontFamilies: Set<string>

  /**
   * Map<CssUrl, DataUrl>
   */
  fontCssTexts: Map<string, string>

  /**
   * `headers.accept` to use when `window.fetch` fetches images
   */
  acceptOfImage: string

  /**
   * All requests for `fetch`
   */
  requests: Map<string, Request>

  /**
   * Canvas multiple draw image fix svg+xml image decoding in Safari and Firefox
   */
  drawImageCount: number

  /**
   * Wait for all tasks embedded in
   */
  tasks: Promise<void>[]

  /**
   * Automatically destroy context
   */
  autoDestruct: boolean

  /**
   * Is enable
   *
   * @param key
   */
  isEnable: (key: string) => boolean
}

export type Context<T extends Node = Node> = InternalContext<T> & Required<Options>
