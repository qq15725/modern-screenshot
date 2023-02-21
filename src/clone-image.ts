export function cloneImage<T extends HTMLImageElement>(
  image: T,
): HTMLImageElement {
  const clone = image.cloneNode(false) as T

  if (image.currentSrc && image.currentSrc !== image.src) {
    clone.src = image.currentSrc
    clone.srcset = ''
  }

  if (clone.loading === 'lazy') {
    clone.loading = 'eager'
  }

  return clone
}
