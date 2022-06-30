import { embedImageElement } from './embed-image-element'
import { embedCssStyleImage } from './embed-css-style-image'
import {
  isElementNode,
  isHTMLElementNode,
  isImageElement,
  isSVGImageElementNode,
} from './utils'

import type { ResolvedOptions } from './options'

export async function embedNode<T extends Node>(clone: T, options: ResolvedOptions) {
  if (isElementNode(clone)) {
    if (isImageElement(clone) || isSVGImageElementNode(clone)) {
      await embedImageElement(clone, options)
    }
  }

  if (isHTMLElementNode(clone)) {
    await embedCssStyleImage(clone.style, options)
  }

  await Promise.all(
    Array.from(clone.childNodes)
      .map((child) => embedNode(child, options)),
  )
}
