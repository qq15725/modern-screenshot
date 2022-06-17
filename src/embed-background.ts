import { embedResource } from './embed-resource'

import type { Options } from './options'

const BACKGROUND_PROPS = [
  'background',
  'background-image',
] as const

export async function embedBackground<T extends HTMLElement>(
  cloned: T,
  options?: Options,
): Promise<T> {
  const style = cloned.style

  await Promise.all(
    BACKGROUND_PROPS.map(async property => {
      const value = style?.getPropertyValue(property)
      if (!value) return
      style.setProperty(
        'background',
        await embedResource(value, null, options),
        style.getPropertyPriority(property),
      )
    }),
  )

  return cloned
}
