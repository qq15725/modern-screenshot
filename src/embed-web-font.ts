import { hasCssUrl, replaceCssUrlToDataUrl } from './css-url'
import { fetch, fetchText } from './fetch'
import { consoleWarn, isCssFontFaceRule } from './utils'
import type { Context } from './context'

export async function embedWebFont<T extends Element>(
  clone: T,
  context: Context,
) {
  const {
    ownerDocument,
    svgStyleElement,
    fontFamilies,
    fontCssTexts,
    tasks,
    font,
  } = context

  if (
    !ownerDocument
    || !svgStyleElement
    || !fontFamilies.size
  ) return

  if (font && font.cssText) {
    const cssText = filterPreferredFormat(font.cssText, context)
    svgStyleElement.appendChild(ownerDocument.createTextNode(`\n${ cssText }\n`))
  } else {
    try {
      const cssRules = await getCssRules(Array.from(ownerDocument.styleSheets), context)

      cssRules
        .filter(rule => (
          isCssFontFaceRule(rule)
          && hasCssUrl(rule.style.getPropertyValue('src'))
          && rule.style.fontFamily.split(',').some(val => fontFamilies.has(val))
        ))
        .forEach((value) => {
          const rule = value as CSSFontFaceRule
          const cssText = fontCssTexts.get(rule.cssText)
          if (cssText) {
            svgStyleElement.appendChild(ownerDocument.createTextNode(`${ cssText }\n`))
          } else {
            tasks.push(
              replaceCssUrlToDataUrl(
                rule.cssText,
                rule.parentStyleSheet
                  ? rule.parentStyleSheet.href
                  : null,
                context,
              ).then(cssText => {
                cssText = filterPreferredFormat(cssText, context)
                fontCssTexts.set(rule.cssText, cssText)
                svgStyleElement.appendChild(ownerDocument.createTextNode(`${ cssText }\n`))
              }),
            )
          }
        })
    } catch (error) {
      consoleWarn('Failed to parse web font css', error)
    }
  }
}

async function getCssRules(
  styleSheets: CSSStyleSheet[],
  context: Context,
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
                const cssText = await fetchText(url, context)
                const embedCssText = await embedFonts(cssText, url, context)
                for (const rule of parseCss(embedCssText)) {
                  try {
                    sheet.insertRule(
                      rule,
                      rule.startsWith('@import')
                        ? (importIndex += 1)
                        : sheet.cssRules.length!,
                    )
                  } catch (error) {
                    consoleWarn('Error inserting rule from remote css', { rule, error })
                  }
                }
              } catch (error) {
                consoleWarn('Error loading remote css', error)
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
      } catch (error) {
        consoleWarn(`Error while reading CSS rules from ${ sheet.href }`, error)
      }
    }
  })

  return ret
}

const URL_MATCH_RE = /url\([^)]+\)/g
const URL_REPLACE_RE = /url\(["']?([^"')]+)["']?\)/g

async function embedFonts(cssText: string, baseUrl: string, context: Context): Promise<string> {
  await Promise.all(
    cssText.match(URL_MATCH_RE)?.map(async location => {
      let url = location.replace(URL_REPLACE_RE, '$1')
      if (!url.startsWith('https://')) url = new URL(url, baseUrl).href
      const rep = await fetch(url, context)
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
  context: Context,
): string {
  const { font } = context

  const preferredFormat = font
    ? font?.preferredFormat
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

