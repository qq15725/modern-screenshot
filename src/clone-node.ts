import { loadImage, getUid } from './utils'

export async function cloneNode(node: HTMLElement) {
  const clone = await shallowCloneNode(node)
  copyChildren(node, clone)
  if (clone instanceof Element) {
    copyStyle(node, clone)
    copyUserInput(node, clone)
    fixSvg(clone)
    copyPseudo(node, clone)
  }
  return clone
}

async function shallowCloneNode(node: HTMLElement) {
  return node instanceof HTMLCanvasElement
    ? await loadImage(node.toDataURL())
    : node.cloneNode(false) as HTMLElement
}

function copyChildren(node: HTMLElement, clone: HTMLElement) {
  node.childNodes.forEach(async child => {
    clone.appendChild(await cloneNode(child as HTMLElement))
  })
}

function copyStyle(node: HTMLElement, clone: HTMLElement) {
  const source = window.getComputedStyle(node)
  const target = clone.style
  if (source.cssText) {
    target.cssText = source.cssText
  } else {
    Object.keys(source).forEach(name => {
      target.setProperty(
        name,
        source.getPropertyValue(name),
        source.getPropertyPriority(name)
      )
    })
  }
}

function copyUserInput(node: HTMLElement, clone: HTMLElement) {
  if (node instanceof HTMLTextAreaElement) clone.innerHTML = node.value
  if (node instanceof HTMLInputElement) clone.setAttribute('value', node.value)
}

function fixSvg(node: HTMLElement) {
  if (node instanceof SVGElement) node.setAttribute('xmlns', 'http://www.w3.org/2000/svg')
  if (node instanceof SVGRectElement) {
    ['width', 'height'].forEach(function (attribute) {
      var value = node.getAttribute(attribute)
      if (value) node.style.setProperty(attribute, value)
    })
  }
}

function copyPseudo(node: HTMLElement, clone: HTMLElement) {
  [':before', ':after'].forEach(element => {
    var style = window.getComputedStyle(node, element)
    var content = style.getPropertyValue('content')
    if (content === '' || content === 'none') return
    const klass = getUid()
    clone.className = clone.className + ' ' + klass
    const styleEl = document.createElement('style')
    styleEl.appendChild(formatPseudoStyle(klass, element, style))
    clone.appendChild(styleEl)
  })
}

function formatPseudoStyle(klass: string, pseudo: string, style: CSSStyleDeclaration) {
  const cssText = style.cssText
    ? formatCssText(style)
    : formatCssProperties(style)
  return document.createTextNode(
    `.${ klass }:${ pseudo }{${ cssText }}`
  )
}

function formatCssText(style: CSSStyleDeclaration) {
  return `${ style.cssText } content: ${ style.getPropertyValue('content') }`
}

function formatCssProperties(style: CSSStyleDeclaration) {
  return `${
    Object.keys(style)
      .map(name => {
        return `${ name }: ${ style.getPropertyValue(name) } ${
          style.getPropertyPriority(name) ? '!important' : ''
        }`
      })
      .join('; ')
  };`
}
