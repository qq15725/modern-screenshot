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
import { applyCssStyleWithOptions } from './options'
import { createElementClone } from './create-element-clone'

import type { ResolvedOptions } from './options'

function appendChildNode<T extends Node>(
  clone: T,
  child: ChildNode,
  options: ResolvedOptions,
  ownerWindow: Window | null | undefined,
): void {
  if (isElementNode(child) && (isStyleElement(child) || isScriptElement(child))) return

  if (options.filter && !options.filter(child)) return

  clone.appendChild(cloneNode(child, options, ownerWindow))
}

function cloneChildNodes<T extends Node>(
  node: T,
  clone: T,
  options: ResolvedOptions,
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
        appendChildNode(clone, assignedNode as ChildNode, options, ownerWindow)
      })
    } else {
      appendChildNode(clone, child, options, ownerWindow)
    }
  }
}

export function cloneNode<T extends Node>(
  node: T,
  options: ResolvedOptions,
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
    const clone = createElementClone(node)

    clone.style.transitionProperty = 'none'

    copyCssStyles(node, clone, ownerWindow)

    copyPseudoContent(node, clone, ownerWindow)

    copyInputValue(node, clone)

    if (!isVideoElement(node)) {
      cloneChildNodes(node, clone, options, ownerWindow)
    }

    if (isRootNode) {
      applyCssStyleWithOptions(clone.style, options)
    }

    return clone
  }

  const clone = node.cloneNode(false)

  cloneChildNodes(node, clone, options, ownerWindow)

  return clone
}
