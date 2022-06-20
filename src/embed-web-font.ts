import { hasCssUrl, replaceCssUrlToDataUrl } from './css-url'
import { getWindow } from './get-window'
import { fetch, fetchText } from './fetch'

import type { HandleNodeFunc } from './types'
import type { Options } from './options'

export const embedWebFont: HandleNodeFunc = async (cloned, options) => {
  if (options?.font === false || !(cloned instanceof HTMLElement)) return

  let cssText = options?.font?.css
    ?? await parseWebFontCss(cloned.ownerDocument, options)

  if (!cssText) return

  cssText = filterPreferredFormat(cssText)

  const style = getWindow(options).document.createElement('style')
  style.appendChild(getWindow(options).document.createTextNode(cssText))

  if (cloned.firstChild) {
    cloned.insertBefore(style, cloned.firstChild)
  } else {
    cloned.appendChild(style)
  }
}

export async function parseWebFontCss(
  document?: Document,
  options?: Options,
): Promise<string> {
  if (!document) return ''

  const cssRules = await getCssRules(
    Array.from(document.styleSheets),
    options,
  )

  const cssTexts = await Promise.all(
    cssRules
      .filter(rule => (
        rule.constructor.name === 'CSSFontFaceRule'
          && hasCssUrl((rule as CSSFontFaceRule).style.getPropertyValue('src'))
      ))
      .map(async rule => {
        return replaceCssUrlToDataUrl(
          rule.cssText,
          rule.parentStyleSheet
            ? rule.parentStyleSheet.href
            : null,
          options,
        )
      }),
  )

  return cssTexts.join('\n')
}

async function getCssRules(
  styleSheets: CSSStyleSheet[],
  options?: Options,
): Promise<CSSRule[]> {
  const ret: CSSRule[] = []

  await Promise.all(
    styleSheets
      .filter(sheet => 'cssRules' in sheet)
      .map(async (sheet, index) => {
        await Promise.all(
          Array.from(sheet.cssRules)
            .filter(rule => rule.constructor.name === 'CSSImportRule')
            .map(async rule => {
              let importIndex = index + 1
              const url = (rule as CSSImportRule).href
              try {
                const cssText = await fetchText(url, options)
                const embedCssText = await embedFonts(cssText, url)
                for (const rule of parseCss(embedCssText)) {
                  try {
                    sheet.insertRule(
                      rule,
                      rule.startsWith('@import')
                        ? (importIndex += 1)
                        : sheet.cssRules.length!,
                    )
                  } catch (error) {
                    console.error('Error inserting rule from remote css', { rule, error })
                  }
                }
              } catch (e: any) {
                console.error('Error loading remote css', e.toString())
              }
            }),
        )
      }),
  )

  // Second loop parses rules
  styleSheets.forEach((sheet) => {
    if ('cssRules' in sheet) {
      try {
        ret.push(...sheet.cssRules)
      } catch (e: any) {
        console.error(`Error while reading CSS rules from ${ sheet.href }`, e.toString())
      }
    }
  })

  return ret
}

const URL_MATCH_RE = /url\([^)]+\)/g
const URL_REPLACE_RE = /url\(["']?([^"')]+)["']?\)/g

async function embedFonts(cssText: string, baseUrl: string, options?: Options): Promise<string> {
  await Promise.all(
    cssText.match(URL_MATCH_RE)?.map(async location => {
      let url = location.replace(URL_REPLACE_RE, '$1')
      if (!url.startsWith('https://')) url = new URL(url, baseUrl).href
      const rep = await fetch(url, options)
      const blob = await rep.blob()
      return new Promise<[string, string | ArrayBuffer | null]>(
        (resolve, reject) => {
          const reader = new FileReader()
          reader.onloadend = () => {
            // Side Effect
            cssText = cssText.replace(location, `url(${ reader.result })`)
            resolve([location, reader.result])
          }
          reader.onerror = reject
          reader.readAsDataURL(blob)
        },
      )
    }) ?? [],
  )
  return cssText
}

const COMMENTS_RE = /(\/\*[\s\S]*?\*\/)/gi
const KEYFRAMES_RE = /((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi

function parseCss(source: string) {
  if (source == null) return []
  const result: string[] = []
  let cssText = source.replace(COMMENTS_RE, '')
  while (true) {
    const matches = KEYFRAMES_RE.exec(cssText)
    if (!matches) break
    result.push(matches[0])
  }
  cssText = cssText.replace(KEYFRAMES_RE, '')
  // to match css & media queries together
  const IMPORT_RE = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi
  const UNIFIED_RE = new RegExp(
    '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]'
    + '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})',
    'gi',
  )
  while (true) {
    let matches = IMPORT_RE.exec(cssText)
    if (!matches) {
      matches = UNIFIED_RE.exec(cssText)
      if (!matches) {
        break
      } else {
        IMPORT_RE.lastIndex = UNIFIED_RE.lastIndex
      }
    } else {
      UNIFIED_RE.lastIndex = IMPORT_RE.lastIndex
    }
    result.push(matches[0])
  }
  return result
}

const URL_WITH_FORMAT_RE = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g
const FONT_SRC_RE = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g

function filterPreferredFormat(
  str: string,
  options?: Options,
): string {
  const preferredFormat = options?.font
    ? options?.font?.preferredFormat
    : undefined

  return preferredFormat
    ? str.replace(FONT_SRC_RE, (match: string) => {
      while (true) {
        const [src, , format] = URL_WITH_FORMAT_RE.exec(match) || []
        if (!format) return ''
        if (format === preferredFormat) return `src: ${ src };`
      }
    })
    : str
}

