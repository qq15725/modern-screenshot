import { getMimeType } from './utils'
import { getWindow } from './get-window'

import type { Options } from './options'

export interface Base64Response {
  base64: string
  contentType: string
}

export function fetch(url: string, options?: Options) {
  // cache bypass so we dont have CORS issues with cached images
  // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
  if (options?.fetch?.bypassingCache) {
    url += (/\?/.test(url) ? '&' : '?') + new Date().getTime()
  }

  return getWindow(options).fetch(url, options?.fetch?.requestInit)
}

const base64Cache = new Map<string, Base64Response>()

export async function fetchBase64(url: string, options?: Options, isImage?: boolean): Promise<Base64Response> {
  const cacheKey = url

  if (base64Cache.has(cacheKey)) return base64Cache.get(cacheKey)!

  let rep: Base64Response
  try {
    const raw = await fetch(url, options)
    const blob = await raw.blob()
    rep = await new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve({
        contentType: raw.headers.get('Content-Type') || '',
        base64: (reader.result as string).split(/,/)[1],
      })
      reader.onerror = reject
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error(err)

    let placeholder = ''

    if (isImage && options?.fetch?.placeholderImage) {
      const parts = options.fetch.placeholderImage.split(/,/)
      if (parts && parts[1]) placeholder = parts[1]
    }

    rep = {
      base64: placeholder,
      contentType: '',
    }
  }

  base64Cache.set(cacheKey, rep)

  return rep
}

export async function fetchDataUrl(url: string, options?: Options, isImage?: boolean) {
  const { base64, contentType } = await fetchBase64(url, options, isImage)
  const mimeType = getMimeType(url) ?? contentType
  return `data:${ mimeType };base64,${ base64 }`
}

const textCache = new Map<string, string>()

export async function fetchText(url: string, options?: Options): Promise<string> {
  const cacheKey = url
  if (textCache.has(cacheKey)) return textCache.get(cacheKey)!
  const rep = await fetch(url, options)
  const text = await rep.text()
  textCache.set(cacheKey, text)
  return text
}
