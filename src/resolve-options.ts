import { consoleTime, consoleTimeEnd } from './log'
import { getDocument, isElementNode, isHTMLElementNode, isImageElement, loadMedia, waitLoaded } from './utils'
import type { Options, ResolvedOptions } from './options'

const cssText = `
.______background-clip--text {
  background-clip: text;
  -webkit-background-clip: text;
}
`

export async function resolveOptions(node: Node, userOptions?: Options): Promise<ResolvedOptions> {
  if ((userOptions as any)?.context) return userOptions as ResolvedOptions
  userOptions?.debug && consoleTime('resolve options')

  const styleEl = getDocument(node).createElement('style')
  styleEl.appendChild(styleEl.ownerDocument.createTextNode(cssText))

  const options = {
    width: 0,
    height: 0,
    scale: 1,
    maximumCanvasSize: 16384,
    timeout: 3000,
    ...userOptions,
    context: {
      fontFamilies: new Set(),
      styleEl,
      tasks: [],
    },
  } as ResolvedOptions

  if (isHTMLElementNode(node)) {
    if (isImageElement(node)) {
      await loadMedia(node, { timeout: options.timeout })
    } else {
      await waitLoaded(node, options.timeout)
    }
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
