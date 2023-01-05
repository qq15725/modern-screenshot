import { IS_NODE, isElementNode, isHTMLElementNode, isImageElement, loadMedia, waitLoaded } from './utils'

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
   * The pixel ratio of captured image. Defalut is the actual pixel ratio of
   * the device. Set 1 to use as initial-scale 1 for the image
   */
  scale?: number

  /**
   * A string value for the background color, any valid CSS color value.
   */
  backgroundColor?: string

  /**
   * An object whose properties to be copied to node's style before rendering.
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * A function taking DOM node as argument. Should return `true` if passed
   * node should be included in the output. Excluding node means excluding
   * it's children as well.
   */
  filter?: (el: Node) => boolean

  /**
   * Maximum canvas size (pixels).
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
   *
   * default: 16384
   */
  maximumCanvasSize?: number

  /**
   * Load media timeout
   *
   * default: 3000
   */
  loadMediaTimeout?: number

  /**
   * Fetch resources
   */
  fetch?: {
    /**
     * the second parameter of window.fetch RequestInit
     */
    requestInit?: RequestInit

    /**
     * fetch timeout
     *
     * default: 3000
     */
    timeout?: number

    /**
     * Set to `true` to append the current time as a query string to URL
     * requests to enable cache busting.
     */
    bypassingCache?: boolean

    /**
     * A data URL for a placeholder image that will be used when fetching
     * an image fails. Defaults to an empty string and will render empty
     * areas for failed images.
     */
    placeholderImage?: string
  }

  /**
   * Fonts download and embed.
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

  log?: any
}

export interface JpegOptions {

  /**
   * A number between `0` and `1` indicating image quality (e.g. 0.92 => 92%)
   * of the JPEG image.
   */
  quality?: number
}

export interface BlobOptions extends JpegOptions {
  /**
   * A string indicating the image format. The default type is image/png; that type is also used if the given type isn't supported.
   */
  type?: string
}

export interface ResolvedOptions extends Options {
  width: number
  height: number
  scale: number
  maximumCanvasSize: number
  loadMediaTimeout: number
  loaded: boolean
  resolved: true
}

export async function resolveOptions(node: Node, userOptions?: Options): Promise<ResolvedOptions> {
  if ((userOptions as any)?.resolved) return userOptions as ResolvedOptions
  userOptions?.log?.time('resolve options')

  const ownerWindow = node.ownerDocument?.defaultView

  const options = {
    width: 0,
    height: 0,
    loadMediaTimeout: 3000,
    maximumCanvasSize: 16384,
    ...userOptions,
    resolved: true,
  } as ResolvedOptions

  if (isHTMLElementNode(node) && !options.loaded) {
    if (isImageElement(node)) {
      await loadMedia(node, { timeout: options.loadMediaTimeout })
    } else {
      await waitLoaded(node, options.loadMediaTimeout)
    }
    options.loaded = true
  }

  if (!options.scale) {
    options.scale = Number(
      (IS_NODE ? process.env.devicePixelRatio : 0)
      || ownerWindow?.devicePixelRatio
      || 1,
    )
  }

  if ((!options.width || !options.height) && isElementNode(node)) {
    const box = node.getBoundingClientRect()

    options.width = options.width
      || box.width
      || Number(node.getAttribute('width'))
      || 0

    options.height = options.height
      || box.height
      || Number(node.getAttribute('height'))
      || 0
  }

  userOptions?.log?.timeEnd('resolve options')
  return options
}

export function applyCssStyleWithOptions(style: CSSStyleDeclaration, options: ResolvedOptions) {
  const { backgroundColor, width, height, style: styles } = options
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (width) style.width = `${ width }px`
  if (height) style.height = `${ height }px`
  if (styles) {
    for (const name in styles) {
      style[name] = styles[name]!
    }
  }
}
