import { toArray } from './utils'

const STYLES = getDefaultComputedStyle()

export function cloneCssStyle<T extends HTMLElement>(node: T, cloned: T): T {
  const source = window.getComputedStyle(node)
  const target = cloned.style
  if (target) {
    if (source.cssText) {
      target.cssText = source.cssText
    } else {
      toArray<string>(source).forEach((name) => {
        const value = source.getPropertyValue(name)
        const priority = source.getPropertyPriority(name)
        if (STYLES[name] === value && !priority) return
        target.setProperty(name, value, priority)
      })
    }
  }
  return cloned
}

function getDefaultComputedStyle() {
  const el = document.createElement(`egami--${ new Date().getTime() }`)
  document.body.appendChild(el)
  const styles: Record<string, string> = {}
  const source = window.getComputedStyle(el)
  toArray<string>(source).forEach((name) => styles[name] = source.getPropertyValue(name))
  el.remove()
  return styles
}
