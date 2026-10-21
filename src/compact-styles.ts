import { isElementNode, uuid } from './utils'

export function compactStyles(cloned: Node, stylesheet?: HTMLStyleElement): void {
  if (!stylesheet || !isElementNode(cloned))
    return

  const elements = [cloned, ...cloned.querySelectorAll('*')]
  const classNames = new Set<string>()
  for (const element of elements)
    element.classList.forEach(className => classNames.add(className))
  const groups = new Map<string, Element[]>()
  for (const element of elements) {
    const cssText = element.getAttribute('style')
    if (!cssText)
      continue
    const group = groups.get(cssText)
    if (group)
      group.push(element)
    else
      groups.set(cssText, [element])
  }

  const rules: string[] = []
  for (const [cssText, group] of groups) {
    if (group.length < 2)
      continue

    let className = uuid()
    while (classNames.has(className))
      className = uuid()
    const rule = `.${className}{${cssText}}\n`
    const classLength = group.reduce((length, element) => {
      return length + (element.hasAttribute('class') ? className.length + 1 : ` class="${className}"`.length)
    }, 0)
    if (` style="${cssText}"`.length * group.length <= rule.length + classLength)
      continue

    classNames.add(className)
    for (const element of group) {
      element.removeAttribute('style')
      element.classList.add(className)
    }
    rules.push(rule)
  }
  if (rules.length)
    stylesheet.appendChild(stylesheet.ownerDocument.createTextNode(rules.join('')))
}
