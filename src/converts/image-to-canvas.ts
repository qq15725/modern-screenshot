import { createContext } from '../create-context'
import { IN_SAFARI, consoleTime, consoleTimeEnd, consoleWarn, isContext, loadMedia } from '../utils'
import type { Context } from '../context'
import type { Options } from '../options'

export async function imageToCanvas<T extends HTMLImageElement>(
  image: T,
  options?: Options | Context,
): Promise<HTMLCanvasElement> {
  const context = isContext(options)
    ? options
    : await createContext(image, { ...options, autodestruct: true })

  const {
    requestImagesCount,
    timeout,
    drawImageInterval,
    debug,
  } = context

  debug && consoleTime('image to canvas')
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
  if (IN_SAFARI) {
    for (let i = 0; i < requestImagesCount; i++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          drawImage()
          resolve()
        }, i + drawImageInterval)
      })
    }
  }
  debug && consoleTimeEnd('image to canvas')
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
