import { consoleWarn, PREFIX } from './utils'

export interface Logger {
  time: (label: string) => void
  timeEnd: (label: string) => void
  warn: (...args: any[]) => void
}

export function createLogger(debug: boolean): Logger {
  return {
    // eslint-disable-next-line no-console
    time: (label: string) => debug && console.time(`${PREFIX} ${label}`),
    // eslint-disable-next-line no-console
    timeEnd: (label: string) => debug && console.timeEnd(`${PREFIX} ${label}`),
    warn: (...args: any[]) => debug && consoleWarn(...args),
  }
}
