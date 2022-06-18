import { arrayFrom } from './utils'

const DEFAULT_STYLE = getDefaultComputedStyle()

export function cloneStyle<T extends HTMLElement>(node: T, cloned: T): T {
  if (node instanceof Element) {
    const source = window.getComputedStyle(node)
    const style = cloned.style

    if (style) {
      if (source.cssText) {
        style.cssText = source.cssText
      } else {
        arrayFrom<string>(source).forEach((name) => {
          const value = source.getPropertyValue(name)
          const priority = source.getPropertyPriority(name)
          if (DEFAULT_STYLE[name] === value && !priority) return
          style.setProperty(name, value, priority)
        })
      }
    }

    // Css fixes
    // https://github.com/RigoCorp/html-to-image/blob/master/src/cssFixes.ts
    if (window.navigator.userAgent.match(/\bChrome\//)) {
      applyChromiumKerningFix(cloned)
      applyChromiumEllipsisFix(node, cloned)
    }
  }

  return cloned
}

function getDefaultComputedStyle() {
  const style: Record<string, string> = {}
  const el = document.createElement(`egami--${ new Date().getTime() }`)
  document.body.appendChild(el)
  const source = window.getComputedStyle(el)
  arrayFrom<string>(source).forEach((name) => style[name] = source.getPropertyValue(name))
  el.remove()
  return style
}

/*
 * For Chromium-based browsers, we replace "font-kerning: auto" with
 * "font-kerning: normal".
 *
 * While rendering HTML in said browsers, "auto" enables kerning for all
 * glyphs, behaving like "normal". When rendering SVG, however, Chromium
 * instead uses a faster, mixed approach where kerning is enabled for pairs of
 * letters, but not for a letter and a space.
 *
 * Without this fix, the rendered width of some nodes might be wider than
 * calculated, resulting in broken layouts.
 *
 * For Firefox, this is not required as it treats "font-kerning" consistently
 * both when rendering HTML and when rendering SVG.
 */
function applyChromiumKerningFix<T extends HTMLElement>(cloned: T): void {
  if (cloned.style.fontKerning === 'auto') {
    cloned.style.fontKerning = 'normal'
  }
}

/*
 * In Chromium-based browsers, if a node has ellipsis text overflow configured
 * (this is, has both "overflow: hidden" and "text-overflow: ellipsis"), but
 * it doesn't really overflow, we'll disable it.
 *
 * Without this fix, rounding errors in the calculated node widths can cause
 * the ellipsis to be displayed in the generated SVG, even if the full text
 * was displayed in the original HTML.
 *
 * For Firefox this is not required, as it seems its calculations are more
 * accurate.
 */
function applyChromiumEllipsisFix<T extends HTMLElement>(
  node: T,
  cloned: T,
): void {
  if (
    cloned.style.overflow === 'hidden'
    && cloned.style.textOverflow === 'ellipsis'
    && node.scrollWidth === node.clientWidth
  ) {
    cloned.style.textOverflow = 'clip'
  }
}
