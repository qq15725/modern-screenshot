import { isInputElement, isSelectElement, isTextareaElement } from './utils'

export function copyInputValue<T extends HTMLElement | SVGElement>(
  node: T,
  cloned: T,
) {
  if (isTextareaElement(node)) {
    cloned.innerHTML = node.value
  }

  if (isTextareaElement(node) || isInputElement(node) || isSelectElement(node)) {
    cloned.setAttribute('value', node.value)
  }
}
