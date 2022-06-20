import { loadImage } from '../utils'
import { getSize } from '../get-size'
import { getScale } from '../get-scale'
import { getWindow } from '../get-window'

import type { Options } from '../options'

export async function svg2canvas<T extends SVGElement>(
  svg: T,
  options?: Options,
): Promise<HTMLCanvasElement> {
  const { width, height } = getSize(svg, options)
  const scale = getScale(options)
  const xhtml = new XMLSerializer().serializeToString(svg)
  const dataUrl = `data:image/svg+xml;charset=utf-8,${ encodeURIComponent(xhtml) }`
  const image = await loadImage(dataUrl)
  const canvas = getWindow(options).document.createElement('canvas')
  canvas.width = width * scale
  canvas.height = height * scale
  // https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
  const maximum = options?.maximumCanvasSize ?? 16384
  if (maximum) checkMaximumCanvasSize(canvas, maximum)
  canvas.style.width = `${ width }px`
  canvas.style.height = `${ height }px`
  const context = canvas.getContext('2d')!
  if (options?.backgroundColor) {
    context.fillStyle = options.backgroundColor
    context.fillRect(0, 0, canvas.width, canvas.height)
  }
  context.drawImage(image, 0, 0, canvas.width, canvas.height)
  return canvas
}

function checkMaximumCanvasSize(canvas: HTMLCanvasElement, max: number) {
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
