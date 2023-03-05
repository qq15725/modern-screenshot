import { copyPseudoContent } from './copy-pseudo-content'
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
  clone: T,
  child: ChildNode,
  context: Context,
): Promise<void> {
  if (isElementNode(child) && (isStyleElement(child) || isScriptElement(child))) return

  if (context.filter && !context.filter(child)) return

  clone.appendChild(await cloneNode(child, context))
}

async function cloneChildNodes<T extends Node>(
  node: T,
  clone: T,
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
        await appendChildNode(clone, nodes[i] as ChildNode, context)
      }
    } else {
      await appendChildNode(clone, child, context)
    }
  }
}

function applyCssStyleWithOptions(style: CSSStyleDeclaration, context: Context) {
  const { backgroundColor, width, height, style: styles } = context
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (width) style.width = `${ width }px`
  if (height) style.height = `${ height }px`
  if (styles) {
    for (const name in styles) {
      style[name] = styles[name]!
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
    const style = ownerWindow.getComputedStyle(node)

    if (style.display === 'none') {
      return ownerDocument.createComment(node.tagName.toLowerCase())
    }

    const clone = await cloneElement(node, context)
    const cloneStyle = clone.style

    copyCssStyles(node, style, clone, isRoot, context)

    if (isRoot) {
      applyCssStyleWithOptions(cloneStyle, context)
    }

    if (cloneStyle.fontFamily) {
      cloneStyle.fontFamily.split(',').forEach(val => fontFamilies.add(val))
    }

    copyPseudoContent(node, clone, ownerWindow)

    copyInputValue(node, clone)

    if (!isVideoElement(node)) {
      await cloneChildNodes(node, clone, context)
    }

    return clone
  }

  const clone = node.cloneNode(false)

  await cloneChildNodes(node, clone, context)

  return clone
}
