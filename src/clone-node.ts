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

function applyCssStyleWithOptions(clonedStyle: CSSStyleDeclaration, context: Context) {
  const { backgroundColor, width, height, style: styles } = context
  if (backgroundColor) clonedStyle.backgroundColor = backgroundColor
  if (width) clonedStyle.width = `${ width }px`
  if (height) clonedStyle.height = `${ height }px`
  if (styles) {
    for (const name in styles) {
      clonedStyle[name] = styles[name]!
    }
  }
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

  if (ownerDocument
    && ownerWindow
    && isElementNode(node)
    && (isHTMLElementNode(node) || isSVGElementNode(node))) {
    const computedStyle = ownerWindow.getComputedStyle(node)

    const cloned = await cloneElement(node, context)
    const clonedStyle = cloned.style

    copyCssStyles(node, computedStyle, cloned, isRoot, context)

    if (isRoot) {
      applyCssStyleWithOptions(clonedStyle, context)
    }

    copyPseudoClass(node, computedStyle, cloned, context)

    copyInputValue(node, cloned)

    clonedStyle.getPropertyValue('font-family')
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
