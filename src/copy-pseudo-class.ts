import { getDefaultStyle } from './get-default-style'
import { getDiffStyle } from './get-diff-style'
import { uuid } from './utils'
import type { Context } from './context'

const pseudoClasses = [
  ':before',
  ':after',
  // ':placeholder', TODO
]

const scrollbarPseudoClasses = [
  ':-webkit-scrollbar',
  ':-webkit-scrollbar-button',
  // ':-webkit-scrollbar:horizontal', TODO
  ':-webkit-scrollbar-thumb',
  ':-webkit-scrollbar-track',
  ':-webkit-scrollbar-track-piece',
  // ':-webkit-scrollbar:vertical', TODO
  ':-webkit-scrollbar-corner',
  ':-webkit-resizer',
]

export function copyPseudoClass<T extends HTMLElement | SVGElement>(
  node: T,
  cloned: T,
  copyScrollbar: boolean,
  context: Context,
) {
  const { ownerWindow, svgStyleElement, svgStyles } = context

  if (!svgStyleElement || !ownerWindow) return

  function copyBy(pseudoClass: string) {
    const computedStyle = ownerWindow!.getComputedStyle(node, pseudoClass)
    let content = computedStyle.getPropertyValue('content')

    if (!content || content === 'none') return

    content = content
      // TODO support css.counter
      .replace(/(')|(")|(counter\(.+\))/g, '')

    const klasses = [uuid()]
    const defaultStyle = getDefaultStyle(node, pseudoClass, context)
    const cloneStyle = [
      `content: '${ content }';`,
    ]

    const diffStyle = getDiffStyle(computedStyle, defaultStyle)

    // fix
    diffStyle.delete('content')
    diffStyle.delete('-webkit-locale')
    // fix background-clip: text
    if (diffStyle.get('background-clip')?.[0] === 'text') {
      cloned.classList.add('______background-clip--text')
    }

    diffStyle.forEach(([value, priority], name) => {
      cloneStyle.push(`${ name }: ${ value }${ priority ? ' !important' : '' };`)
    })

    if (cloneStyle.length === 1) return

    try {
      (cloned as any).className = [(cloned as any).className, ...klasses].join(' ')
    } catch (err) {
      return
    }

    const cssText = cloneStyle.join('\n  ')
    let allClasses = svgStyles.get(cssText)
    if (!allClasses) {
      allClasses = []
      svgStyles.set(cssText, allClasses)
    }
    allClasses.push(`.${ klasses[0] }:${ pseudoClass }`)
  }

  pseudoClasses.forEach(copyBy)

  if (copyScrollbar) scrollbarPseudoClasses.forEach(copyBy)
}
