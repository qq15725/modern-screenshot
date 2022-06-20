import { IN_BROWSER, IS_NODE } from './utils'

import type { Options } from './options'

export function getScale(options?: Options): number {
  return options?.scale ?? getDevicePixelRatio()
}

function getDevicePixelRatio() {
  const dpr = Number(
    (IS_NODE && process.env.devicePixelRatio)
    || (IN_BROWSER && window.devicePixelRatio),
  )

  return Number.isNaN(dpr) ? 1 : dpr
}
