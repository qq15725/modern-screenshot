import {
  isInputElement,
  isOptionElement,
  isSelectElement,
  isTextareaElement,
} from './utils'

export function copyInputValue<T extends HTMLElement | SVGElement>(
  node: T,
  cloned: T,
): void {
  if (isOptionElement(node) && isOptionElement(cloned)) {
    cloned.selected = node.selected

    if (node.selected)
      cloned.setAttribute('selected', '')
    else cloned.removeAttribute('selected')

    return
  }

  if (isTextareaElement(node) || isInputElement(node) || isSelectElement(node)) {
    cloned.setAttribute('value', node.value)
  }
}
