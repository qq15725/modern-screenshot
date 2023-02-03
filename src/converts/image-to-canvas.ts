import { createContext } from '../create-context'
import { IS_SAFARI, consoleWarn, loadMedia } from '../utils'
import type { Context } from '../context'
import type { Options } from '../options'

export async function imageToCanvas<T extends HTMLImageElement>(
  image: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const context = await createContext(image, options)
  const {
    requests,
    timeout,
    drawImageInterval,
  } = context

  const loaded = await loadMedia(image, { timeout })
  const { canvas, context2d } = createCanvas(image.ownerDocument, context)
  const drawImage = () => {
    try {
      context2d?.drawImage(loaded, 0, 0, canvas.width, canvas.height)
    } catch (error) {
      consoleWarn('Failed to drawImage', error)
    }
  }
  drawImage()
  // fix: image not decode when drawImage svg+xml in safari/webkit
  if (IS_SAFARI) {
    const allRequestImagesCount = Array.from(requests.values())
      .filter(v => v.type === 'image')
      .length
    for (let i = 0; i < allRequestImagesCount; i++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          drawImage()
          resolve()
        }, i + drawImageInterval)
      })
    }
  }
  return canvas
}

function createCanvas(ownerDocument: Document, context: Context) {
  const { width, height, scale, backgroundColor, maximumCanvasSize: max } = context

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

  const context2d = canvas.getContext('2d')

  if (context2d && backgroundColor) {
    context2d.fillStyle = backgroundColor
    context2d.fillRect(0, 0, canvas.width, canvas.height)
  }

  return { canvas, context2d }
}
