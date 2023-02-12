import { createContext } from '../create-context'
import { createImage, isContext } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import { domToSvg } from './dom-to-svg'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToImage<T extends Node>(node: T, options?: Options): Promise<HTMLImageElement>
export async function domToImage<T extends Node>(context: Context<T>): Promise<HTMLImageElement>
export async function domToImage(node: any, options?: any) {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true })
  const { ownerDocument, width, height, scale, type } = context
  const url = type === 'image/svg+xml'
    ? await domToSvg(context)
    : await domToDataUrl(context)
  const image = createImage(url, ownerDocument)
  image.width = Math.floor(width * scale)
  image.height = Math.floor(height * scale)
  image.style.width = `${ width }px`
  image.style.height = `${ height }px`
  return image
}
