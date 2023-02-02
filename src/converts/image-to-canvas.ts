import { consoleWarn } from '../log'
import { resolveOptions } from '../resolve-options'
import { isOnlyAppleWebKit, loadMedia } from '../utils'

import type { Options, ResolvedOptions } from '../options'

export async function imageToCanvas<T extends HTMLImageElement>(
  image: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const resolved = await resolveOptions(image, options)
  const loaded = await loadMedia(image, { timeout: resolved.timeout })
  const { canvas, context } = createCanvas(image.ownerDocument, resolved)
  const drawImage = () => {
    try {
      context?.drawImage(loaded, 0, 0, canvas.width, canvas.height)
    } catch (error) {
      consoleWarn('Failed to image to canvas - ', error)
    }
  }
  drawImage()
  // fix: image not decode when drawImage svg+xml in safari/webkit
  if (isOnlyAppleWebKit) {
    for (let i = 0; i < resolved.context.images.size; i++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          drawImage()
          resolve()
        }, i + resolved.drawImageInterval)
      })
    }
  }
  return canvas
}

function createCanvas(ownerDocument: Document, options: ResolvedOptions) {
  const { width, height, scale, backgroundColor, maximumCanvasSize: max } = options

  const canvas = ownerDocument.createElement('canvas')

  canvas.width = Math.floor(width * scale)
  canvas.height = Math.floor(height * scale)
  canvas.style.width = `${ width }px`
  canvas.style.height = `${ height }px`

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

  const context = canvas.getContext('2d')

  if (context && backgroundColor) {
    context.fillStyle = backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
  }

  return { canvas, context }
}
