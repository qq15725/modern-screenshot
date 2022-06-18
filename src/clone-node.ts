import { arrayFrom } from './utils'
import { cloneNodeShallow } from './clone-node-shallow'
import { cloneNodePseudoClass } from './clone-node-pseudo-class'
import { cloneNodeInput } from './clone-node-input'
import { cloneStyle } from './clone-style'

import type { Options } from './options'

export async function cloneNode<T extends HTMLElement>(
  node: T,
  options?: Options,
  isRoot?: boolean,
) {
  if (!isRoot && options?.filter && !options.filter(node)) return null

  const cloned = await cloneNodeShallow(node, options)
  await cloneNodePseudoClass(node, cloned)
  await cloneNodeInput(node, cloned)
  await cloneStyle(node, cloned)
  await cloneChildren(node, cloned, options)
  return cloned
}

const isSlotElement = (node: HTMLElement): node is HTMLSlotElement =>
  node.tagName != null && node.tagName.toUpperCase() === 'SLOT'

async function cloneChildren<T extends HTMLElement>(node: T, cloned: T, options?: Options): Promise<T> {
  const children = isSlotElement(node) && node.assignedNodes
    ? arrayFrom<T>(node.assignedNodes())
    : arrayFrom<T>((node.shadowRoot ?? node).childNodes)

  if (children.length === 0 || node instanceof HTMLVideoElement) return cloned

  const childNodes = await Promise.all(
    arrayFrom(children).map(childNode => cloneNode(childNode as HTMLElement, options)),
  )

  childNodes.forEach(childNode => {
    childNode && cloned.appendChild(childNode)
  })

  return cloned
}
