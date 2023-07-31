import { consoleWarn, loadMedia } from './utils'
import type { Context } from './context'

export async function imageToCanvas<T extends HTMLImageElement>(
  image: T,
  context: Context,
): Promise<HTMLCanvasElement> {
  const {
    log,
    timeout,
    drawImageCount,
    drawImageInterval,
  } = context

  log.time('image to canvas')
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

  if (context.isEnable('fixSvgXmlDecode')) {
    for (let i = 0; i < drawImageCount; i++) {
      await new Promise<void>(resolve => {
        setTimeout(() => {
          drawImage()
          resolve()
        }, i + drawImageInterval)
      })
    }
  }

  context.drawImageCount = 0

  log.timeEnd('image to canvas')
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
