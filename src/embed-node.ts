import { embedNodeImage } from './embed-node-image'
import { embedStyleBackground } from './embed-style-background'
import { embedWebFont } from './embed-web-font'

import type { HandleNodeFunc } from './types'

const _embedNode: HandleNodeFunc = async (cloned, options) => {
  await embedNodeImage(cloned, options)
  await embedStyleBackground(cloned, options)
  await Promise.all(
    Array.from(cloned.childNodes)
      .map((child) => _embedNode(child, options)),
  )
}

export const embedNode: HandleNodeFunc = async (cloned, options) => {
  await embedWebFont(cloned, options)
  await _embedNode(cloned, options)
}
