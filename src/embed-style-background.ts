import { replaceCssUrlToDataUrl } from './css-url'

import type { HandleNodeFunc } from './types'

const STYLE_BACKGROUND_PROPS = [
  'background',
  'background-image',
] as const

export const embedStyleBackground: HandleNodeFunc = async (cloned, options) => {
  if ('style' in cloned) {
    const style = (cloned as any).style as CSSStyleDeclaration
    await Promise.all(
      STYLE_BACKGROUND_PROPS.map(async property => {
        const value = style?.getPropertyValue(property)
        if (!value) return
        const newValue = await replaceCssUrlToDataUrl(value, null, options, true)
        if (!newValue || value === newValue) return
        style.setProperty(
          'background',
          newValue,
          style.getPropertyPriority(property),
        )
      }),
    )
  }
}
