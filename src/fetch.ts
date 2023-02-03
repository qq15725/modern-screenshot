import { consoleWarn, getMimeType } from './utils'
import type { Context } from './context'

export function fetch(url: string, context: Context) {
  const {
    timeout,
    fetch: {
      bypassingCache,
      requestInit,
    },
  } = context

  // cache bypass so we dont have CORS issues with cached images
  // ref: https://developer.mozilla.org/en/docs/Web/API/XMLHttpRequest/Using_XMLHttpRequest#Bypassing_the_cache
  if (bypassingCache) {
    url += (/\?/.test(url) ? '&' : '?') + new Date().getTime()
  }

  const controller = new AbortController()

  const timer = timeout
    ? setTimeout(() => controller.abort(), timeout)
    : undefined

  return window.fetch(url, { ...requestInit, signal: controller.signal })
    .finally(() => clearTimeout(timer))
}

export function fetchBase64(url: string, context: Context, isImage?: boolean) {
  const {
    requests,
    fetch: {
      placeholderImage,
    },
  } = context

  if (!requests.has(url)) {
    requests.set(url, {
      type: isImage ? 'image' : 'text',
      response: fetch(url, context).then(rep => {
        return rep.blob().then(blob => {
          return new Promise((resolve, reject) => {
            const reader = new FileReader()
            reader.onloadend = () => resolve({
              contentType: rep.headers.get('Content-Type') || '',
              content: (reader.result as string).split(/,/)[1],
            })
            reader.onerror = reject
            reader.readAsDataURL(blob)
          })
        })
      }, error => {
        consoleWarn('Failed to fetch base64', error)

        let placeholder = 'R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

        if (isImage && placeholderImage) {
          const parts = placeholderImage.split(/,/)
          if (parts && parts[1]) placeholder = parts[1]
        }

        return {
          contentType: 'image/png',
          content: placeholder,
        }
      }),
    })
  }

  return requests.get(url)!.response
}

export async function fetchDataUrl(url: string, context: Context, isImage?: boolean) {
  const { content, contentType } = await fetchBase64(url, context, isImage)
  const mimeType = getMimeType(url) ?? contentType
  return `data:${ mimeType };base64,${ content }`
}

export async function fetchText(url: string, context: Context): Promise<string> {
  const { requests } = context
  if (!requests.has(url)) {
    requests.set(url, {
      type: 'text',
      response: fetch(url, context).then(rep => {
        return rep.text().then(content => {
          return {
            contentType: rep.headers.get('Content-Type') || '',
            content,
          }
        })
      }),
    })
  }
  return requests.get(url)!.response.then(rep => rep.content)
}
