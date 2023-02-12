import { getDefaultStyle } from './get-default-style'
import { IN_CHROME } from './utils'
import type { Context } from './context'

const ignored = [
  'transitionProperty',
  'all', // svg: all
  'd', // svg: d
  'content', // Safari shows pseudoelements if content is set
]

export function copyCssStyles<T extends HTMLElement | SVGElement>(
  node: T,
  style: CSSStyleDeclaration,
  clone: T,
  isRoot: boolean,
  context: Context,
) {
  const cloneClasses = clone.classList
  const cloneStyle = clone.style
  const defaultStyle = getDefaultStyle(node.tagName, context)

  // clean class list
  while (cloneClasses.length > 0) {
    const name = cloneClasses.item(0)
    name && cloneClasses.remove(name)
  }

  cloneStyle.transitionProperty = 'none'

  for (let i = style.length - 1; i >= 0; i--) {
    const name = style.item(i)

    if (ignored.includes(name)) {
      continue
    }

    const value = style.getPropertyValue(name)
    const priority = style.getPropertyPriority(name)

    // Clean "margin" of root node
    if (
      isRoot
      && name.startsWith('margin')
      && value
    ) {
      cloneStyle.setProperty(name, '0', priority)
      continue
    }

    // fix background-clip: text
    if (name === 'background-clip' && value === 'text') {
      clone.classList.add('______background-clip--text')
    }

    // Skip default style
    if (
      defaultStyle[name] === value
      && !node.getAttribute(name)
      && !priority
    ) {
      continue
    }

    cloneStyle.setProperty(name, value, priority)

    // fix border width
    if (name.startsWith('border') && name.endsWith('style')) {
      const widthName = name.replace('style', 'width')
      if (!cloneStyle.getPropertyValue(widthName)) {
        cloneStyle.setProperty(widthName, '0')
      }
    }
  }

  // fix chromium
  // https://github.com/RigoCorp/html-to-image/blob/master/src/cssFixes.ts
  if (IN_CHROME) {
    if (cloneStyle.fontKerning === 'auto') {
      cloneStyle.fontKerning = 'normal'
    }

    if (
      cloneStyle.overflow === 'hidden'
      && cloneStyle.textOverflow === 'ellipsis'
      && node.scrollWidth === node.clientWidth
    ) {
      cloneStyle.textOverflow = 'clip'
    }
  }
}
