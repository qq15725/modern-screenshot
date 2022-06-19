import { dom2canvas } from './dom2canvas'

import type { Options } from '../options'

export async function dom2png<T extends Node>(
  node: T,
  options?: Options,
): Promise<string> {
  return (
    await dom2canvas(node, options)
  ).toDataURL()
}
