import { fetchDataUrl } from './fetch'
import { isDataUrl, resolveUrl } from './utils'

import type { Options } from './options'

const CSS_URL_RE = /url\((['"]?)([^'"]+?)\1\)/g

export async function replaceCssUrlToDataUrl(
  cssText: string,
  baseUrl?: string | null,
  options?: Options,
  isImage?: boolean,
): Promise<string> {
  if (!hasCssUrl(cssText)) return cssText

  for (const url of parseCssUrls(cssText)) {
    try {
      const dataUrl = await fetchDataUrl(
        baseUrl
          ? resolveUrl(url, baseUrl)
          : url,
        options,
        isImage,
      )
      cssText = cssText.replace(toRE(url), `$1${ dataUrl }$3`)
    } catch (e) {
      console.error(e)
    }
  }

  return cssText
}

export function hasCssUrl(cssText: string): boolean {
  return CSS_URL_RE.test(cssText)
}

function parseCssUrls(cssText: string): string[] {
  const result: string[] = []

  cssText.replace(CSS_URL_RE, (raw, quotation, url) => {
    result.push(url)
    return raw
  })

  return result.filter((url) => !isDataUrl(url))
}

function toRE(url: string): RegExp {
  // eslint-disable-next-line no-useless-escape
  const escaped = url.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
  return new RegExp(`(url\\(['"]?)(${ escaped })(['"]?\\))`, 'g')
}
