import { createImage } from './utils'

export function createVideoClone<T extends HTMLVideoElement>(
  video: T,
): HTMLCanvasElement | HTMLImageElement | HTMLVideoElement {
  if (video.ownerDocument) {
    const ownerDocument = video.ownerDocument

    if (!video.paused) {
      const canvas = ownerDocument.createElement('canvas')
      canvas.width = video.offsetWidth
      canvas.height = video.offsetHeight
      try {
        const ctx = canvas.getContext('2d')
        if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
      } catch (e) {
        //
      }
      return canvas
    } else if (video.poster) {
      return createImage(video.poster, ownerDocument, true)
    }
  }

  return video.cloneNode(false) as T
}
