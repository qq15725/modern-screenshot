export function cloneImage<T extends HTMLImageElement>(
  image: T,
): HTMLImageElement {
  const cloned = image.cloneNode(false) as T

  if (image.currentSrc && image.currentSrc !== image.src) {
    cloned.src = image.currentSrc
    cloned.srcset = ''
  }

  if (cloned.loading === 'lazy') {
    cloned.loading = 'eager'
  }

  return cloned
}
