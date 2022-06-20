import { loadImage } from './utils'
import { fetchDataUrl } from './fetch'

import type { Options } from './options'

export async function cloneVideo(
  node: HTMLVideoElement,
  options?: Options,
): Promise<HTMLImageElement> {
  return loadImage(await fetchDataUrl(node.poster, options))
}
