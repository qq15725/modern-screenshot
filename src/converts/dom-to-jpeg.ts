import { createContext } from '../create-context'
import { isContext } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToJpeg<T extends Node>(node: T, options?: Options): Promise<string>
export async function domToJpeg<T extends Node>(context: Context<T>): Promise<string>
export async function domToJpeg(node: any, options?: any): Promise<string> {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true, type: 'image/jpeg' })
  return domToDataUrl(context)
}
