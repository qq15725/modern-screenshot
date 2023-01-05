const prefix = '[modern-screenshot]'

export function consoleWarn(...args: any[]) {
  return console.warn(prefix, ...args)
}

export function consoleTime(label: string) {
  // eslint-disable-next-line no-console
  console.time(`${ prefix } ${ label }`)
}

export function consoleTimeEnd(label: string) {
  // eslint-disable-next-line no-console
  console.timeEnd(`${ prefix } ${ label }`)
}
