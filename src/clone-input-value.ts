export function cloneInputValue<T extends HTMLElement>(node: T, cloned: T): T {
  if (node instanceof HTMLTextAreaElement) {
    cloned.innerHTML = node.value
  }

  if (node instanceof HTMLInputElement) {
    cloned.setAttribute('value', node.value)
  }

  return cloned
}
