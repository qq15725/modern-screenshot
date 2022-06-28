import { cloneNode } from '../clone-node'
import { embedWebFont } from '../embed-web-font'
import { embedNode } from '../embed-node'
import { getSize } from '../get-size'
import { getWindow } from '../get-window'
import { removeDefaultStyleSandbox } from '../get-default-style'

import type { HandleNodeFunc } from '../types'
import type { Options } from '../options'

const applyStyle: HandleNodeFunc = async (node, options) => {
  if (!('style' in node)) return
  const style = (node as any).style as CSSStyleDeclaration
  if (options?.backgroundColor) style.backgroundColor = options?.backgroundColor
  if (options?.width) style.width = `${ options?.width }px`
  if (options?.height) style.height = `${ options?.height }px`
  const styles = options?.style
  if (styles) {
    Object.keys(styles).forEach((key: any) => style[key] = styles[key] as string)
  }
}

const waitLoaded: HandleNodeFunc = async node => {
  if (!('querySelectorAll' in node)) return
  const imgs = Array.from((node as unknown as ParentNode).querySelectorAll('img'))
  await Promise.all(
    imgs.map(img => {
      return new Promise<void>(resolve => {
        if (img.complete) {
          resolve()
        } else {
          const rawLoad = img.onload
          const rawError = img.onerror
          img.onload = function (...args) {
            resolve()
            rawLoad?.call(this, ...args)
          }
          img.onerror = function (...args) {
            resolve()
            rawError?.(...args)
          }
        }
      })
    }),
  )
}

export async function dom2svg<T extends Node>(
  node: T,
  options?: Options,
): Promise<SVGSVGElement> {
  await waitLoaded(node)
  const { width, height } = getSize(node, options)
  const clone = await cloneNode(node, options)
  removeDefaultStyleSandbox()
  await embedWebFont(clone, options)
  await embedNode(clone, options)
  applyStyle(clone, options)
  const xmlns = 'http://www.w3.org/2000/svg'
  const svg = getWindow(options).document.createElementNS(xmlns, 'svg')
  const foreignObject = getWindow(options).document.createElementNS(xmlns, 'foreignObject')
  svg.setAttribute('width', String(width))
  svg.setAttribute('height', String(height))
  svg.setAttribute('viewBox', `0 0 ${ width } ${ height }`)
  foreignObject.setAttribute('x', '0')
  foreignObject.setAttribute('y', '0')
  foreignObject.setAttribute('width', '100%')
  foreignObject.setAttribute('height', '100%')
  foreignObject.setAttribute('externalResourcesRequired', 'true')
  foreignObject.append(clone)
  svg.appendChild(foreignObject)
  return svg
}
