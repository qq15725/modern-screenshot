import { uuid } from './utils'
import { getWindow } from './get-window'

import type { Options } from './options'
import type { DepthCloneNodeFunc } from './types'

type Pseudo = ':before' | ':after'

export const cloneNodePseudoClass: DepthCloneNodeFunc = async (node, cloned, options) => {
  if (node instanceof Element
    && cloned instanceof Element) {
    _cloneNodePseudoClass(node, cloned, ':before', options)
    _cloneNodePseudoClass(node, cloned, ':after', options)
  }
}

function _cloneNodePseudoClass(node: Element, cloned: Element, pseudo: Pseudo, options?: Options) {
  const style = getWindow(options).getComputedStyle(node, pseudo)

  const content = style.getPropertyValue('content')

  if (!content || content === 'none') return

  const klass = uuid()

  try {
    cloned.className = `${ cloned.className } ${ klass }`
  } catch (err) {
    return
  }

  const styleElement = getWindow(options).document.createElement('style')
  styleElement.appendChild(getPseudoClassStyle(klass, pseudo, style, options))
  cloned.appendChild(styleElement)
}

function getPseudoClassStyle(
  klass: string,
  pseudo: Pseudo,
  style: CSSStyleDeclaration,
  options?: Options,
): Text {
  const selector = `.${ klass }:${ pseudo }`
  const cssText = style.cssText
    ? formatCssText(style)
    : formatCssProps(style)
  return getWindow(options).document.createTextNode(`${ selector }{${ cssText }}`)
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
