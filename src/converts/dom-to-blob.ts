import { createContext } from '../create-context'
import { isContext } from '../utils'
import { domToCanvas } from './dom-to-canvas'
import { canvasToblob } from './canvas-to-blob'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToBlob<T extends Node>(node: T, options?: Options): Promise<Blob | null>
export async function domToBlob<T extends Node>(context: Context<T>): Promise<Blob | null>
export async function domToBlob(node: any, options?: any) {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true })
  const { type, quality } = context
  const canvas = await domToCanvas(context)
  return await canvasToblob(canvas, { type, quality })
}
