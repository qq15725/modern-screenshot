import { createContext } from '../create-context'
import { isContext } from '../utils'
import { domToCanvas } from './dom-to-canvas'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToPixel<T extends Node>(node: T, options?: Options): Promise<Uint8ClampedArray>
export async function domToPixel<T extends Node>(context: Context<T>): Promise<Uint8ClampedArray>
export async function domToPixel(node: any, options?: any) {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true })
  const canvas = await domToCanvas(context)
  return canvas.getContext('2d')!
    .getImageData(0, 0, canvas.width, canvas.height)
    .data
}
