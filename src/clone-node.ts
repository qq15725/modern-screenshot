import { copyPseudoClass } from './copy-pseudo-class'
import { copyInputValue } from './copy-input-value'
import { copyCssStyles } from './copy-css-styles'
import {
  isCommentNode,
  isElementNode,
  isHTMLElementNode,
  isSVGElementNode,
  isScriptElement,
  isSlotElement,
  isStyleElement,
  isTextNode,
  isVideoElement,
} from './utils'
import { cloneElement } from './clone-element'
import type { Context } from './context'

async function appendChildNode<T extends Node>(
  cloned: T,
  child: ChildNode,
  context: Context,
): Promise<void> {
  if (isElementNode(child) && (isStyleElement(child) || isScriptElement(child))) return

  if (context.filter && !context.filter(child)) return

  cloned.appendChild(await cloneNode(child, context))
}

async function cloneChildNodes<T extends Node>(
  node: T,
  cloned: T,
  context: Context,
): Promise<void> {
  const firstChild = (
    isElementNode(node)
      ? node.shadowRoot?.firstChild
      : undefined
  ) ?? node.firstChild

  for (let child = firstChild; child; child = child.nextSibling) {
    if (isCommentNode(child)) continue
    if (
      isElementNode(child)
      && isSlotElement(child)
      && typeof child.assignedNodes === 'function'
    ) {
      const nodes = child.assignedNodes()
      for (let i = 0; i < nodes.length; i++) {
        await appendChildNode(cloned, nodes[i] as ChildNode, context)
      }
    } else {
      await appendChildNode(cloned, child, context)
    }
  }
}

function applyCssStyleWithOptions(
  cloned: HTMLElement | SVGElement,
  context: Context,
) {
  const { backgroundColor, width, height, style: styles } = context
  const clonedStyle = cloned.style
  if (backgroundColor) clonedStyle.setProperty('background-color', backgroundColor, 'important')
  if (width) clonedStyle.setProperty('width', `${ width }px`, 'important')
  if (height) clonedStyle.setProperty('height', `${ height }px`, 'important')
  if (styles) for (const name in styles) clonedStyle[name] = styles[name]!
}

export async function cloneNode<T extends Node>(
  node: T,
  context: Context,
  isRoot = false,
): Promise<Node> {
  const { ownerDocument, ownerWindow, fontFamilies } = context

  if (ownerDocument && isTextNode(node)) {
    return ownerDocument.createTextNode(node.data)
  }

  if (
    ownerDocument
    && ownerWindow
    && isElementNode(node)
    && (isHTMLElementNode(node) || isSVGElementNode(node))
  ) {
    const cloned = await cloneElement(node, context)

    // fix abnormal attribute
    cloned.removeAttribute('"')

    const diffStyle = copyCssStyles(node, cloned, isRoot, context)

    if (isRoot) applyCssStyleWithOptions(cloned, context)

    const overflow = [
      diffStyle.get('overflow-x')?.[0],
      diffStyle.get('overflow-y')?.[1],
    ]

    copyPseudoClass(
      node,
      cloned,
      // copy scrollbar
      (overflow.includes('scroll'))
      || (
        (overflow.includes('auto') || overflow.includes('overlay'))
        && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
      ),
      context,
    )

    copyInputValue(node, cloned)

    diffStyle.get('font-family')?.[0]
      .split(',')
      .filter(Boolean)
      .map(val => val.toLowerCase())
      .forEach(val => fontFamilies.add(val))

    if (!isVideoElement(node)) {
      await cloneChildNodes(node, cloned, context)
    }

    return cloned
  }

  const cloned = node.cloneNode(false)

  await cloneChildNodes(node, cloned, context)

  return cloned
}
