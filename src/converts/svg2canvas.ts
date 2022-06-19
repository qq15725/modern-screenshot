import { getImageSize, getPixelRatio, loadImage } from '../utils'
import { getWindow } from '../window'

import type { Options } from '../options'

export async function svg2canvas<T extends SVGElement>(
  svg: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const { width, height } = getImageSize(svg, options)
  const canvasWidth = options?.canvas?.width ?? width
  const canvasHeight = options?.canvas?.height ?? height
  const ratio = options?.canvas?.pixelRatio ?? getPixelRatio()
  const xhtml = new XMLSerializer().serializeToString(svg)
  const dataUrl = `data:image/svg+xml;charset=utf-8,${ encodeURIComponent(xhtml) }`
  const image = await loadImage(dataUrl)
  const canvas = getWindow(options).document.createElement('canvas')
  canvas.width = canvasWidth * ratio
  canvas.height = canvasHeight * ratio
  if (!options?.canvas?.skipAutoScale) {
    checkDimension(canvas)
  }
  canvas.style.width = `${ canvasWidth }px`
  canvas.style.height = `${ canvasHeight }px`
  const context = canvas.getContext('2d')!
  if (options?.backgroundColor) {
    context.fillStyle = options.backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

// as per https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
const LIMIT = 16384

function checkDimension(canvas: HTMLCanvasElement) {
  if (
    canvas.width > LIMIT
    || canvas.height > LIMIT
  ) {
    if (
      canvas.width > LIMIT
      && canvas.height > LIMIT
    ) {
      if (canvas.width > canvas.height) {
        canvas.height *= LIMIT / canvas.width
        canvas.width = LIMIT
      } else {
        canvas.width *= LIMIT / canvas.height
        canvas.height = LIMIT
      }
    } else if (canvas.width > LIMIT) {
      canvas.height *= LIMIT / canvas.width
      canvas.width = LIMIT
    } else {
      canvas.width *= LIMIT / canvas.height
      canvas.height = LIMIT
    }
  }
}
