import { loadUrlToDataURL } from './utils'

export async function inlineImage(node: Node): Promise<void> {
  if (node instanceof HTMLImageElement) {
    const url = node.src
    if (url && !url.startsWith('data:')) {
      await reloadImage(node, await loadUrlToDataURL(url))
    }
  }
  await Promise.all(
    [...node.childNodes].map(child => inlineImage(child))
  )
}

async function reloadImage(image: HTMLImageElement, src: string) {
  return new Promise((resolve, reject) => {
    image.onload = resolve
    image.onerror = reject
    image.src = src
  })
}
