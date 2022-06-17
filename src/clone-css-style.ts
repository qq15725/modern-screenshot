import { toArray } from './utils'

export function cloneCssStyle<T extends HTMLElement>(node: T, cloned: T): T {
  const source = window.getComputedStyle(node)
  const target = cloned.style
  if (target) {
    if (source.cssText) {
      target.cssText = source.cssText
    } else {
      toArray<string>(source).forEach((name) => {
        target.setProperty(
          name,
          source.getPropertyValue(name),
          source.getPropertyPriority(name),
        )
      })
    }
  }
  return cloned
}
