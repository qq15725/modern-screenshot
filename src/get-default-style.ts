import { uuid } from './utils'
import type { Context } from './context'

export function getDefaultStyle(nodeName: string, pseudoElement: string | null, context: Context) {
  nodeName = nodeName.toLowerCase()
  const { defaultComputedStyles, ownerDocument } = context
  const key = `${ nodeName }${ pseudoElement ?? '' }`
  if (defaultComputedStyles.has(key)) return defaultComputedStyles.get(key)!
  let sandbox = context.sandbox
  if (!sandbox) {
    if (ownerDocument) {
      sandbox = ownerDocument.createElement('iframe')
      sandbox.id = `__SANDBOX__-${ uuid() }`
      sandbox.width = '0'
      sandbox.height = '0'
      sandbox.style.visibility = 'hidden'
      sandbox.style.position = 'fixed'
      ownerDocument.body.appendChild(sandbox)
      sandbox.contentWindow?.document.write('<!DOCTYPE html><meta charset="UTF-8"><title></title><body>')
      context.sandbox = sandbox
    }
  }
  if (!sandbox) return {}
  const sandboxWindow = sandbox.contentWindow
  if (!sandboxWindow) return {}
  const sandboxDocument = sandboxWindow.document
  const el = sandboxDocument.createElement(nodeName)
  sandboxDocument.body.appendChild(el)
  // Ensure that there is some content, so properties like margin are applied
  el.textContent = ' '
  const style = sandboxWindow.getComputedStyle(el, pseudoElement)
  const styles: Record<string, any> = {}
  for (let i = style.length - 1; i >= 0; i--) {
    const name = style.item(i)
    if (name === 'width' || name === 'height') {
      styles[name] = 'auto'
    } else {
      styles[name] = style.getPropertyValue(name)
    }
  }
  sandboxDocument.body.removeChild(el)
  defaultComputedStyles.set(key, styles)
  return styles
}
