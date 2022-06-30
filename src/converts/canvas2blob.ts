import { resolveOptions } from '../options'
import { IN_BROWSER } from '../utils'

import type { Options } from '../options'

export async function canvas2blob(
  canvas: HTMLCanvasElement,
  options?: Options,
): Promise<Blob | null> {
  const { type, quality } = await resolveOptions(canvas, options)

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
