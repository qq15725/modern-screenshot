import { createContext } from '../create-context'
import { domToCanvas } from './dom-to-canvas'
import { canvasToblob } from './canvas-to-blob'

import type { ImageOptions, Options } from '../options'

export async function domToBlob<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<Blob | null> {
  const context = await createContext(node, options)
  const canvas = await domToCanvas(node, context as any)
  return await canvasToblob(canvas, context as any)
}
