import type { Context } from './context'
import { hasCssUrl, replaceCssUrlToDataUrl, URL_RE } from './css-url'
import { contextFetch } from './fetch'
import { isCssFontFaceRule, isCSSImportRule, resolveUrl, splitFontFamily } from './utils'

export async function embedWebFont<T extends Element>(
  clone: T,
  context: Context,
): Promise<void> {
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
  ) {
    return
  }

  if (font && font.cssText) {
    const cssText = filterPreferredFormat(font.cssText, context)
    svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}\n`))
  }
  else {
    const styleSheets = Array.from(ownerDocument.styleSheets).filter((styleSheet) => {
      try {
        return 'cssRules' in styleSheet && Boolean(styleSheet.cssRules.length)
      }
      catch (error) {
        context.log.warn(`Error while reading CSS rules from ${styleSheet.href}`, error)
        return false
      }
    })

    await Promise.all(
      styleSheets.flatMap((styleSheet) => {
        return Array.from(styleSheet.cssRules).map(async (cssRule, index) => {
          if (isCSSImportRule(cssRule)) {
            let importIndex = index + 1
            const baseUrl = cssRule.href
            let cssText = ''
            try {
              cssText = await contextFetch(context, {
                url: baseUrl,
                requestType: 'text',
                responseType: 'text',
              })
            }
            catch (error) {
              context.log.warn(`Error fetch remote css import from ${baseUrl}`, error)
            }
            const replacedCssText = cssText.replace(
              URL_RE,
              (raw, quotation, url) => raw.replace(url, resolveUrl(url, baseUrl)),
            )
            for (const rule of parseCss(replacedCssText)) {
              try {
                styleSheet.insertRule(
                  rule,
                  rule.startsWith('@import')
                    ? (importIndex += 1)
                    : styleSheet.cssRules.length!,
                )
              }
              catch (error) {
                context.log.warn('Error inserting rule from remote css import', { rule, error })
              }
            }
          }
        })
      }),
    )

    const cssRules = styleSheets.flatMap(styleSheet => Array.from(styleSheet.cssRules))

    cssRules
      .filter(cssRule => (
        isCssFontFaceRule(cssRule)
        && hasCssUrl(cssRule.style.getPropertyValue('src'))
        && splitFontFamily(cssRule.style.getPropertyValue('font-family'))
          ?.some(val => fontFamilies.has(val))
      ))
      .forEach((value) => {
        const rule = value as CSSFontFaceRule
        const cssText = fontCssTexts.get(rule.cssText)
        if (cssText) {
          svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}\n`))
        }
        else {
          tasks.push(
            replaceCssUrlToDataUrl(
              rule.cssText,
              rule.parentStyleSheet
                ? rule.parentStyleSheet.href
                : null,
              context,
            ).then((cssText) => {
              cssText = filterPreferredFormat(cssText, context)
              fontCssTexts.set(rule.cssText, cssText)
              svgStyleElement.appendChild(ownerDocument.createTextNode(`${cssText}\n`))
            }),
          )
        }
      })
  }
}

const COMMENTS_RE = /(\/\*[\s\S]*?\*\/)/g
// eslint-disable-next-line
const KEYFRAMES_RE = /((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi

function parseCss(source: string): string[] {
  if (source == null)
    return []
  const result: string[] = []
  let cssText = source.replace(COMMENTS_RE, '')
  while (true) {
    const matches = KEYFRAMES_RE.exec(cssText)
    if (!matches)
      break
    result.push(matches[0])
  }
  cssText = cssText.replace(KEYFRAMES_RE, '')
  // to match css & media queries together
  const IMPORT_RE = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi
  const UNIFIED_RE = new RegExp(
    // eslint-disable-next-line
    '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]'
    // eslint-disable-next-line
    + '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})',
    'gi',
  )
  while (true) {
    let matches = IMPORT_RE.exec(cssText)
    if (!matches) {
      matches = UNIFIED_RE.exec(cssText)
      if (!matches) {
        break
      }
      else {
        IMPORT_RE.lastIndex = UNIFIED_RE.lastIndex
      }
    }
    else {
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
        if (!format)
          return ''
        if (format === preferredFormat)
          return `src: ${src};`
      }
    })
    : str
}
