import { resolveOptions } from '../options'
import { loadImage } from '../utils'

import type { Options, ResolvedOptions } from '../options'

function createCanvas(document: Document, options: ResolvedOptions) {
  const { maximumCanvasSize: max, width, height, scale, backgroundColor } = options
  const canvas = document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  if (max) {
    if (canvas.width > max || canvas.height > max) {
      if (canvas.width > max && canvas.height > max) {
        if (canvas.width > canvas.height) {
          canvas.height *= max / canvas.width
          canvas.width = max
        } else {
          canvas.width *= max / canvas.height
          canvas.height = max
        }
      } else if (canvas.width > max) {
        canvas.height *= max / canvas.width
        canvas.width = max
      } else {
        canvas.width *= max / canvas.height
        canvas.height = max
      }
    }
  }
  canvas.style.width = `${ width }px`
  canvas.style.height = `${ height }px`
  const context = canvas.getContext('2d')
  if (context && backgroundColor) {
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  return { canvas, context }
}

export async function image2canvas<T extends HTMLImageElement>(
  image: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(image, options)

  const loaded = await loadImage(image)

  const { canvas, context } = createCanvas(image.ownerDocument, resolved)

  context?.drawImage(loaded, 0, 0, canvas.width, canvas.height)

  return canvas
}
