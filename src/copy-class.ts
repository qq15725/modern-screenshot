export function copyClass<T extends HTMLElement | SVGElement>(
  node: T,
  clone: T,
) {
  const classes = clone.classList

  // clean class list
  while (classes.length > 0) {
    const name = classes.item(0)
    name && classes.remove(name)
  }

  // fix background-clip: text
  if (clone.style.backgroundClip === 'text') {
    classes.add('______background-clip--text')
  }
}
