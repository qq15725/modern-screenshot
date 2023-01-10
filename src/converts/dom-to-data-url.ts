import { domToCanvas } from './dom-to-canvas'

import type { ImageOptions, Options } from '../options'

export async function domToDataUrl<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<string> {
  const canvas = await domToCanvas(node, options)
  return canvas.toDataURL(options?.type, options?.quality)
}
