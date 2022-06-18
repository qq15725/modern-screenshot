import { embedNodeImage } from './embed-node-image'
import { embedStyleBackground } from './embed-style-background'
import { embedStyleFont } from './embed-style-font'
import { arrayFrom } from './utils'

import type { Options } from './options'

export async function embedNode<T extends HTMLElement>(
  cloned: T,
  options?: Options,
): Promise<T> {
  await embedNodeImage(cloned, options)
  await embedStyleBackground(cloned, options)
  await embedStyleFont(cloned, options)
  await embedChildren(cloned, options)
  return cloned
}

async function embedChildren<T extends HTMLElement>(
  cloned: T,
  options?: Options,
): Promise<T> {
  await Promise.all(
    arrayFrom<HTMLElement>(cloned.childNodes)
      .map((child) => embedNode(child, options)),
  )
  return cloned
}
