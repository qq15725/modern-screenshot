import { arrayFrom } from './utils'

const DEFAULT_STYLE = getDefaultComputedStyle()

export function cloneStyle<T extends HTMLElement>(node: T, cloned: T): T {
  if (node instanceof Element) {
    const source = window.getComputedStyle(node)
    const target = cloned.style

    if (target) {
      if (source.cssText) {
        target.cssText = source.cssText
      } else {
        arrayFrom<string>(source).forEach((name) => {
          const value = source.getPropertyValue(name)
          const priority = source.getPropertyPriority(name)
          if (DEFAULT_STYLE[name] === value && !priority) return
          target.setProperty(name, value, priority)
        })
      }
    }
  }

  return cloned
}

function getDefaultComputedStyle() {
  const style: Record<string, string> = {}
  const el = document.createElement(`egami--${ new Date().getTime() }`)
  document.body.appendChild(el)
  const source = window.getComputedStyle(el)
  arrayFrom<string>(source).forEach((name) => style[name] = source.getPropertyValue(name))
  el.remove()
  return style
}
