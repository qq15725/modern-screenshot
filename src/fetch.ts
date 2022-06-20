import { getMimeType } from './utils'
import { getWindow } from './get-window'

import type { Options } from './options'

export interface FetchResult {
  blob: string
  contentType: string
}

const cache = new Map<string, Promise<FetchResult>>()

export function fetch(url: string, options?: Options): Promise<FetchResult> {
  const cacheKey = url

  if (cache.has(cacheKey)) return cache.get(cacheKey)!

  // cache bypass so we dont have CORS issues with cached images
  // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
  if (options?.fetch?.bypassingCache) {
    url += (/\?/.test(url) ? '&' : '?') + new Date().getTime()
  }

  const deferred = getWindow(options)
    .fetch(url, options?.fetch?.requestInit)
    .then(async rep => {
      const blob = await rep.blob()
      return new Promise<FetchResult>((resolve, reject) => {
        const reader = new FileReader()
        reader.onloadend = () => resolve({
          contentType: rep.headers.get('Content-Type') || '',
          blob: (reader.result as string).split(/,/)[1],
        })
        reader.onerror = reject
        reader.readAsDataURL(blob)
      })
    })
    // on failed
    .catch((reason: any): FetchResult => {
      let placeholder = ''
      if (options?.fetch?.placeholderImage) {
        const parts = options.fetch.placeholderImage.split(/,/)
        if (parts && parts[1]) {
          placeholder = parts[1]
        }
      }

      let msg = `Failed to fetch resource: ${ url }`
      if (reason) {
        msg = typeof reason === 'string' ? reason : reason.message
      }

      if (msg) {
        console.error(msg)
      }

      return {
        blob: placeholder,
        contentType: '',
      }
    })

  // cache result
  cache.set(cacheKey, deferred)

  return deferred
}

export async function fetchToDataUrl(url: string, options?: Options) {
  const { blob, contentType } = await fetch(url, options)
  const mimeType = getMimeType(url) ?? contentType
  return `data:${ mimeType };base64,${ blob }`
}
