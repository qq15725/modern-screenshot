import { consoleTime, consoleTimeEnd, consoleWarn } from './utils'

export interface Logger {
  time: (label: string) => void
  timeEnd: (label: string) => void
  warn: (...args: any[]) => void
}

export function createLogger(debug: boolean): Logger {
  return {
    time: (label: string) => debug && consoleTime(label),
    timeEnd: (label: string) => debug && consoleTimeEnd(label),
    warn: (...args: any[]) => debug && consoleWarn(...args),
  }
}
