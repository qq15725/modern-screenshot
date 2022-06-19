import { arrayFrom } from './utils'
import { cloneNodeShallow } from './clone-node-shallow'
import { cloneNodePseudoClass } from './clone-node-pseudo-class'
import { cloneNodeInput } from './clone-node-input'
import { cloneStyle } from './clone-style'

import type { CloneFilteredNodeFunc, CloneNodeFunc } from './types'

const isSlotElement = (node: Node): node is HTMLSlotElement =>
  node instanceof Element
  && node.tagName != null
  && node.tagName.toUpperCase() === 'SLOT'

export const cloneNode: CloneNodeFunc = async (node, options) => {
  const cloned = await cloneNodeShallow(node, options)
  await cloneNodePseudoClass(node, cloned)
  await cloneNodeInput(node, cloned)
  await cloneStyle(node, cloned)

  const cloneByFilteredNode: CloneFilteredNodeFunc = async (node, options) => {
    if (options?.filter && !options.filter(node)) return null
    return cloneNode(node, options)
  }
  const children = isSlotElement(node) && node.assignedNodes
    ? arrayFrom<typeof node>(node.assignedNodes())
    : arrayFrom<typeof node>(((node as any).shadowRoot ?? node).childNodes)
  if (children.length === 0 || node instanceof HTMLVideoElement) return cloned
  const childNodes = await Promise.all(
    arrayFrom(children)
      .map(childNode => cloneByFilteredNode(childNode as HTMLElement, options)),
  )
  childNodes.forEach(childNode => {
    childNode && cloned.appendChild(childNode)
  })

  return cloned
}
