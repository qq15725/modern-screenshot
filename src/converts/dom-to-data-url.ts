import { consoleTime, consoleTimeEnd } from '../utils'
import { domToCanvas } from './dom-to-canvas'

import type { ImageOptions, Options } from '../options'

export async function domToDataUrl<T extends Node>(
  node: T,
  options?: Options & ImageOptions,
): Promise<string> {
  const debug = options?.debug
  const canvas = await domToCanvas(node, options)
  debug && consoleTime('canvas to data url')
  const dataURL = canvas.toDataURL(options?.type, options?.quality)
  debug && consoleTimeEnd('canvas to data url')
  return dataURL
}
