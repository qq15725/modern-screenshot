import { getMimeType } from './utils'

import type { Options } from './options'

export interface Metadata {
  blob: string
  contentType: string
}

const cache: {
  [url: string]: Promise<Metadata>
} = {}

export function urlGetContent(url: string, options?: Options): Promise<Metadata> {
  const cacheKey = url

  if (cache[cacheKey] != null) return cache[cacheKey]

  // cache bypass so we dont have CORS issues with cached images
  // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
  if (options?.cacheBust) {
    // eslint-disable-next-line no-param-reassign
    url += (/\?/.test(url) ? '&' : '?') + new Date().getTime()
  }

  const deferred = window
    .fetch(url, options?.fetchRequestInit)
    .then(async rep => {
      const blob = await rep.blob()
      return new Promise<Metadata>((resolve, reject) => {
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
    .catch((reason: any): Metadata => {
      let placeholder = ''
      if (options?.imagePlaceholder) {
        const parts = options.imagePlaceholder.split(/,/)
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
  cache[cacheKey] = deferred

  return deferred
}

export async function createDataUrl(url: string, options?: Options) {
  const { blob, contentType } = await urlGetContent(url, options)
  const mimeType = getMimeType(url) ?? contentType
  return `data:${ mimeType };base64,${ blob }`
}
