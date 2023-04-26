import { getDefaultStyle } from './get-default-style'
import { getDiffStyle } from './get-diff-style'
import { IN_CHROME } from './utils'
import type { Context } from './context'

const ignoredStyle = [
  'transition-property',
  'all', // svg: all
  'd', // svg: d
  'content', // Safari shows pseudoelements if content is set
]

export function copyCssStyles<T extends HTMLElement | SVGElement>(
  node: T,
  computedStyle: CSSStyleDeclaration,
  cloned: T,
  context: Context,
) {
  const clonedStyle = cloned.style
  const defaultStyle = getDefaultStyle(node, null, context)
  const diffStyle = getDiffStyle(computedStyle, defaultStyle)

  for (const [name, [value, priority]] of Object.entries(diffStyle)) {
    if (ignoredStyle.includes(name)) continue

    // fix background-clip: text
    if (name === 'background-clip' && value === 'text') {
      cloned.classList.add('______background-clip--text')
    }

    clonedStyle.setProperty(name, value, priority)
  }

  clonedStyle.setProperty('transition-property', 'none')

  // fix chromium
  // https://github.com/RigoCorp/html-to-image/blob/master/src/cssFixes.ts
  if (IN_CHROME) {
    if (clonedStyle.fontKerning === 'auto') {
      clonedStyle.fontKerning = 'normal'
    }

    if (
      clonedStyle.overflow === 'hidden'
      && clonedStyle.textOverflow === 'ellipsis'
      && node.scrollWidth === node.clientWidth
    ) {
      clonedStyle.textOverflow = 'clip'
    }
  }
}
