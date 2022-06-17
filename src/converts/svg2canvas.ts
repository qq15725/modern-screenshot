import { createImage, escapeXhtml, getImageSize, getPixelRatio } from '../utils'

import type { Options } from '../options'

export async function svg2canvas<T extends SVGSVGElement>(
  svg: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const { width, height } = getImageSize(svg, options)
  const canvasWidth = options?.canvasWidth ?? width
  const canvasHeight = options?.canvasHeight ?? height
  const ratio = options?.pixelRatio ?? getPixelRatio()
  const dataUrl = `data:image/svg+xml;charset=utf-8,${ escapeXhtml(svg.outerHTML) }`
  const image = await createImage(dataUrl)
  const canvas = document.createElement('canvas')
  canvas.width = canvasWidth * ratio
  canvas.height = canvasHeight * ratio
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
