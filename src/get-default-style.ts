import { IN_BROWSER, getDocument } from './utils'

const SANDBOX_ID = 'modern-screenshot__sandbox'
let sandbox: HTMLIFrameElement | undefined
const defaultStyles = new Map<string, Record<string, any>>()

export function getDefaultStyle(tagName: string) {
  if (!IN_BROWSER) return {}
  if (defaultStyles.has(tagName)) return defaultStyles.get(tagName)!
  const sandboxOwnerDocument = getDocument()
  if (!sandbox) {
    sandbox = sandboxOwnerDocument.querySelector(`#${ SANDBOX_ID }`) as HTMLIFrameElement
    if (!sandbox) {
      sandbox = sandboxOwnerDocument.createElement('iframe')
      sandbox.id = SANDBOX_ID
      sandbox.width = '0'
      sandbox.height = '0'
      sandbox.style.visibility = 'hidden'
      sandbox.style.position = 'fixed'
      sandboxOwnerDocument.body.appendChild(sandbox)
      sandbox.contentWindow!.document.write('<!DOCTYPE html><meta charset="UTF-8"><title></title><body>')
    }
  }
  const ownerWindow = sandbox.contentWindow!
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
  defaultStyles.set(tagName, styles)
  return styles
}

export function removeDefaultStyleSandbox() {
  if (!sandbox) return
  getDocument().body.removeChild(sandbox)
  defaultStyles.clear()
  sandbox = undefined
}
