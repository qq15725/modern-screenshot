import { toArray, uuid } from './utils'

type Pseudo = ':before' | ':after'

export function clonePseudoElements<T extends HTMLElement>(
  nativeNode: T,
  clonedNode: T,
) {
  clonePseudoElement(nativeNode, clonedNode, ':before')
  clonePseudoElement(nativeNode, clonedNode, ':after')
}

function clonePseudoElement<T extends HTMLElement>(
  nativeNode: T,
  clonedNode: T,
  pseudo: Pseudo,
) {
  const style = window.getComputedStyle(nativeNode, pseudo)
  const content = style.getPropertyValue('content')
  if (content === '' || content === 'none') return

  const klass = uuid()

  try {
    clonedNode.className = `${ clonedNode.className } ${ klass }`
  } catch (err) {
    return
  }

  const styleElement = document.createElement('style')
  styleElement.appendChild(getPseudoElementStyle(klass, pseudo, style))
  clonedNode.appendChild(styleElement)
}

function getPseudoElementStyle(
  klass: string,
  pseudo: Pseudo,
  style: CSSStyleDeclaration,
): Text {
  const selector = `.${ klass }:${ pseudo }`
  const cssText = style.cssText
    ? formatCSSText(style)
    : formatCSSProperties(style)

  return document.createTextNode(`${ selector }{${ cssText }}`)
}

function formatCSSText(style: CSSStyleDeclaration) {
  const content = style.getPropertyValue('content')
  return `${ style.cssText } content: '${ content.replace(/'|"/g, '') }';`
}

function formatCSSProperties(style: CSSStyleDeclaration) {
  return toArray<string>(style)
    .map((name) => {
      const value = style.getPropertyValue(name)
      const priority = style.getPropertyPriority(name)
      return `${ name }: ${ value }${ priority ? ' !important' : '' };`
    })
    .join(' ')
}
