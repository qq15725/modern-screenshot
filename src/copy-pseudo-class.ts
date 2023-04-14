import { getDefaultStyle } from './get-default-style'
import { uuid } from './utils'
import type { Context } from './context'

const ignoredStyles = [
  'content',
  '-webkit-locale',
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
  const { ownerDocument, ownerWindow, svgStyleElement } = context

  if (!svgStyleElement || !ownerDocument || !ownerWindow) return

  function copyBy(pseudoClass: string) {
    const style = ownerWindow!.getComputedStyle(node, pseudoClass)
    const content = style.getPropertyValue('content')
    if (!content || content === 'none') return
    const klasses = [uuid()]
    const defaultStyle = getDefaultStyle('DIV', pseudoClass, context)
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
      (cloned as any).className += ` ${ klasses.join(' ') }`
    } catch (err) {
      return
    }
    svgStyleElement!.appendChild(
      ownerDocument!.createTextNode(`.${ klasses[0] }:${ pseudoClass } {\n  ${ cloneStyle.join('\n  ') }\n}\n`),
    )
  }

  pseudoClasses.forEach(copyBy)

  if (
    style.overflow !== 'hidden'
    && (node.scrollHeight > node.clientHeight || node.scrollWidth > node.clientWidth)
  ) {
    scrollbarPseudoClasses.forEach(copyBy)
  }
}
