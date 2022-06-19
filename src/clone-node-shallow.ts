import { cloneCanvas } from './clone-canvas'
import { cloneVideo } from './clone-video'

import type { ShallowCloneNodeFunc } from './types'

export const cloneNodeShallow: ShallowCloneNodeFunc = async (node, options) => {
  if (node instanceof HTMLCanvasElement) return cloneCanvas(node)
  if (node instanceof HTMLVideoElement && node.poster) return cloneVideo(node, options)
  return node.cloneNode(false)
}
