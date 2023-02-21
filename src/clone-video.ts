import { cloneCanvas } from './clone-canvas'
import { consoleWarn, createImage } from './utils'

export function cloneVideo<T extends HTMLVideoElement>(
  video: T,
): HTMLCanvasElement | HTMLImageElement | HTMLVideoElement {
  if (video.ownerDocument) {
    const ownerDocument = video.ownerDocument

    if (video.currentSrc && video.currentTime) {
      const canvas = ownerDocument.createElement('canvas')
      canvas.width = video.offsetWidth
      canvas.height = video.offsetHeight
      try {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      } catch (error) {
        consoleWarn('Failed to clone video', error)
      }
      return cloneCanvas(canvas)
    }

    if (video.poster) {
      return createImage(video.poster, ownerDocument, true)
    }
  }

  return video.cloneNode(false) as T
}
