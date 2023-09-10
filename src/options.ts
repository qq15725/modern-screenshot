export interface Options {
  /**
   * Width in pixels to be applied to node before rendering.
   */
  width?: number

  /**
   * Height in pixels to be applied to node before rendering.
   */
  height?: number

  /**
   * A number between `0` and `1` indicating image quality (e.g. 0.92 => 92%) of the JPEG image.
   */
  quality?: number

  /**
   * A string indicating the image format. The default type is image/png; that type is also used if the given type isn't supported.
   */
  type?: string

  /**
   * The pixel ratio of captured image.
   *
   * DPI = 96 * scale
   *
   * default: 1
   */
  scale?: number

  /**
   * A string value for the background color, any valid CSS color value.
   */
  backgroundColor?: string | null

  /**
   * An object whose properties to be copied to node's style before rendering.
   */
  style?: Partial<CSSStyleDeclaration> | null

  /**
   * A function taking DOM node as argument. Should return `true` if passed
   * node should be included in the output. Excluding node means excluding
   * it's children as well.
   */
  filter?: ((el: Node) => boolean) | null

  /**
   * Maximum canvas size (pixels).
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
   */
  maximumCanvasSize?: number

  /**
   * Load media timeout and fetch remote asset timeout (millisecond).
   *
   * default: 30000
   */
  timeout?: number

  /**
   * Embed assets progress.
   */
  progress?: ((current: number, total: number) => void) | null

  /**
   * Enable debug mode to view the execution time log.
   */
  debug?: boolean

  /**
   * The options of fetch resources.
   */
  fetch?: {
    /**
     * The second parameter of `window.fetch` RequestInit
     *
     * default: {
     *   cache: 'force-cache',
     * }
     */
    requestInit?: RequestInit

    /**
     * Set to `true` to append the current time as a query string to URL
     * requests to enable cache busting.
     *
     * default: false
     */
    bypassingCache?: boolean | RegExp

    /**
     * A data URL for a placeholder image that will be used when fetching
     * an image fails. Defaults to an empty string and will render empty
     * areas for failed images.
     *
     * default: data:image/png;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7
     */
    placeholderImage?: string | ((cloned: HTMLImageElement | SVGImageElement) => string | Promise<string>)
  }

  /**
   * The options of fonts download and embed.
   */
  font?: false | {
    /**
     * The preferred font format. If specified all other font formats are ignored.
     */
    preferredFormat?: 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg' | string

    /**
     * A CSS string to specify for font embeds. If specified only this CSS will
     * be present in the resulting image.
     */
    cssText?: string
  }

  /**
   * All enabled features
   *
   * default: true
   */
  features?: boolean | {
    /**
     * Copy scrollbar css styles
     *
     * default: true
     */
    copyScrollbar?: boolean

    /**
     * Remove abnormal attributes to cloned node (for normalize XML)
     *
     * default: true
     */
    removeAbnormalAttributes?: boolean

    /**
     * Remove control characters (for normalize XML)
     *
     * default: true
     */
    removeControlCharacter?: boolean

    /**
     * Fix svg+xml image decode (for Safari、Firefox)
     *
     * default: true
     */
    fixSvgXmlDecode?: boolean
  }

  /**
   * Canvas `drawImage` interval
   * is used to fix errors in decoding images in Safari、Firefox
   *
   * default: 100
   */
  drawImageInterval?: number

  /**
   * Web Worker script url
   */
  workerUrl?: string | null

  /**
   * Web Worker number
   */
  workerNumber?: number

  /**
   * Triggered after a node is cloned
   */
  onCloneNode?: ((cloend: Node) => void) | null

  /**
   * Triggered after a node is embed
   */
  onEmbedNode?: ((cloend: Node) => void) | null

  /**
   * Triggered after a ForeignObjectSvg is created
   */
  onCreateForeignObjectSvg?: ((svg: SVGSVGElement) => void) | null
}
