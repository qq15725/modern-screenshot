import { dom2canvas } from './dom2canvas'

import type { Options } from '../options'

export async function dom2blob<T extends HTMLElement>(
  node: T,
  options?: Options,
): Promise<Blob | null> {
  return canvasToBlob(await dom2canvas(node, options))
}

function canvasToBlob(
  canvas: HTMLCanvasElement,
  options?: Options,
): Promise<Blob | null> {
  const type = options?.type ?? 'image/png'
  const quality = options?.quality ?? 1

  if (canvas.toBlob) {
    return new Promise((resolve) => canvas.toBlob(resolve, type, quality))
  }

  return new Promise((resolve) => {
    const binaryString = window.atob(
      canvas
        .toDataURL(type, quality)
        .split(',')[1],
    )
    const len = binaryString.length
    const binaryArray = new Uint8Array(len)
    for (let i = 0; i < len; i += 1) {
      binaryArray[i] = binaryString.charCodeAt(i)
    }
    resolve(new Blob([binaryArray], { type }))
  })
}
