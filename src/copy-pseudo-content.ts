import { uuid } from './utils'

type Pseudo = ':before' | ':after'

export function copyPseudoContent<T extends HTMLElement | SVGElement>(
  node: T,
  cloned: T,
  ownerWindow: Window,
) {
  _copyPseudoContent(node, cloned, ':before', ownerWindow)
  _copyPseudoContent(node, cloned, ':after', ownerWindow)
}

function _copyPseudoContent(node: Element, cloned: Element, pseudo: Pseudo, ownerWindow: Window) {
  const ownerDocument = node.ownerDocument
  const style = ownerWindow.getComputedStyle(node, pseudo)

  const content = style.getPropertyValue('content')

  if (!content || content === 'none') return

  const klass = uuid()

  try {
    cloned.className = `${ cloned.className } ${ klass }`
  } catch (err) {
    return
  }

  const styleElement = ownerDocument.createElement('style')
  const selector = `.${ klass }:${ pseudo }`
  const cssText = style.cssText
    ? formatCssText(style)
    : formatCssProps(style)
  styleElement.appendChild(
    ownerDocument.createTextNode(`${ selector }{${ cssText }}`),
  )
  cloned.appendChild(styleElement)
}

function formatCssText(style: CSSStyleDeclaration) {
  const content = style.getPropertyValue('content')
  return `${ style.cssText } content: '${ content.replace(/'|"/g, '') }';`
}

function formatCssProps(style: CSSStyleDeclaration) {
  return Array.from(style)
    .map((name) => {
      const value = style.getPropertyValue(name)
      const priority = style.getPropertyPriority(name)
      return `${ name }: ${ value }${ priority ? ' !important' : '' };`
    })
    .join(' ')
}
