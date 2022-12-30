import { IN_BROWSER } from '../utils'
import type { BlobOptions } from '../options'

export async function canvasToblob(
  canvas: HTMLCanvasElement,
  options?: BlobOptions,
): Promise<Blob | null> {
  const { type = 'image/png', quality = 1 } = options || {}

  if (canvas.toBlob) {
    return new Promise(resolve => canvas.toBlob(resolve, type, quality))
  }

  if (!IN_BROWSER) return null
  const dataURL = canvas.toDataURL(type, quality).split(',')[1]
  const binaryString = window.atob(dataURL)
  const len = binaryString.length
  const binaryArray = new Uint8Array(len)

  for (let i = 0; i < len; i += 1) {
    binaryArray[i] = binaryString.charCodeAt(i)
  }

  return new Blob([binaryArray], { type })
}
