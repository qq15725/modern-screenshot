import { createContext } from '../create-context'
import { createImage } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import { domToSvg } from './dom-to-svg'
import type { ImageOptions, Options } from '../options'

export async function domToImage<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<HTMLImageElement> {
  const context = await createContext(node, options)
  const url = options?.type === 'image/svg+xml'
    ? await domToSvg(node, context)
    : await domToDataUrl(node, context)
  const image = createImage(url, node.ownerDocument!)
  const { width, height, scale } = context
  image.width = Math.floor(width * scale)
  image.height = Math.floor(height * scale)
  image.style.width = `${ width }px`
  image.style.height = `${ height }px`
  return image
}
