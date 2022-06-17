import { toArray } from './utils'
import { clonePseudoElements } from './clone-pseudo'
import { cloneCssStyle } from './clone-css-style'
import { cloneInputValue } from './clone-input-value'
import { cloneSingleNode } from './clone-single-node'

import type { Options } from './options'

export async function cloneNode<T extends HTMLElement>(node: T, options?: Options) {
  const cloned = await cloneSingleNode(node, options)
  if (cloned instanceof Element) {
    cloneCssStyle(node, cloned)
    clonePseudoElements(node, cloned)
    cloneInputValue(node, cloned)
    fixSvg(cloned)
  }
  return await cloneChildren(node, cloned, options)
}

const isSlotElement = (node: HTMLElement): node is HTMLSlotElement =>
  node.tagName != null && node.tagName.toUpperCase() === 'SLOT'

async function cloneChildren<T extends HTMLElement>(node: T, cloned: T, options?: Options): Promise<T> {
  const children = isSlotElement(node) && node.assignedNodes
    ? toArray<T>(node.assignedNodes())
    : toArray<T>((node.shadowRoot ?? node).childNodes)

  if (children.length === 0 || node instanceof HTMLVideoElement) return cloned

  const childNodes = await Promise.all(
    toArray(children).map(childNode => cloneNode(childNode as HTMLElement, options)),
  )

  childNodes.forEach(childNode => {
    cloned.appendChild(childNode)
  })

  return cloned
}

function fixSvg(node: HTMLElement) {
  if (node instanceof SVGElement) node.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (node instanceof SVGRectElement) {
    ['width', 'height'].forEach((attribute) => {
      const value = node.getAttribute(attribute)
      if (value) node.style.setProperty(attribute, value)
    })
  }
}
