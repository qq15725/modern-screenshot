import { embedImageElement } from './embed-image-element'
import { embedCssStyleImage } from './embed-css-style-image'
import {
  isElementNode,
  isHTMLElementNode,
  isImageElement,
  isSVGImageElementNode,
} from './utils'

import type { ResolvedOptions } from './options'

export function embedNode<T extends Node>(clone: T, options: ResolvedOptions): Promise<void>[] {
  return [
    isElementNode(clone)
    && (isImageElement(clone) || isSVGImageElementNode(clone))
    && embedImageElement(clone, options),

    isHTMLElementNode(clone) && embedCssStyleImage(clone.style, options),

    ...Array.from(clone.childNodes).map(child => embedNode(child, options)),
  ].filter(Boolean).flat() as any
}
