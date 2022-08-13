import { dom2canvas } from './dom2canvas'
import type { JpegOptions, Options } from '../options'

export async function dom2jpeg<T extends Node>(
  node: T,
  options?: Options & JpegOptions,
): Promise<string> {
  const canvas = await dom2canvas(node, options)

  return canvas.toDataURL('image/jpeg', options?.quality ?? 1.0)
}
