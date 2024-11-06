export function getDiffStyle(
  style: CSSStyleDeclaration,
  defaultStyle: Map<string, string>,
  includeStyleProperties?: string[] | null,
): Map<string, [string, string]> {
  const diffStyle = new Map<string, [string, string]>()
  const prefixs: string[] = []
  const prefixTree = new Map<string, Map<string, [string, string]>>()

  if (includeStyleProperties) {
    for (const name of includeStyleProperties) {
      applyTo(name)
    }
  }
  else {
    for (let len = style.length, i = 0; i < len; i++) {
      const name = style.item(i)
      applyTo(name)
    }
  }

  for (let len = prefixs.length, i = 0; i < len; i++) {
    prefixTree.get(prefixs[i])
      ?.forEach((value, name) => diffStyle.set(name, value))
  }

  function applyTo(name: string): void {
    const value = style.getPropertyValue(name)
    const priority = style.getPropertyPriority(name)

    const subIndex = name.lastIndexOf('-')
    const prefix = subIndex > -1 ? name.substring(0, subIndex) : undefined
    if (prefix) {
      let map = prefixTree.get(prefix)
      if (!map) {
        map = new Map()
        prefixTree.set(prefix, map)
      }
      map.set(name, [value, priority])
    }

    if (defaultStyle.get(name) === value && !priority)
      return

    if (prefix) {
      prefixs.push(prefix)
    }
    else {
      diffStyle.set(name, [value, priority])
    }
  }

  return diffStyle
}
