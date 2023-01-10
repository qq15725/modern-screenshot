import { domToDataUrl } from './dom-to-data-url'
import type { JpegOptions, Options } from '../options'

export async function domToJpeg<T extends Node>(
  node: T,
  options?: Options & JpegOptions,
): Promise<string> {
  return domToDataUrl(node, { ...options, type: 'image/jpeg' })
}
