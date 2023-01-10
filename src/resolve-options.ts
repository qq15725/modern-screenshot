import { consoleTime, consoleTimeEnd } from './log'
import { IS_NODE, isElementNode, isHTMLElementNode, isImageElement, loadMedia, waitLoaded } from './utils'
import type { Options, ResolvedOptions } from './options'

export async function resolveOptions(node: Node, userOptions?: Options): Promise<ResolvedOptions> {
  if ((userOptions as any)?.resolved) return userOptions as ResolvedOptions
  userOptions?.debug && consoleTime('resolve options')

  const ownerWindow = node.ownerDocument?.defaultView

  const options = {
    width: 0,
    height: 0,
    timeout: 3000,
    maximumCanvasSize: 16384,
    ...userOptions,
    resolved: true,
  } as ResolvedOptions

  if (isHTMLElementNode(node) && !options.loaded) {
    if (isImageElement(node)) {
      await loadMedia(node, { timeout: options.timeout })
    } else {
      await waitLoaded(node, options.timeout)
    }
    options.loaded = true
  }

  if (!options.scale) {
    options.scale = Number(
      (IS_NODE ? process.env.devicePixelRatio : 0)
      || ownerWindow?.devicePixelRatio
      || 1,
    )
  }

  if ((!options.width || !options.height) && isElementNode(node)) {
    const box = node.getBoundingClientRect()

    options.width = options.width
      || box.width
      || Number(node.getAttribute('width'))
      || 0

    options.height = options.height
      || box.height
      || Number(node.getAttribute('height'))
      || 0
  }

  userOptions?.debug && consoleTimeEnd('resolve options')
  return options
}

export function applyCssStyleWithOptions(style: CSSStyleDeclaration, options: ResolvedOptions) {
  const { backgroundColor, width, height, style: styles } = options
  if (backgroundColor) style.backgroundColor = backgroundColor
  if (width) style.width = `${ width }px`
  if (height) style.height = `${ height }px`
  if (styles) {
    for (const name in styles) {
      style[name] = styles[name]!
    }
  }
}
