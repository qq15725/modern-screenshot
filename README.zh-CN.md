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

<p align="center">使用 HTML5 canvas 和 SVG 从 DOM 节点生成图像</p>

<p align="center">Fork from <a href="https://github.com/bubkoo/html-to-image">html-to-image</a></p>

<p align="center"><a href="README.md">English</a> | 简体中文</p>

## 📦 安装

```sh
npm i modern-screenshot
```

## 🦄 使用

### 基本用法

```ts
import { domToPng } from 'modern-screenshot'

domToPng(document.querySelector('#app')).then(dataURL => {
  open().document.write(`<img src="${ dataURL }" />`)
})
```

### CDN

```html
<script src="https://unpkg.com/modern-screenshot"></script>
<script>
  modernScreenshot.domToPng(document.querySelector('body')).then(dataURL => {
    open().document.write(`<img src="${ dataURL }" />`)
  })
</script>
```

### 浏览器控制台

> ⚠️ 由于 CORS 部分嵌入将失败

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

## 方法

> 比如 `domToPng(node, options)`

DOM 转 dataURL

- [domToPng](src/converts/dom-to-png.ts)
- [domToSvg](src/converts/dom-to-svg.ts)
- [domToJpeg](src/converts/dom-to-jpeg.ts)
- [domToWebp](src/converts/dom-to-webp.ts)
- [domToDataUrl](src/converts/dom-to-data-url.ts)

DOM 转 data

- [domToBlob](src/converts/dom-to-blob.ts)
- [domToPixel](src/converts/dom-to-pixel.ts)

DOM 转 HTMLElement

- [domToForeignObjectSvg](src/converts/dom-to-foreign-object-svg.ts)
- [domToImage](src/converts/dom-to-image.ts)
- [domToCanvas](src/converts/dom-to-canvas.ts)

## 选项

请查看 [options.ts](src/options.ts)

## 待办事项

- [ ] 无法克隆关闭的 [shadowDom](https://developer.mozilla.org/en-US/docs/Web/Web_Components/Using_shadow_DOM)

  `input::placeholder { color: red; }`

- [ ] 无法克隆 [css 计数器](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Counter_Styles/Using_CSS_counters)

  `content: counter(step);`

- [ ] 无法克隆 [-webkit-scrollbar](https://developer.mozilla.org/en-US/docs/Web/CSS/::-webkit-scrollbar)

  `body::-webkit-scrollbar-thumb { background-color: red; }`

## 其他有趣的包

| 名字       | 描述                     |
|----------|------------------------|
| [dom-vcr] | 从 DOM 节点生成 `MP4` 或 `GIF` |

[dom-vcr]: https://github.com/qq15725/dom-vcr
