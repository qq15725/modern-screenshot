import type { Context } from './context'

export function getDefaultStyle(tagName: string, context: Context) {
  const { defaultComputedStyles, sandbox } = context
  if (defaultComputedStyles.has(tagName)) return defaultComputedStyles.get(tagName)!
  if (!sandbox) return {}
  const ownerWindow = sandbox.contentWindow
  if (!ownerWindow) return {}
  const ownerDocument = ownerWindow.document
  const el = ownerDocument.createElement(tagName)
  ownerDocument.body.appendChild(el)
  // Ensure that there is some content, so properties like margin are applied
  el.textContent = ' '
  const style = ownerWindow.getComputedStyle(el)
  const styles: Record<string, any> = {}
  for (let i = style.length - 1; i >= 0; i--) {
    const name = style.item(i)
    if (name === 'width' || name === 'height') {
      styles[name] = 'auto'
    } else {
      styles[name] = style.getPropertyValue(name)
    }
  }
  ownerDocument.body.removeChild(el)
  defaultComputedStyles.set(tagName, styles)
  return styles
}
