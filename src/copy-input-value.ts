import { isInputElement, isSelectElement, isTextareaElement } from './utils'

export function copyInputValue<T extends HTMLElement | SVGElement>(
  node: T,
  cloned: T,
): void {
  if (isTextareaElement(node) || isInputElement(node) || isSelectElement(node)) {
    cloned.setAttribute('value', node.value)
  }
}
