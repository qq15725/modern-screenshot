import { replaceCssUrlToDataUrl } from './css-url'

import type { Options } from './options'

const STYLE_BACKGROUND_PROPS = [
  'background',
  'background-image',
] as const

export async function embedStyleBackground<T extends HTMLElement>(
  cloned: T,
  options?: Options,
): Promise<T> {
  if (cloned instanceof Element) {
    const style = cloned.style
    await Promise.all(
      STYLE_BACKGROUND_PROPS.map(async property => {
        const value = style?.getPropertyValue(property)
        if (!value) return
        style.setProperty(
          'background',
          await replaceCssUrlToDataUrl(value, null, options),
          style.getPropertyPriority(property),
        )
      }),
    )
  }

  return cloned
}
