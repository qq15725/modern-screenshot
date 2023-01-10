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

<p align="center">Generate image using HTML5 canvas and SVG</p>

<p align="center">Fork from <a href="https://github.com/bubkoo/html-to-image">html-to-image</a></p>

<p align="center">English | <a href="README.zh-CN.md">简体中文</a></p>

## 📦 Install

```sh
npm i modern-screenshot
```

## 🦄 Usage

### Basic

```ts
import { domToPng } from 'modern-screenshot'

domToPng(document.querySelector('#app')).then(base64 => {
  open().document.write(`<img src="${ base64 }" />`)
})
```

### CDN

```html
<script src="https://unpkg.com/modern-screenshot"></script>
<script>
  modernScreenshot.domToPng(document.querySelector('body')).then(base64 => {
    open().document.write(`<img src="${ base64 }" />`)
  })
</script>
```

### Browser console

> ⚠️ Partial embedding will fail due to CORS

```js
const script = document.createElement('script')
script.src = "https://unpkg.com/modern-screenshot"
document.getElementsByTagName('head')[0].appendChild(script)

script.onload = () => {
  modernScreenshot
    .domToImage(document.querySelector('body'), {
      debug: true,
      progress: (current, total) => {
        console.log(`${ current }/${ total }`)
      }
    })
    .then(img => {
      const width = 600
      const height = img.height * (width / img.width)
      console.log('%c ', [
        `padding: 0 ${ width / 2 }px;`,
        `line-height: ${ height }px;`,
        `background-image: url('${ img.src }');`,
        `background-size: 100% 100%;`,
      ].join(''))
    })
}
```

## Methods

> Such as `domToPng(node, options)`

DOM to dataURL

- [domToPng](src/converts/dom-to-png.ts)
- [domToSvg](src/converts/dom-to-svg.ts)
- [domToJpeg](src/converts/dom-to-jpeg.ts)
- [domToWebp](src/converts/dom-to-webp.ts)
- [domToDataUrl](src/converts/dom-to-data-url.ts)

DOM to data

- [domToBlob](src/converts/dom-to-blob.ts)
- [domToPixel](src/converts/dom-to-pixel.ts)

DOM to HTMLElement

- [domToForeignObjectSvg](src/converts/dom-to-foreign-object-svg.ts)
- [domToImage](src/converts/dom-to-image.ts)
- [domToCanvas](src/converts/dom-to-canvas.ts)

## Options

[the type definition of the option](src/options.ts)

## Known problems

- [ ] unable to clone closed [shadowDom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

  `input::placeholder { color: red; }`

- [ ] unable to clone [css counters](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters)

  `content: counter(step);`

- [ ] unable to clone [-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)

  `body::-webkit-scrollbar-thumb { background-color: red; }`
