import { getDefaultStyle } from './get-default-style'
import { getDiffStyle } from './get-diff-style'
import { IN_CHROME } from './utils'
import type { Context } from './context'

export function copyCssStyles<T extends HTMLElement | SVGElement>(
  node: T,
  cloned: T,
  isRoot: boolean,
  context: Context,
) {
  const { ownerWindow } = context
  const clonedStyle = cloned.style
  const computedStyle = ownerWindow!.getComputedStyle(node)
  const defaultStyle = getDefaultStyle(node, null, context)
  const diffStyle = getDiffStyle(computedStyle, defaultStyle)

  // fix
  diffStyle.delete('transition-property')
  diffStyle.delete('all') // svg: all
  diffStyle.delete('d') // svg: d
  diffStyle.delete('content') // Safari shows pseudoelements if content is set
  if (isRoot) {
    diffStyle.delete('margin-top')
    diffStyle.delete('margin-right')
    diffStyle.delete('margin-bottom')
    diffStyle.delete('margin-left')
    diffStyle.delete('margin-block-start')
    diffStyle.delete('margin-block-end')
    diffStyle.delete('margin-inline-start')
    diffStyle.delete('margin-inline-end')
    diffStyle.set('box-sizing', ['border-box', ''])
  }
  // fix background-clip: text
  if (diffStyle.get('background-clip')?.[0] === 'text') {
    cloned.classList.add('______background-clip--text')
  }
  // fix chromium
  // https://github.com/RigoCorp/html-to-image/blob/master/src/cssFixes.ts
  if (IN_CHROME) {
    if (!diffStyle.has('font-kerning')) diffStyle.set('font-kerning', ['normal', ''])

    if (
      (
        diffStyle.get('overflow-x')?.[0] === 'hidden'
        || diffStyle.get('overflow-y')?.[0] === 'hidden'
      )
      && diffStyle.get('text-overflow')?.[0] === 'ellipsis'
      && node.scrollWidth === node.clientWidth
    ) {
      diffStyle.set('text-overflow', ['clip', ''])
    }
  }

  diffStyle.forEach(([value, priority], name) => {
    clonedStyle.setProperty(name, value, priority)
  })

  return diffStyle
}
