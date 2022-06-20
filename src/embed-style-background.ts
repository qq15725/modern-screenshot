import { replaceCssUrlToDataUrl } from './css-url'

import type { HandleNodeFunc } from './types'

const STYLE_BACKGROUND_PROPS = [
  'background',
  'background-image',
] as const

export const embedStyleBackground: HandleNodeFunc = async (cloned, options) => {
  if (cloned instanceof HTMLElement) {
    const style = cloned.style
    await Promise.all(
      STYLE_BACKGROUND_PROPS.map(async property => {
        const value = style?.getPropertyValue(property)
        if (!value) return
        style.setProperty(
          'background',
          await replaceCssUrlToDataUrl(value, null, options, true),
          style.getPropertyPriority(property),
        )
      }),
    )
  }
}
