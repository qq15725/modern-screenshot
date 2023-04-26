const getPrefix = (name: string) => name
  .split('-')
  .slice(0, -1)
  .join('-')

export function getDiffStyle(
  style: CSSStyleDeclaration,
  defaultStyle: Record<string, string>,
) {
  const diffStyle: Record<string, [string, string]> = {}
  const diffStylePrefixs: string[] = []
  const prefixTree: Record<string, Record<string, [string, string]>> = {}

  for (let len = style.length, i = 0; i < len; i++) {
    const name = style.item(i)
    const value = style.getPropertyValue(name)
    const priority = style.getPropertyPriority(name)

    const prefix = getPrefix(name)
    if (prefix) {
      prefixTree[prefix] = prefixTree[prefix] || {}
      prefixTree[prefix][name] = [value, priority]
    }

    if (defaultStyle[name] === value && !priority) continue

    if (prefix) {
      diffStylePrefixs.push(prefix)
    } else {
      diffStyle[name] = [value, priority]
    }
  }

  for (let len = diffStylePrefixs.length, i = 0; i < len; i++) {
    const prefix = diffStylePrefixs[i]

    if (!(prefix in prefixTree)) continue

    for (const [name, value] of Object.entries(prefixTree[prefix])) {
      diffStyle[name] = value
    }
  }

  return diffStyle
}
