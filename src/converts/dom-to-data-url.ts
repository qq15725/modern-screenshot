import { createContext } from '../create-context'
import { consoleTime, consoleTimeEnd, isContext } from '../utils'
import { domToCanvas } from './dom-to-canvas'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToDataUrl<T extends Node>(node: T, options?: Options): Promise<string>
export async function domToDataUrl<T extends Node>(context: Context<T>): Promise<string>
export async function domToDataUrl(node: any, options?: any) {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true })
  const { debug, quality, type } = context
  const canvas = await domToCanvas(context)
  debug && consoleTime('canvas to data url')
  const dataURL = canvas.toDataURL(type, quality)
  debug && consoleTimeEnd('canvas to data url')
  return dataURL
}
