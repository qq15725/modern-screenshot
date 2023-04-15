import { getDefaultStyle } from './get-default-style'
import { uuid } from './utils'
import type { Context } from './context'

const ignoredStyles = [
  'content',
  '-webkit-locale',
  '-webkit-text-fill-color',
]

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
  style: CSSStyleDeclaration,
  cloned: T,
  context: Context,
) {
  const { ownerWindow, svgStyleElement, svgStyles } = context

  if (!svgStyleElement || !ownerWindow) return

  function copyBy(pseudoClass: string) {
    const style = ownerWindow!.getComputedStyle(node, pseudoClass)
    const content = style.getPropertyValue('content')
    if (!content || content === 'none') return
    const klasses = [uuid()]
    const defaultStyle = getDefaultStyle(node.nodeName, pseudoClass, context)
    const cloneStyle = [
      `content: '${ content.replace(/'|"/g, '') }';`,
    ]
    for (let i = style.length - 1; i >= 0; i--) {
      const name = style.item(i)
      if (ignoredStyles.includes(name)) continue
      const value = style.getPropertyValue(name)
      const priority = style.getPropertyPriority(name)
      // fix background-clip: text
      if (name === 'background-clip' && value === 'text') {
        klasses.push(' ______background-clip--text')
      }
      // Skip default style
      if (defaultStyle[name] === value && !priority) continue
      cloneStyle.push(`${ name }: ${ value }${ priority ? ' !important' : '' };`)
    }
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

  const overflow = style.overflow

  if (
    overflow.includes('scroll')
    || (
      (overflow.includes('auto') || overflow.includes('overlay'))
      && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
    )
  ) {
    scrollbarPseudoClasses.forEach(copyBy)
  }
}
