import type { Options } from './options'

export interface InternalContext<T extends Node> {
  /**
   * FLAG
   */
  __CONTEXT__: true

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
   * The `style` element under the root `svg` element
   */
  svgStyleElement?: HTMLStyleElement

  /**
   * The map of default `getComputedStyle` for all tagnames
   */
  defaultComputedStyles: Map<string, Record<string, any>>

  /**
   * The IFrame sandbox used to get the `defaultComputedStyles`
   */
  sandbox?: HTMLIFrameElement

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
  requests: Map<string, {
    type: 'image' | 'text'
    response: Promise<{
      content: string
      contentType: string
    }>
  }>

  /**
   * All request images count
   */
  requestImagesCount: number

  /**
   * Wait for all tasks embedded in
   */
  tasks: Promise<void>[]

  /**
   * Automatically destroy context
   */
  autodestruct: boolean
}

export type Context<T extends Node = Node> = InternalContext<T> & Required<Options>
