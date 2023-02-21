import { orCreateContext } from '../create-context'
import { domToDataUrl } from './dom-to-data-url'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToWebp<T extends Node>(node: T, options?: Options): Promise<string>
export async function domToWebp<T extends Node>(context: Context<T>): Promise<string>
export async function domToWebp(node: any, options?: any) {
  return domToDataUrl(
    await orCreateContext(node, { ...options, type: 'image/webp' }),
  )
}
