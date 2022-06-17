export function resolveOptions(node: HTMLElement, userOptions: Options) {
  return {
    ...userOptions,
    width: userOptions?.width ?? node.scrollWidth,
    height: userOptions?.height ?? node.scrollHeight,
  }
}

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
   * A number between `0` and `1` indicating image quality (e.g. 0.92 => 92%)
   * of the JPEG image.
   */
  quality?: number

  /**
   * A string indicating the image format. The default type is image/png; that type is also used if the given type isn't supported.
   */
  type?: string

  /**
   * Set to `true` to append the current time as a query string to URL
   * requests to enable cache busting.
   */
  cacheBust?: boolean

  /**
   * A data URL for a placeholder image that will be used when fetching
   * an image fails. Defaults to an empty string and will render empty
   * areas for failed images.
   */
  imagePlaceholder?: string

  /**
   * The preferred font format. If specified all other font formats are ignored.
   */
  preferredFontFormat?: 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg' | string

  /**
   * the second parameter of window.fetch RequestInit
   */
  fetchRequestInit?: RequestInit
}
