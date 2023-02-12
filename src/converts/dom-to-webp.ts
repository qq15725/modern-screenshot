import { createContext } from '../create-context'
import { isContext } from '../utils'
import { domToDataUrl } from './dom-to-data-url'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToWebp<T extends Node>(node: T, options?: Options): Promise<string>
export async function domToWebp<T extends Node>(context: Context<T>): Promise<string>
export async function domToWebp(node: any, options?: any) {
  const context = isContext(node)
    ? node
    : await createContext(node, { ...options, autodestruct: true, type: 'image/webp' })
  return domToDataUrl(context)
}
