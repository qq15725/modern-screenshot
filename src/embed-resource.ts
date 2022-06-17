import { urlGetContent } from './embed-url-content'
import { getMimeType, isDataUrl, makeDataUrl, resolveUrl } from './utils'

import type { Options } from './options'

const URL_REGEX = /url\((['"]?)([^'"]+?)\1\)/g
const URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g
const FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g

export function toRegex(url: string): RegExp {
  // eslint-disable-next-line no-useless-escape
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
  return new RegExp(`(url\\(['"]?)(${ escaped })(['"]?\\))`, 'g')
}

export function parseUrls(cssText: string): string[] {
  const result: string[] = []

  cssText.replace(URL_REGEX, (raw, quotation, url) => {
    result.push(url)
    return raw
  })

  return result.filter((url) => !isDataUrl(url))
}

export async function embed(
  cssText: string,
  resourceURL: string,
  baseURL: string | null,
  options: Options,
  get?: (url: string) => Promise<string>,
): Promise<string> {
  const url = baseURL
    ? resolveUrl(resourceURL, baseURL)
    : resourceURL

  try {
    const data = get
      ? await get(url)
      : await urlGetContent(url, options)

    const dataUrl = typeof data === 'string'
      ? makeDataUrl(data, getMimeType(resourceURL))
      : makeDataUrl(
        data.blob,
        getMimeType(resourceURL) || data.contentType,
      )

    return cssText.replace(toRegex(resourceURL), `$1${ dataUrl }$3`)
  } catch (_) {
    return url
  }
}

function filterPreferredFontFormat(
  str: string,
  { preferredFontFormat }: Options,
): string {
  return !preferredFontFormat
    ? str
    : str.replace(FONT_SRC_REGEX, (match: string) => {
      while (true) {
        const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || []
        if (!format) return ''
        if (format === preferredFontFormat) return `src: ${ src };`
      }
    })
}

export async function embedResource(
  cssText: string,
  baseUrl: string | null,
  options: Options,
): Promise<string> {
  if (!URL_REGEX.test(cssText)) return cssText

  const filteredCSSText = filterPreferredFontFormat(cssText, options)

  const urls = parseUrls(filteredCSSText)

  return urls.reduce(
    (deferred, url) => {
      return deferred.then((css) => embed(css, url, baseUrl, options))
    },
    Promise.resolve(filteredCSSText),
  )
}
