import type { DepthCloneNodeFunc } from './types'

export const cloneNodeInput: DepthCloneNodeFunc = async (node, cloned) => {
  if (node instanceof HTMLTextAreaElement
    && cloned instanceof HTMLTextAreaElement) {
    cloned.innerHTML = node.value
  }

  if (node instanceof HTMLInputElement
    && cloned instanceof HTMLInputElement) {
    cloned.setAttribute('value', node.value)
  }
}
