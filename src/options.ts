import { IS_NODE, isElementNode, isHTMLElementNode, waitLoaded } from './utils'

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
   * A string indicating the image format. The default type is image/png; that type is also used if the given type isn't supported.
   */
  type?: string

  /**
   * A number between `0` and `1` indicating image quality (e.g. 0.92 => 92%)
   * of the JPEG image.
   */
  quality?: number

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
   * Fetch resources
   */
  fetch?: {
    /**
     * the second parameter of window.fetch RequestInit
     */
    requestInit?: RequestInit

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
}

export interface ResolvedOptions extends Options {
  width: number
  height: number
  scale: number
  type: string
  quality: number
  maximumCanvasSize: number
  loaded: boolean
}

export async function resolveOptions(node: Node, options?: Options): Promise<ResolvedOptions> {
  const resolved = { ...options } as ResolvedOptions

  if (isHTMLElementNode(node) && !resolved.loaded) {
    await waitLoaded(node)
    resolved.loaded = true
  }

  resolved.width = resolved.width ?? 0
  resolved.height = resolved.height ?? 0
  resolved.type = resolved.type ?? 'image/png'
  resolved.quality = resolved.quality ?? 1
  resolved.maximumCanvasSize = resolved.maximumCanvasSize ?? 16384

  if (!resolved.scale) {
    resolved.scale = Number(
      (IS_NODE ? process.env.devicePixelRatio : 0)
      || node.ownerDocument?.defaultView?.devicePixelRatio
      || 1,
    )
  }

  if ((!resolved.width || !resolved.height) && isElementNode(node)) {
    const box = node.getBoundingClientRect()
    resolved.width = resolved.width
      || box.width
      || Number(node.getAttribute('width'))
      || 0
    resolved.height = resolved.height
      || box.height
      || Number(node.getAttribute('height'))
      || 0
  }

  return resolved
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
