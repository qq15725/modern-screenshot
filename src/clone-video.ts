import { loadImage } from './utils'
import { fetchToDataUrl } from './fetch'

import type { Options } from './options'

export async function cloneVideo(
  node: HTMLVideoElement,
  options?: Options,
): Promise<HTMLImageElement> {
  return loadImage(await fetchToDataUrl(node.poster, options))
}
