import { IN_BROWSER } from './utils'

const SANDBOX_ID = 'egami__sandbox'
let sandbox: HTMLIFrameElement | undefined
const defaultStyles = new Map<string, Record<string, any>>()

export function getDefaultStyle(tagName: string) {
  if (!IN_BROWSER) return {}
  if (defaultStyles.has(tagName)) return defaultStyles.get(tagName)!
  if (!sandbox) {
    sandbox = document.querySelector(`#${ SANDBOX_ID }`) as HTMLIFrameElement
    if (!sandbox) {
      sandbox = document.createElement('iframe')
      sandbox.id = SANDBOX_ID
      sandbox.style.visibility = 'hidden'
      sandbox.style.position = 'fixed'
      document.body.appendChild(sandbox)
      sandbox.contentWindow!.document.write('<!DOCTYPE html><meta charset="UTF-8"><title></title><body>')
    }
  }
  const win = sandbox.contentWindow!
  const el = document.createElement(tagName)
  win.document.body.appendChild(el)
  // Ensure that there is some content, so properties like margin are applied
  el.textContent = ' '
  const style = win.getComputedStyle(el)
  const styles: Record<string, any> = {}
  Array.from(style).forEach(name => {
    if (name === 'width' || name === 'height') {
      styles[name] = 'auto'
    } else {
      styles[name] = style.getPropertyValue(name)
    }
  })
  win.document.body.removeChild(el)
  defaultStyles.set(tagName, styles)
  return styles
}

export function removeDefaultStyleSandbox() {
  if (!sandbox) return
  document.body.removeChild(sandbox)
  defaultStyles.clear()
  sandbox = undefined
}
