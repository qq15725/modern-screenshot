import { contextFetch } from './fetch'
import { consoleWarn, isDataUrl, resolveUrl } from './utils'
import type { Context } from './context'

export async function replaceCssUrlToDataUrl(
  cssText: string,
  baseUrl: string | null,
  context: Context,
  isImage?: boolean,
): Promise<string> {
  if (!hasCssUrl(cssText)) return cssText

  for (const [rawUrl, url] of parseCssUrls(cssText, baseUrl)) {
    try {
      const dataUrl = await contextFetch(
        context,
        {
          url,
          requestType: isImage ? 'image' : 'text',
          responseType: 'dataUrl',
        },
      )
      cssText = cssText.replace(toRE(rawUrl), `$1${ dataUrl }$3`)
    } catch (error) {
      consoleWarn('Failed to fetch css data url', rawUrl, error)
    }
  }

  return cssText
}

export function hasCssUrl(cssText: string): boolean {
  return /url\((['"]?)([^'"]+?)\1\)/.test(cssText)
}

export const URL_RE = /url\((['"]?)([^'"]+?)\1\)/g

function parseCssUrls(cssText: string, baseUrl: string | null): [string, string][] {
  const result: [string, string][] = []

  cssText.replace(URL_RE, (raw, quotation, url) => {
    result.push([url, resolveUrl(url, baseUrl)])
    return raw
  })

  return result.filter(([url]) => !isDataUrl(url))
}

function toRE(url: string): RegExp {
  // eslint-disable-next-line no-useless-escape
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
  return new RegExp(`(url\\(['"]?)(${ escaped })(['"]?\\))`, 'g')
}
