import { consoleWarn } from './log'
import { getMimeType } from './utils'

import type { ResolvedOptions } from './options'

export interface Base64Response {
  base64: string
  contentType: string
}

const cache = new Map<string, Promise<Base64Response | string>>()

export function fetch(url: string, options: ResolvedOptions) {
  const { bypassingCache, requestInit } = options.fetch ?? {}

  // cache bypass so we dont have CORS issues with cached images
  // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
  if (bypassingCache) {
    url += (/\?/.test(url) ? '&' : '?') + new Date().getTime()
  }

  const controller = new AbortController()
  const timer = options.timeout
    ? setTimeout(() => controller.abort(), options.timeout)
    : undefined
  return window.fetch(url, { ...requestInit, signal: controller.signal })
    .finally(() => clearTimeout(timer))
}

export function fetchBase64(url: string, options: ResolvedOptions, isImage?: boolean): Promise<Base64Response> {
  const cacheKey = url

  if (!cache.has(cacheKey)) {
    cache.set(
      cacheKey,
      (async () => {
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
        } catch (error) {
          consoleWarn('Failed to fetch base64 - ', error)

          let placeholder = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

          if (isImage && options.fetch?.placeholderImage) {
            const parts = options.fetch.placeholderImage.split(/,/)
            if (parts && parts[1]) placeholder = parts[1]
          }

          rep = {
            base64: placeholder,
            contentType: '',
          }
        }
        return rep
      })(),
    )
  }

  return cache.get(cacheKey)! as Promise<Base64Response>
}

export async function fetchDataUrl(url: string, options: ResolvedOptions, isImage?: boolean) {
  const { base64, contentType } = await fetchBase64(url, options, isImage)
  const mimeType = getMimeType(url) ?? contentType
  return `data:${ mimeType };base64,${ base64 }`
}

export async function fetchText(url: string, options: ResolvedOptions): Promise<string> {
  const cacheKey = url

  if (!cache.has(cacheKey)) {
    cache.set(cacheKey, (async () => {
      const rep = await fetch(url, options)
      return await rep.text()
    })())
  }

  return cache.get(cacheKey)! as Promise<string>
}
