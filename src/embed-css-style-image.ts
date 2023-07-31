import { replaceCssUrlToDataUrl } from './css-url'
import { IN_FIREFOX, IN_SAFARI } from './utils'
import type { Context } from './context'

const properties = [
  'background-image',
  'border-image-source',
  '-webkit-border-image',
  '-webkit-mask-image',
  'list-style-image',
]

export function embedCssStyleImage(
  style: CSSStyleDeclaration,
  context: Context,
): Promise<void>[] {
  return properties
    .map(property => {
      const value = style.getPropertyValue(property)
      if (!value) {
        return null
      }
      if (IN_SAFARI || IN_FIREFOX) {
        context.drawImageCount++
      }
      return replaceCssUrlToDataUrl(value, null, context, true).then(newValue => {
        if (!newValue || value === newValue) return
        style.setProperty(
          property,
          newValue,
          style.getPropertyPriority(property),
        )
      })
    })
    .filter(Boolean) as Promise<void>[]
}
