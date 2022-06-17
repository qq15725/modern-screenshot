import { dom2canvas } from './converts/dom2canvas'
import { canvasToBlob, createImage } from './utils'

import type { Options } from './options'

export async function dom2image<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<HTMLImageElement> {
  return createImage(await dom2png(node, options))
}

export async function dom2png<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<string> {
  return (await dom2canvas(node, options)).toDataURL()
}

export async function dom2jpeg<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<string> {
  return (await dom2canvas(node, options))
    .toDataURL('image/jpeg', options.quality ?? 1.0)
}

export async function dom2blob<T extends HTMLElement>(
  node: T,
  options: Options = {},
): Promise<Blob | null> {
  return dom2canvas(node, options).then(canvasToBlob)
}

export { dom2canvas }

export { dom2svg } from './converts/dom2svg'

export { svg2canvas } from './converts/svg2canvas'
