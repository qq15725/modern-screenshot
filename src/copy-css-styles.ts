import { getDefaultStyle } from './get-default-style'

export function copyCssStyles<T extends HTMLElement | SVGElement>(
  node: T,
  clone: T,
  ownerWindow: Window,
) {
  const style = ownerWindow.getComputedStyle(node)
  const cloneStyle = clone.style
  const defaultStyle = getDefaultStyle(node.tagName)

  for (let i = style.length - 1; i >= 0; i--) {
    const name = style.item(i)
    const value = style.getPropertyValue(name)
    const priority = style.getPropertyPriority(name)
    if (
      defaultStyle[name] === value
      && !node.getAttribute(name)
      && !priority
    ) continue
    cloneStyle.setProperty(name, value, priority)
  }

  // Css fixes
  // https://github.com/RigoCorp/html-to-image/blob/master/src/cssFixes.ts
  if (ownerWindow.navigator.userAgent.match(/\bChrome\//)) {
    applyChromiumKerningFix(clone)
    applyChromiumEllipsisFix(node, clone)
  }
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
function applyChromiumKerningFix<T extends HTMLElement | SVGElement>(clone: T): void {
  if (clone.style.fontKerning === 'auto') {
    clone.style.fontKerning = 'normal'
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
function applyChromiumEllipsisFix<T extends HTMLElement | SVGElement>(
  node: T,
  clone: T,
): void {
  if (
    clone.style.overflow === 'hidden'
    && clone.style.textOverflow === 'ellipsis'
    && node.scrollWidth === node.clientWidth
  ) {
    clone.style.textOverflow = 'clip'
  }
}
