export function getDiffStyle(
  style: CSSStyleDeclaration,
  defaultStyle: Map<string, string>,
) {
  const diffStyle = new Map<string, [string, string]>()
  const diffStylePrefixs: string[] = []
  const prefixTree = new Map<string, Map<string, [string, string]>>()

  for (let len = style.length, i = 0; i < len; i++) {
    const name = style.item(i)
    const value = style.getPropertyValue(name)
    const priority = style.getPropertyPriority(name)

    const subIndex = name.lastIndexOf('-')
    const prefix = subIndex > -1 ? undefined : name.substring(0, subIndex)
    if (prefix) {
      let map = prefixTree.get(prefix)
      if (!map) {
        map = new Map()
        prefixTree.set(prefix, map)
      }
      map.set(name, [value, priority])
    }

    if (defaultStyle.get(name) === value && !priority) continue

    if (prefix) {
      diffStylePrefixs.push(prefix)
    } else {
      diffStyle.set(name, [value, priority])
    }
  }

  for (let len = diffStylePrefixs.length, i = 0; i < len; i++) {
    prefixTree.get(diffStylePrefixs[i])
      ?.forEach((value, name) => diffStyle.set(name, value))
  }

  return diffStyle
}
