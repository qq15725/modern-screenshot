export function createVideoClone<T extends HTMLVideoElement>(
  video: T,
): HTMLCanvasElement | HTMLVideoElement {
  if (video.ownerDocument) {
    const canvas = video.ownerDocument.createElement('canvas')
    canvas.width = video.offsetWidth
    canvas.height = video.offsetHeight
    try {
      const ctx = canvas.getContext('2d')
      if (ctx) ctx.drawImage(video, 0, 0, canvas.width, canvas.height)
    } catch (e) {
      //
    }
    return canvas
  }

  return video.cloneNode(false) as T
}
