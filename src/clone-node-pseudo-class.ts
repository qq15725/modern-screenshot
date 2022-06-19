import { arrayFrom, uuid } from './utils'

import type { DepthCloneNodeFunc } from './types'

type Pseudo = ':before' | ':after'

export const cloneNodePseudoClass: DepthCloneNodeFunc = async (node, cloned) => {
  if (node instanceof Element
    && cloned instanceof Element) {
    _cloneNodePseudoClass(node, cloned, ':before')
    _cloneNodePseudoClass(node, cloned, ':after')
  }
}

function _cloneNodePseudoClass(node: Element, cloned: Element, pseudo: Pseudo) {
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
