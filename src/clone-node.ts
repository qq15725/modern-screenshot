import { copyPseudoContent } from './copy-pseudo-content'
import { copyInputValue } from './copy-input-value'
import { copyCssStyles } from './copy-css-styles'
import {
  isElementNode,
  isHTMLElementNode,
  isSVGElementNode,
  isScriptElement,
  isSlotElement,
  isStyleElement,
  isTextNode,
  isVideoElement,
} from './utils'
import { createElementClone } from './create-element-clone'
import type { Context } from './context'

function appendChildNode<T extends Node>(
  clone: T,
  child: ChildNode,
  context: Context,
  ownerWindow: Window | null | undefined,
): void {
  if (isElementNode(child) && (isStyleElement(child) || isScriptElement(child))) return

  if (context.filter && !context.filter(child)) return

  clone.appendChild(cloneNode(child, context, ownerWindow))
}

function cloneChildNodes<T extends Node>(
  node: T,
  clone: T,
  context: Context,
  ownerWindow: Window | null | undefined,
): void {
  const firstChild = (
    isElementNode(node)
      ? node.shadowRoot?.firstChild
      : undefined
  ) ?? node.firstChild

  for (let child = firstChild; child; child = child.nextSibling) {
    if (
      isElementNode(child)
      && isSlotElement(child)
      && typeof child.assignedNodes === 'function'
    ) {
      child.assignedNodes().forEach(assignedNode => {
        appendChildNode(clone, assignedNode as ChildNode, context, ownerWindow)
      })
    } else {
      appendChildNode(clone, child, context, ownerWindow)
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

export function cloneNode<T extends Node>(
  node: T,
  context: Context,
  ownerWindow?: Window | null,
) {
  const isRootNode = ownerWindow === undefined

  const ownerDocument = ownerWindow?.document ?? node.ownerDocument

  if (ownerDocument && isTextNode(node)) {
    return ownerDocument.createTextNode(node.data)
  }

  if (isRootNode) ownerWindow = ownerDocument?.defaultView

  if (ownerWindow
    && isElementNode(node)
    && (isHTMLElementNode(node) || isSVGElementNode(node))) {
    const clone = createElementClone(node, context)

    clone.style.transitionProperty = 'none'

    copyCssStyles(node, clone, ownerWindow, isRootNode)

    copyPseudoContent(node, clone, ownerWindow)

    copyInputValue(node, clone)

    if (!isVideoElement(node)) {
      cloneChildNodes(node, clone, context, ownerWindow)
    }

    if (isRootNode) {
      applyCssStyleWithOptions(clone.style, context)
    }

    if (clone.style.fontFamily) {
      context.fontFamilies.add(clone.style.fontFamily)
    }

    return clone
  }

  const clone = node.cloneNode(false)

  cloneChildNodes(node, clone, context, ownerWindow)

  return clone
}
