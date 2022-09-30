<h1 align="center">modern-screenshot</h1>

<p align="center">
  <a href="https://github.com/qq15725/modern-screenshot/blob/master/LICENSE" class="mr-3">
    <img src="https://img.shields.io/npm/l/modern-screenshot.svg" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/modern-screenshot">
    <img src="https://img.shields.io/npm/v/modern-screenshot.svg" alt="Version">
  </a>
  <a href="https://cdn.jsdelivr.net/npm/modern-screenshot/dist/index.js">
    <img src="https://img.shields.io/bundlephobia/minzip/modern-screenshot" alt="Minzip">
  </a>
</p>

<p align="center"><a href="README.md">README</a> | <a href="README_zh.md">中文文档</a></p>

<p align="center">使用 HTML5 canvas 和 SVG 生成图像</p>

<p align="center">Fork from <a href="https://github.com/bubkoo/html-to-image">html-to-image</a></p>

## 安装

### pnpm

```sh
pnpm add modern-screenshot
```

### npm

```sh
npm i modern-screenshot
```

## 使用

### 基本用法

```ts
import { dom2png } from 'modern-screenshot'

dom2png(document.querySelector('#app')).then(png => {
  const img = new Image()
  img.src = png
  document.body.appendChild(img)
})
```

### CDN 的用法

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>modern-screenshot</title>
  <script src="https://cdn.jsdelivr.net/npm/modern-screenshot/dist/index.js"></script>
  <script>
    window.onload = async () => {
      document.body.appendChild(
        await window['modern-screenshot'].dom2image(document.querySelector('body > *')),
      )
    }
  </script>
</head>
<body>
<div>modern-screenshot</div>
</body>
</html>
```

## 所有转换

```ts
declare function canvas2blob(canvas: HTMLCanvasElement, options?: BlobOptions): Promise<Blob | null>;
declare function dom2blob<T extends Node>(node: T, options?: Options & BlobOptions): Promise<Blob | null>;
declare function dom2canvas<T extends Node>(node: T, options?: Options): Promise<HTMLCanvasElement>;
declare function dom2image<T extends Node>(node: T, options?: Options): Promise<HTMLImageElement>;
declare function dom2jpeg<T extends Node>(node: T, options?: Options & JpegOptions): Promise<string>;
declare function dom2pixel<T extends Node>(node: T, options?: Options): Promise<Uint8ClampedArray>;
declare function dom2png<T extends Node>(node: T, options?: Options): Promise<string>;
declare function dom2svg<T extends Node>(node: T, options?: Options): Promise<SVGElement>;
declare function image2canvas<T extends HTMLImageElement>(image: T, options?: Options): Promise<HTMLCanvasElement>;
declare function svg2canvas<T extends SVGElement>(svg: T, options?: Options): Promise<HTMLCanvasElement>;
declare function svg2image<T extends SVGElement>(svg: T): HTMLImageElement;
```

## 选项

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
   * The pixel ratio of captured image. Defalut is the actual pixel ratio of
   * the device. Set 1 to use as initial-scale 1 for the image
   */
  scale?: number

  /**
   * A string value for the background color, any valid CSS color value.
   */
  backgroundColor?: string

  /**
   * An object whose properties to be copied to node's style before rendering.
   */
  style?: Partial<CSSStyleDeclaration>

  /**
   * A function taking DOM node as argument. Should return `true` if passed
   * node should be included in the output. Excluding node means excluding
   * it's children as well.
   */
  filter?: (el: Node) => boolean

  /**
   * Maximum canvas size (pixels).
   *
   * https://developer.mozilla.org/en-US/docs/Web/HTML/Element/canvas#maximum_canvas_size
   *
   * default: 16384
   */
  maximumCanvasSize?: number

  /**
   * Fetch resources
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
   * Fonts download and embed.
   */
  font?: false | {
    /**
     * The preferred font format. If specified all other font formats are ignored.
     */
    preferredFormat?: 'woff' | 'woff2' | 'truetype' | 'opentype' | 'embedded-opentype' | 'svg' | string

    /**
     * A CSS string to specify for font embeds. If specified only this CSS will
     * be present in the resulting image.
     */
    cssText?: string
  }
}

export interface JpegOptions {

  /**
   * A number between `0` and `1` indicating image quality (e.g. 0.92 => 92%)
   * of the JPEG image.
   */
  quality?: number
}

export interface BlobOptions extends JpegOptions {
  /**
   * A string indicating the image format. The default type is image/png; that type is also used if the given type isn't supported.
   */
  type?: string
}
```
