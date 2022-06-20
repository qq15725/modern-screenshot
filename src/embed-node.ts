import { embedNodeImage } from './embed-node-image'
import { embedStyleBackground } from './embed-style-background'

import type { HandleNodeFunc } from './types'

export const embedNode: HandleNodeFunc = async (cloned, options) => {
  await embedNodeImage(cloned, options)
  await embedStyleBackground(cloned, options)
  await Promise.all(
    Array.from(cloned.childNodes)
      .map((child) => embedNode(child, options)),
  )
}
