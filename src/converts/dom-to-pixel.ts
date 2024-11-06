import type { Context } from '../context'
import type { Options } from '../options'
import { orCreateContext } from '../create-context'
import { domToCanvas } from './dom-to-canvas'

export async function domToPixel<T extends Node>(node: T, options?: Options): Promise<Uint8ClampedArray>
export async function domToPixel<T extends Node>(context: Context<T>): Promise<Uint8ClampedArray>
export async function domToPixel(node: any, options?: any): Promise<Uint8ClampedArray> {
  const context = await orCreateContext(node, options)
  const canvas = await domToCanvas(context)
  return canvas.getContext('2d')!
    .getImageData(0, 0, canvas.width, canvas.height)
    .data
}
