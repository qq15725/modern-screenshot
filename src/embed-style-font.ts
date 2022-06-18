import { arrayFrom } from './utils'
import { hasCssUrl, replaceCssUrlToDataUrl } from './css-url'

import type { Options } from './options'

interface Metadata {
  url: string
  cssText: Promise<string>
}

export async function embedStyleFont(
  cloned: HTMLElement,
  options?: Options,
): Promise<HTMLElement> {
  if (options?.font?.skip) return cloned

  const style = document.createElement('style')

  let cssText = options?.font?.css
    ?? await parseStyleFontCss(cloned, options)

  cssText = filterPreferredFormat(cssText)

  style.appendChild(document.createTextNode(cssText))

  if (cloned.firstChild) {
    cloned.insertBefore(style, cloned.firstChild)
  } else {
    cloned.appendChild(style)
  }

  return cloned
}

export async function parseStyleFontCss<T extends HTMLElement>(
  node: T,
  options?: Options,
): Promise<string> {
  const cssRules = await parseCssRules(node)

  const cssTexts = await Promise.all(
    cssRules.map((rule) => {
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

async function parseCssRules<T extends HTMLElement>(
  node: T,
): Promise<CSSRule[]> {
  if (node.ownerDocument == null) throw new Error('Provided element is not within a Document')
  const cssRules = await styleSheets2cssRules(arrayFrom(node.ownerDocument.styleSheets))
  return cssRules
    .filter(rule => rule.type === CSSRule.FONT_FACE_RULE)
    .filter(rule => hasCssUrl(rule.style.getPropertyValue('src')))
}

async function styleSheets2cssRules(
  styleSheets: CSSStyleSheet[],
): Promise<CSSStyleRule[]> {
  const ret: CSSStyleRule[] = []
  const deferreds: Promise<number | void>[] = []

  // First loop inlines imports
  for (const sheet of styleSheets) {
    if (!('cssRules' in sheet)) continue
    const rules = arrayFrom<CSSRule>(sheet.cssRules)
    try {
      for (const index in rules) {
        const rule = rules[index]
        if (rule.type !== CSSRule.IMPORT_RULE) continue
        let importIndex = Number(index) + 1
        const url = (rule as CSSImportRule).href
        const deferred = fetchCss(url)
          .then((metadata) => (metadata ? embedFonts(metadata) : ''))
          .then((cssText) =>
            parseCss(cssText).forEach((rule) => {
              try {
                sheet.insertRule(
                  rule,
                  rule.startsWith('@import')
                    ? (importIndex += 1)
                    : sheet.cssRules.length!,
                )
              } catch (error) {
                console.error('Error inserting rule from remote css', {
                  rule,
                  error,
                })
              }
            }),
          )
          .catch((e) => {
            console.error('Error loading remote css', e.toString())
          })

        deferreds.push(deferred)
      }
    } catch (e: any) {
      const inline
        = styleSheets.find((a) => a.href == null) || document.styleSheets[0]
      if (sheet.href != null) {
        deferreds.push(
          fetchCss(sheet.href)
            .then((metadata) => (metadata ? embedFonts(metadata) : ''))
            .then((cssText) =>
              parseCss(cssText).forEach((rule) => {
                inline.insertRule(rule, sheet.cssRules.length)
              }),
            )
            .catch((err) => {
              console.error('Error loading remote stylesheet', err.toString())
            }),
        )
      }
      console.error('Error inlining remote css file', e.toString())
    }
  }

  return Promise.all(deferreds).then(() => {
    // Second loop parses rules
    styleSheets.forEach((sheet) => {
      if ('cssRules' in sheet) {
        try {
          arrayFrom<CSSStyleRule>(sheet.cssRules).forEach(
            (item: CSSStyleRule) => {
              ret.push(item)
            },
          )
        } catch (e: any) {
          console.error(
            `Error while reading CSS rules from ${ sheet.href }`,
            e.toString(),
          )
        }
      }
    })

    return ret
  })
}

const cssFetchCache: {
  [href: string]: Promise<void | Metadata>
} = {}

function fetchCss(url: string): Promise<void | Metadata> {
  const cache = cssFetchCache[url]
  if (cache != null) {
    return cache
  }

  const deferred = window.fetch(url).then((res) => ({
    url,
    cssText: res.text(),
  }))

  cssFetchCache[url] = deferred

  return deferred
}

async function embedFonts(meta: Metadata): Promise<string> {
  return meta.cssText.then((raw: string) => {
    let cssText = raw
    const regexUrl = /url\(["']?([^"')]+)["']?\)/g
    const fontLocs = cssText.match(/url\([^)]+\)/g) || []
    const loadFonts = fontLocs.map((location: string) => {
      let url = location.replace(regexUrl, '$1')
      if (!url.startsWith('https://')) {
        url = new URL(url, meta.url).href
      }

      // eslint-disable-next-line promise/no-nesting
      return window
        .fetch(url)
        .then((res) => res.blob())
        .then(
          (blob) =>
            new Promise<[string, string | ArrayBuffer | null]>(
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
            ),
        )
    })

    // eslint-disable-next-line promise/no-nesting
    return Promise.all(loadFonts).then(() => cssText)
  })
}

function parseCss(source: string) {
  if (source == null) {
    return []
  }

  const result: string[] = []
  const commentsRegex = /(\/\*[\s\S]*?\*\/)/gi
  // strip out comments
  let cssText = source.replace(commentsRegex, '')

  const keyframesRegex = /((@.*?keyframes [\s\S]*?){([\s\S]*?}\s*?)})/gi
  // eslint-disable-next-line no-constant-condition
  while (true) {
    const matches = keyframesRegex.exec(cssText)
    if (matches === null) {
      break
    }
    result.push(matches[0])
  }
  cssText = cssText.replace(keyframesRegex, '')

  const importRegex = /@import[\s\S]*?url\([^)]*\)[\s\S]*?;/gi
  // to match css & media queries together
  const combinedCSSRegex
    = '((\\s*?(?:\\/\\*[\\s\\S]*?\\*\\/)?\\s*?@media[\\s\\S]'
    + '*?){([\\s\\S]*?)}\\s*?})|(([\\s\\S]*?){([\\s\\S]*?)})'
  // unified regex
  const unifiedRegex = new RegExp(combinedCSSRegex, 'gi')
  // eslint-disable-next-line no-constant-condition
  while (true) {
    let matches = importRegex.exec(cssText)
    if (matches === null) {
      matches = unifiedRegex.exec(cssText)
      if (matches === null) {
        break
      } else {
        importRegex.lastIndex = unifiedRegex.lastIndex
      }
    } else {
      unifiedRegex.lastIndex = importRegex.lastIndex
    }
    result.push(matches[0])
  }

  return result
}

const URL_WITH_FORMAT_REGEX = /url\([^)]+\)\s*format\((["']?)([^"']+)\1\)/g
const FONT_SRC_REGEX = /src:\s*(?:url\([^)]+\)\s*format\([^)]+\)[,;]\s*)+/g

function filterPreferredFormat(
  str: string,
  options?: Options,
): string {
  return options?.font?.preferredFormat
    ? str.replace(FONT_SRC_REGEX, (match: string) => {
      while (true) {
        const [src, , format] = URL_WITH_FORMAT_REGEX.exec(match) || []
        if (!format) return ''
        if (format === options!.font!.preferredFormat) return `src: ${ src };`
      }
    })
    : str
}

