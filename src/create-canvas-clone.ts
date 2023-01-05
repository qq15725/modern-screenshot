import { createImage } from './utils'

export function createCanvasClone<T extends HTMLCanvasElement>(
  canvas: T,
): HTMLCanvasElement | HTMLImageElement {
  if (canvas.ownerDocument) {
    const dataURL = canvas.toDataURL()
    if (dataURL !== 'data:,') {
      try {
        return createImage(dataURL, canvas.ownerDocument)
      } catch (error) {
        console.warn('Failed to clone canvas', error)
      }
    }
  }

  const clone = canvas.cloneNode(false) as T

  try {
    clone.width = canvas.width
    clone.height = canvas.height
    const ctx = canvas.getContext('2d')
    const clonedCtx = clone.getContext('2d')
    if (clonedCtx) {
      clonedCtx.putImageData(
        ctx!.getImageData(0, 0, canvas.width, canvas.height),
        0, 0,
      )
    }
    return clone
  } catch (error) {
    console.warn('Failed to clone canvas', error)
  }

  return clone
}
