export function createCanvasClone<T extends HTMLCanvasElement>(
  canvas: T,
): HTMLCanvasElement | HTMLImageElement {
  if (canvas.ownerDocument) {
    const img = canvas.ownerDocument.createElement('img')
    try {
      img.src = canvas.toDataURL()
      return img
    } catch (e) {
      console.error('Unable to inline canvas contents, canvas is tainted', canvas)
    }
  }

  const clone = canvas.cloneNode(false) as T

  try {
    clone.width = canvas.width
    clone.height = canvas.height
    const ctx = canvas.getContext('2d')
    const clonedCtx = clone.getContext('2d')
    if (clonedCtx) {
      clonedCtx.putImageData(
        ctx!.getImageData(0, 0, canvas.width, canvas.height),
        0, 0,
      )
    }
    return clone
  } catch (e) {
    console.error('Unable to clone canvas as it is tainted', canvas)
  }

  return clone
}
