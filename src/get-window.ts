import { IN_BROWSER } from './utils'

import type { Options } from './options'

export function getWindow(options?: Options): Window {
  const win = options?.window ?? (IN_BROWSER && window)
  if (!win) {
    throw new Error('Require options window')
  }
  return win
}
