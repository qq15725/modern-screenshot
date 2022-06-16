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
import { dom2image } from 'egami'

dom2image(document.querySelector('#app')).then(dataURL => {
  const img = new Image()
  img.src = dataURL
  document.body.appendChild(img)
})
```
