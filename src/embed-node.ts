import { embedImageElement } from './embed-image-element'
import { embedCssStyleImage } from './embed-css-style-image'
import {
  isElementNode,
  isHTMLElementNode,
  isImageElement,
  isSVGImageElementNode,
} from './utils'
import type { Context } from './context'

export function embedNode<T extends Node>(clone: T, context: Context) {
  const { tasks } = context

  if (isElementNode(clone)) {
    if (isImageElement(clone) || isSVGImageElementNode(clone)) {
      tasks.push(...embedImageElement(clone, context))
    }
  }

  if (isHTMLElementNode(clone)) {
    tasks.push(...embedCssStyleImage(clone.style, context))
  }

  clone.childNodes.forEach(child => {
    embedNode(child, context)
  })
}
