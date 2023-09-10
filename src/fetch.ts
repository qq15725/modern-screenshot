import { IN_FIREFOX, IN_SAFARI, blobToDataUrl, consoleWarn } from './utils'
import type { Context } from './context'

export type BaseFetchOptions = RequestInit & {
  url: string
  timeout?: number
  responseType?: 'text' | 'dataUrl'
}

export type ContextFetchOptions = BaseFetchOptions & {
  requestType?: 'text' | 'image'
  imageDom?: HTMLImageElement | SVGImageElement
}

export function baseFetch(options: BaseFetchOptions): Promise<string> {
  const { url, timeout, responseType, ...requestInit } = options

  const controller = new AbortController()

  const timer = timeout
    ? setTimeout(() => controller.abort(), timeout)
    : undefined

  return fetch(url, { signal: controller.signal, ...requestInit })
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed fetch, not 2xx response', { cause: response })
      }
      switch (responseType) {
        case 'dataUrl':
          return response.blob().then(blobToDataUrl)
        case 'text':
        default:
          return response.text()
      }
    })
    .finally(() => clearTimeout(timer))
}

export function contextFetch(context: Context, options: ContextFetchOptions) {
  const { url: rawUrl, requestType = 'text', responseType = 'text', imageDom } = options
  let url = rawUrl

  const {
    timeout,
    acceptOfImage,
    requests,
    fetch: {
      requestInit,
      bypassingCache,
      placeholderImage,
    },
    workers,
  } = context

  if (requestType === 'image' && (IN_SAFARI || IN_FIREFOX)) {
    context.drawImageCount++
  }

  let request = requests.get(rawUrl)
  if (!request) {
    // cache bypass so we dont have CORS issues with cached images
    // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
    if (bypassingCache) {
      if (bypassingCache instanceof RegExp && bypassingCache.test(url)) {
        url += (/\?/.test(url) ? '&' : '?') + new Date().getTime()
      }
    }

    const baseFetchOptions: BaseFetchOptions = {
      url,
      timeout,
      responseType,
      headers: requestType === 'image' ? { accept: acceptOfImage } : undefined,
      ...requestInit,
    }

    request = {
      type: requestType,
      resolve: undefined,
      reject: undefined,
      response: null as any,
    }

    request.response = (
      !IN_SAFARI && rawUrl.startsWith('http') && workers.length
        ? new Promise((resolve, reject) => {
          const worker = workers[requests.size & (workers.length - 1)]
          worker.postMessage({ rawUrl, ...baseFetchOptions })
          request!.resolve = resolve
          request!.reject = reject
        })
        : baseFetch(baseFetchOptions)
    ).catch(error => {
      requests.delete(rawUrl)

      if (requestType === 'image' && placeholderImage) {
        consoleWarn('Failed to fetch image base64, trying to use placeholder image', url)
        return typeof placeholderImage === 'string'
          ? placeholderImage
          : placeholderImage(imageDom!)
      }

      throw error
    }) as any

    requests.set(rawUrl, request)
  }

  return request.response
}
