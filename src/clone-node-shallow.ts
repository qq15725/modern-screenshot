import { cloneCanvas } from './clone-canvas'
import { cloneVideo } from './clone-video'
import type { Options } from './options'

export async function cloneNodeShallow<T extends HTMLElement>(node: T, options?: Options) {
  if (node instanceof HTMLCanvasElement) return cloneCanvas(node)
  if (node instanceof HTMLVideoElement && node.poster) return cloneVideo(node, options)
  return node.cloneNode(false) as T
}
