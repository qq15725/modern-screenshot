import { createImage } from '../utils'
import { resolveOptions } from '../resolve-options'
import { domToDataUrl } from './dom-to-data-url'
import { domToSvg } from './dom-to-svg'
import type { ImageOptions, Options } from '../options'

export async function domToImage<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<HTMLImageElement> {
  const resolved = await resolveOptions(node, options)
  const url = options?.type === 'image/svg+xml'
    ? await domToSvg(node, resolved)
    : await domToDataUrl(node, resolved)
  const image = createImage(url, node.ownerDocument!)
  const { width, height, scale } = resolved
  image.width = Math.floor(width * scale)
  image.height = Math.floor(height * scale)
  image.style.width = `${ width }px`
  image.style.height = `${ height }px`
  return image
}
