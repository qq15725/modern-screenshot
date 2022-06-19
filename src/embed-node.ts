import { embedNodeImage } from './embed-node-image'
import { embedStyleBackground } from './embed-style-background'
import { embedStyleFont } from './embed-style-font'
import { arrayFrom } from './utils'

import type { HandleNodeFunc } from './types'

export const embedNode: HandleNodeFunc = async (cloned, options) => {
  await embedNodeImage(cloned, options)
  await embedStyleBackground(cloned, options)
  await embedStyleFont(cloned, options)
  await Promise.all(
    arrayFrom<typeof cloned>(cloned.childNodes)
      .map((child) => embedNode(child, options)),
  )
}
