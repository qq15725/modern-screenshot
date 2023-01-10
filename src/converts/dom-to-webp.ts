import { domToDataUrl } from './dom-to-data-url'
import type { Options } from '../options'

export async function domToWebp<T extends Node>(
  node: T,
  options?: Options,
): Promise<string> {
  return domToDataUrl(node, { ...options, type: 'image/webp' })
}
