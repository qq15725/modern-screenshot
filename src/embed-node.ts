import { embedImageElement } from './embed-image-element'
import { embedCssStyleImage } from './embed-css-style-image'
import { embedSvgUse } from './embed-svg-use'
import {
  isElementNode,
  isHTMLElementNode,
  isImageElement,
  isSVGImageElementNode,
  isSVGUseElementNode,
} from './utils'
import type { Context } from './context'

export function embedNode<T extends Node>(cloned: T, context: Context) {
  const { tasks } = context

  if (isElementNode(cloned)) {
    if (isImageElement(cloned) || isSVGImageElementNode(cloned)) {
      tasks.push(...embedImageElement(cloned, context))
    }

    if (isSVGUseElementNode(cloned)) {
      tasks.push(...embedSvgUse(cloned, context))
    }
  }

  if (isHTMLElementNode(cloned)) {
    tasks.push(...embedCssStyleImage(cloned.style, context))
  }

  cloned.childNodes.forEach(child => {
    embedNode(child, context)
  })
}
