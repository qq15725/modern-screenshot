import { domToCanvas } from './dom-to-canvas'
import type { JpegOptions, Options } from '../options'

export async function domToJpeg<T extends Node>(
  node: T,
  options?: Options & JpegOptions,
): Promise<string> {
  const canvas = await domToCanvas(node, options)
  return canvas.toDataURL('image/jpeg', options?.quality ?? 1.0)
}
