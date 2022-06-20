import type { Options } from './options'

export function getSize(node: Node, options?: Options) {
  let box = { width: 0, height: 0 }

  if (node instanceof Element) {
    box = node.getBoundingClientRect()
    if (!box.width) box.width = Number(node.getAttribute('width'))
    if (!box.height) box.height = Number(node.getAttribute('height'))
  }

  return {
    width: options?.width ?? box.width,
    height: options?.height ?? box.height,
  }
}
