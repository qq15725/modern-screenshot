import { arrayFrom, uuid } from './utils'

type Pseudo = ':before' | ':after'

export function cloneNodePseudoClass<T extends HTMLElement>(
  node: T,
  cloned: T,
) {
  if (node instanceof Element) {
    _cloneNodePseudoClass(node, cloned, ':before')
    _cloneNodePseudoClass(node, cloned, ':after')
  }
  return cloned
}

function _cloneNodePseudoClass<T extends HTMLElement>(
  node: T,
  cloned: T,
  pseudo: Pseudo,
) {
  const style = window.getComputedStyle(node, pseudo)
  const content = style.getPropertyValue('content')

  if (!content || content === 'none') return

  const klass = uuid()

  try {
    cloned.className = `${ cloned.className } ${ klass }`
  } catch (err) {
    return
  }

  const styleElement = document.createElement('style')
  styleElement.appendChild(getPseudoClassStyle(klass, pseudo, style))
  cloned.appendChild(styleElement)
}

function getPseudoClassStyle(
  klass: string,
  pseudo: Pseudo,
  style: CSSStyleDeclaration,
): Text {
  const selector = `.${ klass }:${ pseudo }`
  const cssText = style.cssText
    ? formatCssText(style)
    : formatCssProps(style)

  return document.createTextNode(`${ selector }{${ cssText }}`)
}

function formatCssText(style: CSSStyleDeclaration) {
  const content = style.getPropertyValue('content')
  return `${ style.cssText } content: '${ content.replace(/'|"/g, '') }';`
}

function formatCssProps(style: CSSStyleDeclaration) {
  return arrayFrom<string>(style)
    .map((name) => {
      const value = style.getPropertyValue(name)
      const priority = style.getPropertyPriority(name)
      return `${ name }: ${ value }${ priority ? ' !important' : '' };`
    })
    .join(' ')
}
