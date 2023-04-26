import { cloneCanvas } from './clone-canvas'
import { consoleWarn, createImage, loadMedia } from './utils'

export async function cloneVideo<T extends HTMLVideoElement>(
  video: T,
): Promise<HTMLCanvasElement | HTMLImageElement | HTMLVideoElement> {
  if (
    video.ownerDocument
    && !video.currentSrc
    && video.poster
  ) {
    return createImage(video.poster, video.ownerDocument)
  }

  const cloned = video.cloneNode(false) as T
  cloned.crossOrigin = 'anonymous'
  if (video.currentSrc && video.currentSrc !== video.src) {
    cloned.src = video.currentSrc
  }

  // video to canvas
  const ownerDocument = cloned.ownerDocument
  if (ownerDocument) {
    let canPlay = true
    await loadMedia(cloned, {
      onError: () => canPlay = false,
    })
    if (!canPlay) {
      if (video.poster) {
        return createImage(video.poster, video.ownerDocument)
      }
      return cloned
    }
    cloned.currentTime = video.currentTime
    await new Promise(resolve => {
      cloned.addEventListener('seeked', resolve, { once: true })
    })
    const canvas = ownerDocument.createElement('canvas')
    canvas.width = video.offsetWidth
    canvas.height = video.offsetHeight
    try {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.drawImage(cloned, 0, 0, canvas.width, canvas.height)
    } catch (error) {
      consoleWarn('Failed to clone video', error)
      if (video.poster) {
        return createImage(video.poster, video.ownerDocument)
      }
      return cloned
    }
    return cloneCanvas(canvas)
  }

  return cloned
}
