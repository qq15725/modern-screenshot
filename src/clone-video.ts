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

  video.currentTime = 3

  const clone = video.cloneNode(false) as T
  clone.crossOrigin = 'anonymous'
  if (video.currentSrc && video.currentSrc !== video.src) {
    clone.src = video.currentSrc
  }

  // video to canvas
  const ownerDocument = clone.ownerDocument
  if (ownerDocument) {
    let canPlay = true
    await loadMedia(clone, {
      onError: () => canPlay = false,
    })
    if (!canPlay) {
      return clone
    }
    clone.currentTime = video.currentTime
    await new Promise(resolve => {
      clone.addEventListener('seeked', resolve, { once: true })
    })
    const canvas = ownerDocument.createElement('canvas')
    canvas.width = video.offsetWidth
    canvas.height = video.offsetHeight
    try {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.drawImage(clone, 0, 0, canvas.width, canvas.height)
    } catch (error) {
      consoleWarn('Failed to clone video', error)
      return clone
    }
    return cloneCanvas(canvas)
  }

  return clone
}
