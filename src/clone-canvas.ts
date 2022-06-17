import { createImage } from './utils'

export async function cloneCanvas(
  node: HTMLCanvasElement,
): Promise<HTMLCanvasElement | HTMLImageElement> {
  const dataURL = node.toDataURL()
  return dataURL === 'data:,'
    ? node.cloneNode(false) as HTMLCanvasElement
    : await createImage(dataURL)
}
