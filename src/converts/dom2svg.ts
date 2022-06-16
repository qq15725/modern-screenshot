import { cloneNode } from '../clone-node'
import { inlineImage } from '../inline-image'
import { inlineBackground } from '../inline-background'

export interface Dom2svgOptions {
  width?: number
  height?: number
}

export function resolveOptions(node: HTMLElement, userOptions: Dom2svgOptions) {
  return {
    width: userOptions?.width ?? node.scrollWidth,
    height: userOptions?.height ?? node.scrollHeight,
  }
}

export async function dom2svg(node: HTMLElement, userOptions: Dom2svgOptions) {
  const { width, height } = resolveOptions(node, userOptions)
  const clone = await cloneNode(node)
  await inlineImage(clone)
  await inlineBackground(clone)
  clone.setAttribute('xmlns', 'http://www.w3.org/1999/xhtml')
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${ width }" height="${ height }">
  <foreignObject x="0" y="0" width="100%" height="100%">
    ${ new XMLSerializer().serializeToString(clone) }
  </foreignObject>
</svg>`
}
