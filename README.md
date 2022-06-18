<h1 align="center">egami → image</h1>

<p align="center">
  <a href="https://github.com/qq15725/egami/blob/master/LICENSE" class="mr-3">
    <img src="https://img.shields.io/npm/l/egami.svg" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/egami">
    <img src="https://img.shields.io/npm/v/egami.svg" alt="Version">
  </a>
</p>

<p align="center"><a href="README.md">README</a> | <a href="README_zh.md">中文文档</a></p>

<p align="center">Generate image using HTML5 canvas and SVG</p>

<p align="center">Fork from <a href="https://github.com/bubkoo/html-to-image">html-to-image</a></p>

## Installation

### pnpm

```sh
pnpm add egami
```

### npm

```sh
npm i egami
```

## Usage

```ts
import { dom2png } from 'egami'

dom2png(document.querySelector('#app')).then(png => {
  const img = new Image()
  img.src = png
  document.body.appendChild(img)
})
```

## All converts

```ts
declare function canvas2blob(canvas: HTMLCanvasElement, options?: Options): Promise<Blob | null>;
declare function dom2blob<T extends HTMLElement>(node: T, options?: Options): Promise<Blob | null>;
declare function dom2canvas<T extends HTMLElement>(node: T, options?: Options): Promise<HTMLCanvasElement>;
declare function dom2image<T extends HTMLElement>(node: T, options?: Options): Promise<HTMLImageElement>;
declare function dom2png<T extends HTMLElement>(node: T, options?: Options): Promise<string>;
declare function dom2jpeg<T extends HTMLElement>(node: T, options?: Options): Promise<string>;
declare function dom2pixel<T extends HTMLElement>(node: T, options?: Options): Promise<Uint8ClampedArray>;
declare function dom2svg<T extends HTMLElement>(node: T, options?: Options): Promise<SVGSVGElement>;
declare function svg2canvas<T extends SVGSVGElement>(svg: T, options?: Options): Promise<HTMLCanvasElement>;
```

## Options

```ts
export interface Options {
  /**
   * Width in pixels to be applied to node before rendering.
   */
  width?: number

  /**
   * Height in pixels to be applied to node before rendering.
   */
  height?: number

  /**
   * A string value for the background color, any valid CSS color value.
   */
  backgroundColor?: string

  /**
   * A string indicating the image format. The default type is image/png; that type is also used if the given type isn't supported.
   */
  type?: string

  /**
   * A number between `0` and `1` indicating image quality (e.g. 0.92 => 92%)
   * of the JPEG image.
   */
  quality?: number

  /**
   * An object whose properties to be copied to node's style before rendering.
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * A function taking DOM node as argument. Should return `true` if passed
   * node should be included in the output. Excluding node means excluding
   * it's children as well.
   */
  filter?: (el: HTMLElement) => boolean

  /**
   * Canvas
   */
  canvas: {
    /**
     * Width in pixels to be applied to canvas on export.
     */
    width?: number

    /**
     * Height in pixels to be applied to canvas on export.
     */
    height?: number

    /**
     * The pixel ratio of captured image. Defalut is the actual pixel ratio of
     * the device. Set 1 to use as initial-scale 1 for the image
     */
    pixelRatio?: number

    /**
     * A boolean to turn off auto scaling for truly massive images..
     */
    skipAutoScale?: boolean
  }

  /**
   * Fetch
   */
  fetch?: {
    /**
     * the second parameter of window.fetch RequestInit
     */
    requestInit?: RequestInit

    /**
     * Set to `true` to append the current time as a query string to URL
     * requests to enable cache busting.
     */
    bypassingCache?: boolean

    /**
     * A data URL for a placeholder image that will be used when fetching
     * an image fails. Defaults to an empty string and will render empty
     * areas for failed images.
     */
    placeholderImage?: string
  }

  /**
   * Font
   */
  font?: {
    /**
     * Option to skip the fonts download and embed.
     */
    skip?: boolean

    /**
     * The preferred font format. If specified all other font formats are ignored.
     */
    preferredFormat?: 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg' | string

    /**
     * A CSS string to specify for font embeds. If specified only this CSS will
     * be present in the resulting image.
     */
    css?: string
  }
}
```
