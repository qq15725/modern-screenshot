import { loadUrlToDataURL, escape } from './utils'

const URL_RE = /url\(['"]?([^'"]+?)['"]?\)/g

export async function inlineBackground(node: Node) {
  if (node instanceof HTMLElement) {
    const background = node.style.getPropertyValue('background')
    if (background && URL_RE.test(background)) {
      const url = background.match(URL_RE)?.[1]
      if (url && !url.startsWith('data:')) {
        node.style.setProperty(
          'background',
          background.replace(
            new RegExp('(url\\([\'"]?)(' + escape(url) + ')([\'"]?\\))', 'g'),
            `$1${ await loadUrlToDataURL(url) }$3`
          ),
          node.style.getPropertyPriority('background')
        )
      }
    }
  }
  await Promise.all(
    [...node.childNodes].map(child => inlineBackground(child))
  )
}
