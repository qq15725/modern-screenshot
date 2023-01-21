import { embedImageElement } from './embed-image-element'
import { embedCssStyleImage } from './embed-css-style-image'
import {
  isElementNode,
  isHTMLElementNode,
  isImageElement,
  isSVGImageElementNode,
} from './utils'

import type { ResolvedOptions } from './options'

export function embedNode<T extends Node>(clone: T, options: ResolvedOptions) {
  const { tasks } = options.context

  if (
    isElementNode(clone)
    && (isImageElement(clone) || isSVGImageElementNode(clone))
  ) {
    tasks.push(embedImageElement(clone, options))
  }

  if (isHTMLElementNode(clone)) {
    tasks.push(embedCssStyleImage(clone.style, options))
  }

  clone.childNodes.forEach(child => {
    embedNode(child, options)
  })
}
