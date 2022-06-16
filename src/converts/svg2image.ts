import { escapeXhtml, loadImage } from '../utils'

interface Options {
  width: number
  height: number
  output?: 'png' | 'jpeg'
}

export async function svg2image(xhtml: string, options: Options) {
  const dataURL = `data:image/svg+xml;charset=utf-8,${ escapeXhtml(xhtml) }`
  const image = await loadImage(dataURL)
  const canvas = document.createElement('canvas')
  canvas.width = options.width
  canvas.height = options.height
  const ctx = canvas.getContext('2d')
  ctx?.drawImage(image, 0, 0)
  if (options.output === 'jpeg') {
    return canvas.toDataURL('image/jpeg', 1.0)
  }
  return canvas.toDataURL()
}
