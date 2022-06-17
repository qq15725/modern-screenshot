<h1 align="center">Egami => Image</h1>

<p align="center">
  <a href="https://github.com/qq15725/egami/blob/master/LICENSE" class="mr-3">
    <img src="https://img.shields.io/npm/l/egami.svg" alt="License">
  </a>
  <a href="https://www.npmjs.com/package/egami">
    <img src="https://img.shields.io/npm/v/egami.svg" alt="Version">
  </a>
</p>

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

## All exports

```ts
declare function dom2blob<T extends HTMLElement>(node: T, options?: Options): Promise<Blob | null>;
declare function dom2canvas<T extends HTMLElement>(node: T, options?: Options): Promise<HTMLCanvasElement>;
declare function dom2image<T extends HTMLElement>(node: T, options?: Options): Promise<HTMLImageElement>;
declare function dom2png<T extends HTMLElement>(node: T, options?: Options): Promise<string>;
declare function dom2jpeg<T extends HTMLElement>(node: T, options?: Options): Promise<string>;
declare function dom2svg<T extends HTMLElement>(node: T, options?: Options): Promise<SVGSVGElement>;
declare function svg2canvas<T extends SVGSVGElement>(svg: T, options?: Options): Promise<HTMLCanvasElement>;
```
