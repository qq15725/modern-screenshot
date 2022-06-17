import { embedResource } from './embed-resource'

import type { Options } from './options'

export async function embedBackground<T extends HTMLElement>(
  cloned: T,
  options: Options,
): Promise<T> {
  const background = cloned.style?.getPropertyValue('background')
  if (!background) return cloned
  cloned.style.setProperty(
    'background',
    await embedResource(background, null, options),
    cloned.style.getPropertyPriority('background'),
  )
  return cloned
}
