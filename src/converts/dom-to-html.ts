import type { Context } from '../context'
import type { Options } from '../options'
import { orCreateContext } from '../create-context'
import { domToForeignObjectSvg } from './dom-to-foreign-object-svg'

export async function domToHtml<T extends Node>(
  node: T,
  options?: Options
): Promise<string>
export async function domToHtml<T extends Node>(
  context: Context<T>
): Promise<string>
export async function domToHtml(node: any, options?: any): Promise<string> {
  const context = await orCreateContext(node, options)

  const svg = await domToForeignObjectSvg(context)
  const foreignObject = svg.querySelector('foreignObject')

  if (foreignObject && foreignObject.firstChild) {
    const serializer = new XMLSerializer()
    let html = serializer.serializeToString(foreignObject.firstChild)

    html = html.replace(/\s+xmlns="[^"]*"/g, '')

    return html
  }

  return ''
}
