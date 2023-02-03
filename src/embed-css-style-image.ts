import { replaceCssUrlToDataUrl } from './css-url'
import type { Context } from './context'

const PROPERTIES = [
  'background-image',
  'border-image-source',
  '-webkit-border-image',
  '-webkit-mask-image',
  'list-style-image',
] as const

export async function embedCssStyleImage(
  style: CSSStyleDeclaration,
  context: Context,
) {
  await Promise.all(
    PROPERTIES.map(async property => {
      const value = style.getPropertyValue(property)
      if (!value) return
      const newValue = await replaceCssUrlToDataUrl(value, null, context, true)
      if (!newValue || value === newValue) return
      style.setProperty(
        property,
        newValue,
        style.getPropertyPriority(property),
      )
    }),
  )
}
