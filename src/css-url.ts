import { fetch } from './fetch'
import { getMimeType, isDataUrl, makeDataUrl, resolveUrl } from './utils'

import type { Options } from './options'

const CSS_URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g

export async function replaceCssUrlToDataUrl(
  cssText: string,
  baseUrl?: string | null,
  options?: Options,
): Promise<string> {
  if (!hasCssUrl(cssText)) return cssText

  for (const url of parseCssUrls(cssText)) {
    cssText = await replaceCssUrl(cssText, url, baseUrl, options)
  }

  return cssText
}

export function hasCssUrl(cssText: string): boolean {
  return CSS_URL_REGEX.test(cssText)
}

function parseCssUrls(cssText: string): string[] {
  const result: string[] = []

  cssText.replace(CSS_URL_REGEX, (raw, quotation, url) => {
    result.push(url)
    return raw
  })

  return result.filter((url) => !isDataUrl(url))
}

async function replaceCssUrl(
  cssText: string,
  url: string,
  baseUrl?: string | null,
  options?: Options,
  customFetch?: (url: string, options?: Options) => Promise<string>,
): Promise<string> {
  url = baseUrl
    ? resolveUrl(url, baseUrl)
    : url

  try {
    const data = customFetch
      ? await customFetch(url)
      : await fetch(url, options)

    const dataUrl = typeof data === 'string'
      ? makeDataUrl(data, getMimeType(url))
      : makeDataUrl(data.blob, getMimeType(url) || data.contentType)

    return cssText.replace(cssUrl2regex(url), `$1${ dataUrl }$3`)
  } catch (_) {
    return cssText
  }
}

function cssUrl2regex(url: string): RegExp {
  // eslint-disable-next-line no-useless-escape
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
  return new RegExp(`(url\\(['"]?)(${ escaped })(['"]?\\))`, 'g')
}
