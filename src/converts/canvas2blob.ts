import type { Options } from '../options'

export function canvas2blob(
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
