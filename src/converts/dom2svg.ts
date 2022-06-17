import { cloneNode } from '../clone-node'
import { embedNode } from '../embed-node'
import { getImageSize, toArray } from '../utils'

import type { Options } from '../options'

export async function dom2svg<T extends HTMLElement>(
  node: T,
  options?: Options,
): Promise<SVGSVGElement> {
  await waitLoaded(node)
  const { width, height } = getImageSize(node, options)
  let clone = await cloneNode(node, options)
  clone = await embedNode(clone, options)
  clone = applyStyle(clone, options)
  const xmlns = 'http://www.w3.org/2000/svg'
  const svg = document.createElementNS(xmlns, 'svg')
  const foreignObject = document.createElementNS(xmlns, 'foreignObject')
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

export async function waitLoaded<T extends HTMLElement>(node: T) {
  const imgs = toArray<HTMLImageElement>(node.querySelectorAll('img'))
  return Promise.all(
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

export function applyStyle<T extends HTMLElement>(
  node: T,
  options?: Options,
): T {
  const { style } = node
  if (options?.backgroundColor) style.backgroundColor = options?.backgroundColor
  if (options?.width) style.width = `${ options?.width }px`
  if (options?.height) style.height = `${ options?.height }px`
  const styles = options?.style
  if (styles) {
    Object.keys(styles).forEach((key: any) => style[key] = styles[key] as string)
  }
  return node
}
