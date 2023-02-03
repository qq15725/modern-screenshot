import type { Options } from './options'

export interface InternalContext {
  /**
   * The `style` element under the root `svg` element
   */
  svgRootStyleElement: HTMLStyleElement

  /**
   * The set of `font-family` values for all elements
   */
  fontFamilies: Set<string>

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
}

export type Context = InternalContext & Required<Options>
