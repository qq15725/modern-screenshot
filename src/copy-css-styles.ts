import { getDefaultStyle } from './get-default-style'

export function copyCssStyles<T extends HTMLElement | SVGElement>(
  node: T,
  clone: T,
  ownerWindow: Window,
  isRootNode: boolean,
) {
  const style = ownerWindow.getComputedStyle(node)
  const cloneStyle = clone.style
  const defaultStyle = getDefaultStyle(node.tagName)

  for (let i = style.length - 1; i >= 0; i--) {
    const name = style.item(i)
    const value = style.getPropertyValue(name)
    const priority = style.getPropertyPriority?.(name) ?? ''

    // clean "margin" of root node
    if (
      isRootNode
      && name.startsWith('margin')
      && value
    ) {
      cloneStyle.setProperty(name, '0', priority)
      continue
    }

    // skip non user style
    if (
      defaultStyle[name] === value
      && !node.getAttribute(name)
      && !priority
    ) {
      continue
    }

    // fix background-clip: text
    if (name === 'background-clip' && value === 'text') {
      clone.classList.add('______background-clip--text')
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
  if (ownerWindow.navigator.userAgent.match(/\bChrome\//)) {
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
