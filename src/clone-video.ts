import { createImage } from './utils'
import { createDataUrl } from './embed-url-content'

import type { Options } from './options'

export async function cloneVideo(
  node: HTMLVideoElement,
  options?: Options,
): Promise<HTMLImageElement> {
  return createImage(await createDataUrl(node.poster, options))
}
