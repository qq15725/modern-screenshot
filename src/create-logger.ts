import { consoleWarn, PREFIX } from './utils'

export interface Logger {
  time: (label: string) => void
  timeEnd: (label: string) => void
  warn: (...args: any[]) => void
}

let uid = 0
export function createLogger(debug: boolean): Logger {
  const prefix = `${PREFIX}[#${uid}]`
  uid++
  return {
    // eslint-disable-next-line no-console
    time: (label: string) => debug && console.time(`${prefix} ${label}`),
    // eslint-disable-next-line no-console
    timeEnd: (label: string) => debug && console.timeEnd(`${prefix} ${label}`),
    warn: (...args: any[]) => debug && consoleWarn(...args),
  }
}
