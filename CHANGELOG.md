# 1.0.0 (2025-05-23)


### Bug Fixes

* `color` not taking effect in `font-family: unset` ([b3880c1](https://github.com/devxiyang/modern-screenshot/commit/b3880c1a5ecee0853e007a8a4cfce52cb7122b66))
* `cssRule.style.fontFamily` null safe (close [#14](https://github.com/devxiyang/modern-screenshot/issues/14)) ([b8ca4d4](https://github.com/devxiyang/modern-screenshot/commit/b8ca4d491c3ca9e830476e903b4e86a674e8153b))
* `font-family` will be filtered when using multiple fonts ([2339842](https://github.com/devxiyang/modern-screenshot/commit/233984225d0d2d2d91f6b60e447062f29f86dfcf)), closes [#8](https://github.com/devxiyang/modern-screenshot/issues/8)
* `getDefaultStyle` nodeName not being converted to lower case ([c3d5c92](https://github.com/devxiyang/modern-screenshot/commit/c3d5c920234db98d70cf9d6aac844f23db462794))
* 🐛 fix svg use element color error ([eb405e1](https://github.com/devxiyang/modern-screenshot/commit/eb405e1c2519bdfb86221be615bd075126d955fe))
* a typographic anomaly caused by getComputedStyle getting px values only to 4-bit precision (close [#104](https://github.com/devxiyang/modern-screenshot/issues/104)) ([ed8d711](https://github.com/devxiyang/modern-screenshot/commit/ed8d711b08432fd0fef2f87f4ca55dff9f298bfe))
* abnormal attribute regex ([#42](https://github.com/devxiyang/modern-screenshot/issues/42)) ([9a9b2eb](https://github.com/devxiyang/modern-screenshot/commit/9a9b2eb83177e8e1daaf77a3c81ac53d3a5ea782))
* ascii null character regex ([83aee39](https://github.com/devxiyang/modern-screenshot/commit/83aee391d461627556b048ec0dd6195fc7593941))
* cache key ([2ccfaee](https://github.com/devxiyang/modern-screenshot/commit/2ccfaeee41f866e9b40de3b781ff14eae15c18d7))
* cache leak while obtaining request ([3c6b5b8](https://github.com/devxiyang/modern-screenshot/commit/3c6b5b8bb61bd01a74345457c4b966a42394f0f5))
* canvas2blob miss options ([5de37aa](https://github.com/devxiyang/modern-screenshot/commit/5de37aabd3f32636b1441c35d76538496849e6f0))
* chrome css fixes ([c9efff4](https://github.com/devxiyang/modern-screenshot/commit/c9efff48837a8ba63ba2caa52feba3b774d1117d))
* contextType ([bd1cb85](https://github.com/devxiyang/modern-screenshot/commit/bd1cb8563b4b25538ed00a5e9d5e31087f1683be))
* copy css styles (closes [#131](https://github.com/devxiyang/modern-screenshot/issues/131)) ([810cce6](https://github.com/devxiyang/modern-screenshot/commit/810cce6f5577c86a895cc804df705642c93e1270))
* copy input value in web-component(close [#22](https://github.com/devxiyang/modern-screenshot/issues/22)) ([5e4edce](https://github.com/devxiyang/modern-screenshot/commit/5e4edce18ce84bc34f098e5627fcf844c9850019))
* css url RegExp ([c52de3c](https://github.com/devxiyang/modern-screenshot/commit/c52de3cab1e1f56157adf6dbd9cb7766726db432))
* diff style logic(close [#17](https://github.com/devxiyang/modern-screenshot/issues/17)) ([4fc4174](https://github.com/devxiyang/modern-screenshot/commit/4fc4174820b00262c8c91f79eb34eadcfc558475))
* domToForeignObjectSvg does not support undefined option value ([f36da24](https://github.com/devxiyang/modern-screenshot/commit/f36da2473a52d0339aa40352461f4c746edf1853))
* embed empty style font ([78471c4](https://github.com/devxiyang/modern-screenshot/commit/78471c49182f1ddae1306fb601f9663a220b0d7e))
* embed web fonts ([de63cd1](https://github.com/devxiyang/modern-screenshot/commit/de63cd183a957632a0db8932606c2a391b635620))
* emoji ([#11](https://github.com/devxiyang/modern-screenshot/issues/11)) ([76cd0b7](https://github.com/devxiyang/modern-screenshot/commit/76cd0b7b6beba0215d60635b6a5f2b827a51b3df))
* exception border width ([71ec83d](https://github.com/devxiyang/modern-screenshot/commit/71ec83df204813d9ffdc826c73ca8c07fc7e5236))
* EXT_RE ([d07c18b](https://github.com/devxiyang/modern-screenshot/commit/d07c18b62efe95311d823f346c9d37d35673ce7b))
* fetch error does not trigger ([e3cf180](https://github.com/devxiyang/modern-screenshot/commit/e3cf1809ee31dac11f17c534d6fd555f82661b3f))
* fix warning `Timer '[modern-screenshot] canvas to blob' already exists` ([1b46b22](https://github.com/devxiyang/modern-screenshot/commit/1b46b227587caff3c048aa95b60e4491c9395270))
* font embedding in a single context exception ([30f03ee](https://github.com/devxiyang/modern-screenshot/commit/30f03eedd496f182457db9bafd2be769b4f79ce3))
* font-family is case insensitive ([#14](https://github.com/devxiyang/modern-screenshot/issues/14)) ([8aa3fac](https://github.com/devxiyang/modern-screenshot/commit/8aa3fac898b24a47b134972a00d76a5d37d88fe6))
* get diff style error (closes [#24](https://github.com/devxiyang/modern-screenshot/issues/24) [#25](https://github.com/devxiyang/modern-screenshot/issues/25)) ([69d11db](https://github.com/devxiyang/modern-screenshot/commit/69d11db73708445cdbf62489efe479f795b53cbc))
* get node default style ([07ea2dd](https://github.com/devxiyang/modern-screenshot/commit/07ea2dde3a5b40cdd202ee905f1d7b2ee4513e22))
* get user-set css styles(close [#66](https://github.com/devxiyang/modern-screenshot/issues/66)) ([7a99399](https://github.com/devxiyang/modern-screenshot/commit/7a9939966ddb13d527f4c2cac59cf96b7a710ae2))
* identify image MIME type error ([41aa601](https://github.com/devxiyang/modern-screenshot/commit/41aa60138044350fe268a90ad3d31b13bcb5db96))
* image not decode when drawImage svg+xml in safari/webkit ([f083ddb](https://github.com/devxiyang/modern-screenshot/commit/f083ddb49db4edfdf507ebef96c90f52752fafb5))
* judgment error in copyScrollbar (link [#120](https://github.com/devxiyang/modern-screenshot/issues/120)) ([028e994](https://github.com/devxiyang/modern-screenshot/commit/028e99458aa28df1fea55492e8d9d3835f628623))
* load media timeout ([ac71821](https://github.com/devxiyang/modern-screenshot/commit/ac71821a957f5f9f3fcaddcb3e7b8d702adc85ad))
* loadMedia ([12d1efd](https://github.com/devxiyang/modern-screenshot/commit/12d1efd6b8b4431701974c3642d1347c2046b846))
* log prefix (closes [#129](https://github.com/devxiyang/modern-screenshot/issues/129)) ([e8b2d3f](https://github.com/devxiyang/modern-screenshot/commit/e8b2d3f757874a052aac1961347662a10e007bbc))
* logic interruption caused by reading CSS rules ([#12](https://github.com/devxiyang/modern-screenshot/issues/12)) ([ecc09df](https://github.com/devxiyang/modern-screenshot/commit/ecc09dffbd7464df0779952df7e939479519ae8a))
* logic interruptions caused by video cors errors ([2bb1c3f](https://github.com/devxiyang/modern-screenshot/commit/2bb1c3fa6c7b389fe544090ade491f0b3ca78a01))
* miss request images count ([3118c7c](https://github.com/devxiyang/modern-screenshot/commit/3118c7ca9f07f6cb1ecfff0e929efeab6ad10da2))
* missing width and height attributes in SVG causing Firefox rendering exception ([#4](https://github.com/devxiyang/modern-screenshot/issues/4)) ([fa907a9](https://github.com/devxiyang/modern-screenshot/commit/fa907a9e9bfa15b009d624970704f6e89f4b8351))
* package types miss ([db03819](https://github.com/devxiyang/modern-screenshot/commit/db03819992f7e250a353db1378417b06847de857))
* package version ([a8431a4](https://github.com/devxiyang/modern-screenshot/commit/a8431a438340c6340b9be263b94be3d43444c064))
* remove debug code ([88232a2](https://github.com/devxiyang/modern-screenshot/commit/88232a27036c49cfdd9882695f77effa442065cc))
* reset sandbox ([340ee47](https://github.com/devxiyang/modern-screenshot/commit/340ee47048f268fd6a30ea66593c69ea268ec386))
* resolve bounding box ([436b49b](https://github.com/devxiyang/modern-screenshot/commit/436b49bc6f00be83f5d33f250f2fee78a81336a5))
* revert to before fix 4-bit precision ([afeb6f6](https://github.com/devxiyang/modern-screenshot/commit/afeb6f6d8c131d23a840c87a3371941b870f64da))
* root box-sizing ([f2c66ce](https://github.com/devxiyang/modern-screenshot/commit/f2c66ced9c645832c5d22e720886de5c98ea5e60))
* safari not use web worker fetch resource(exists blob:null error) ([0b4ec02](https://github.com/devxiyang/modern-screenshot/commit/0b4ec0244fa3e89a8174140d52dd805d1a85d82e))
* sandbox creation ([1ef08ea](https://github.com/devxiyang/modern-screenshot/commit/1ef08ea5a31e5aba9594a6c13a08b8974501639f))
* sandbox id ([5796733](https://github.com/devxiyang/modern-screenshot/commit/5796733d6d71a77da4101ba0eaee6662ea27af0e))
* skip root margin ([a567b62](https://github.com/devxiyang/modern-screenshot/commit/a567b625537db9c8ac035dcf2ec54613e6dc1236))
* some text parsing exceptions caused by comment node ([c2e7df8](https://github.com/devxiyang/modern-screenshot/commit/c2e7df87bf1ebb14fe031bfadcbc9e8a66093c96))
* split font-family for Firefox ([#29](https://github.com/devxiyang/modern-screenshot/issues/29)) ([a1d1bbc](https://github.com/devxiyang/modern-screenshot/commit/a1d1bbc40393b96fd066f766991272f872150fcc))
* svg style clone ([ad08a5c](https://github.com/devxiyang/modern-screenshot/commit/ad08a5c002eb803f58f0aff8de38f5d048d16519))
* svg+xml image decoding in Safari and Firefox (close [#15](https://github.com/devxiyang/modern-screenshot/issues/15)) ([86085a3](https://github.com/devxiyang/modern-screenshot/commit/86085a3e5bf29afceb1f49d5c5bfeedf4f80cc62))
* testcase ([a60532f](https://github.com/devxiyang/modern-screenshot/commit/a60532f68f1694a77ab80a9b3013e0048ea0dfb8))
* textarea content rendered twice (closes [#50](https://github.com/devxiyang/modern-screenshot/issues/50)) ([30ae39d](https://github.com/devxiyang/modern-screenshot/commit/30ae39d6aaf8ac0f211a99eda6814d9efe406739))
* transition-property ([5a21371](https://github.com/devxiyang/modern-screenshot/commit/5a21371fe9550f64ab7452e891f3519575017bab))
* typo ([d238dca](https://github.com/devxiyang/modern-screenshot/commit/d238dcade7d5411180ca5883760558f25c8af38b))
* video clone ([#10](https://github.com/devxiyang/modern-screenshot/issues/10)) ([3c473d5](https://github.com/devxiyang/modern-screenshot/commit/3c473d5283aefa19cb30ff8cc05e71fb6ef89f35))
* web worker only http request ([77714aa](https://github.com/devxiyang/modern-screenshot/commit/77714aaa3817eb7a3a7d321491dfa9a1242e2a4d))
* when bgImage eq to none, still drawImageCount ([ae67b4d](https://github.com/devxiyang/modern-screenshot/commit/ae67b4d7a8ee297c225c1ea847b97b722d8218e5))
* worker export in the package.json ([c8c3fca](https://github.com/devxiyang/modern-screenshot/commit/c8c3fcaec0c50d589e0eafaa8f4f40867f3bff5e))
* worker export in the package.json ([d163943](https://github.com/devxiyang/modern-screenshot/commit/d163943763969d6bf1d2846f76edf7fff88cb8dc))
* xml legal characters regex ([#12](https://github.com/devxiyang/modern-screenshot/issues/12)) ([e6f1e0b](https://github.com/devxiyang/modern-screenshot/commit/e6f1e0bb15cc42fa592353baf95e47fa9847e88e))
* xml parsing exception caused by ascii control character ([a48cb89](https://github.com/devxiyang/modern-screenshot/commit/a48cb8977dd951e672ff3b6f6e6de1719b72343a))
* 修复onCloneNode没有等待用户处理结束导致在回调中处理样式无效 ([868758a](https://github.com/devxiyang/modern-screenshot/commit/868758a9f71b84ec6ffa52fd3f346f53abc46555))


### Features

* `clone-svg` rename to `embed-svg-use` ([67589ab](https://github.com/devxiyang/modern-screenshot/commit/67589ab9fee60445089e5c5d094b54bc9dd86cad))
* add `includeStyleProperties` option ([6f24f17](https://github.com/devxiyang/modern-screenshot/commit/6f24f17c023cdecbb414fba1f56b890874190595))
* add converts ([d632f9d](https://github.com/devxiyang/modern-screenshot/commit/d632f9dbafa8afb58613b5d8a8fb8bcbc70539ea))
* add embed web fonts progress ([5420411](https://github.com/devxiyang/modern-screenshot/commit/5420411fc9249b9117e1408ff88dea630c93ad6e))
* add hook options ([fa68c21](https://github.com/devxiyang/modern-screenshot/commit/fa68c2126b50d761805be45035aff30cbe306df3))
* add log option ([ad7b698](https://github.com/devxiyang/modern-screenshot/commit/ad7b698fc29d96fd944d46afcb3ffc0c10497c75))
* add scale option ([1f75c01](https://github.com/devxiyang/modern-screenshot/commit/1f75c012b042a3066a8f61cd16d5785c8ba95a83))
* catch errors as warnings ([de1a1bc](https://github.com/devxiyang/modern-screenshot/commit/de1a1bc5957a9e685e7594f894cc06477c900630))
* change `timeout` option default value to 30s ([339713d](https://github.com/devxiyang/modern-screenshot/commit/339713d1b60517653728099772299e1b8a623be4))
* change convert options and upgrade dev dep ([16128d5](https://github.com/devxiyang/modern-screenshot/commit/16128d5e057acfac00db55fab50dfb361d96064a))
* change domToSvg return value to promise<string> ([0ad1551](https://github.com/devxiyang/modern-screenshot/commit/0ad1551b37671bd88c347ec08a1a9889c0308754))
* change the default 'requestInit.cache' value to 'force-cache' ([7d1ac91](https://github.com/devxiyang/modern-screenshot/commit/7d1ac91660b92c60b98e48349c424df3d2e203f8))
* change worker build target to es2015 ([e72e2e1](https://github.com/devxiyang/modern-screenshot/commit/e72e2e1aa20f79dc1d58b0cc6add5ff51807da10))
* clean "margin" of root node ([fdb83ce](https://github.com/devxiyang/modern-screenshot/commit/fdb83ce559059032ef1fd4e274ce3173f5c13f5b))
* convert node before wait loaded ([6dd55e8](https://github.com/devxiyang/modern-screenshot/commit/6dd55e88d403d7e7d2b7f786812a87c205ee3a29))
* DPI (png、jpeg) can be set by `scale` when `domToBlob` or `domToDataUrl` ([89e94bf](https://github.com/devxiyang/modern-screenshot/commit/89e94bfa4c444fe3cb421238e938d35039790a61))
* embed style font ([a01921b](https://github.com/devxiyang/modern-screenshot/commit/a01921b7f6f0726d5c6832c4b386714b72b7af4d))
* embed web font as needed ([6d5ffd2](https://github.com/devxiyang/modern-screenshot/commit/6d5ffd26af7b7dd597b4e9f673801b8e36fb33e3))
* export `waitUntilLoad` util method ([d7f1752](https://github.com/devxiyang/modern-screenshot/commit/d7f1752fa1abdc2c60e0e3e0aee40345f5a21bd9))
* export loadMedia util method ([8182f34](https://github.com/devxiyang/modern-screenshot/commit/8182f34e7ae4b4d38d9f4aee958906c1215f7b4b))
* exports `createContext` and `destroyContext` ([e245ee2](https://github.com/devxiyang/modern-screenshot/commit/e245ee2fea57ff481f8d276e7f865134b4af9d11))
* fetch timeout ([3c55721](https://github.com/devxiyang/modern-screenshot/commit/3c5572132f87a744ac3e412262b71575300127bc))
* hooks are supported to return promises ([67d75b2](https://github.com/devxiyang/modern-screenshot/commit/67d75b2e30f481741326c7f5e83d5835b160b525))
* limit the number of concurrent tasks ([1fc4d27](https://github.com/devxiyang/modern-screenshot/commit/1fc4d27d51515e8889c97e6445e2a186c0b70f3b))
* more exports ([2832295](https://github.com/devxiyang/modern-screenshot/commit/28322952b71964638f8c7872b9dcdc0df7a7f63f))
* optimize "background-clip--text" style ([6b81005](https://github.com/devxiyang/modern-screenshot/commit/6b81005ae0ce9b8af4dc6c3d45fdc8d2e78d4874))
* release the context memory usage ([a0b6301](https://github.com/devxiyang/modern-screenshot/commit/a0b630139e1c7feaa6ac7e80b593eb181d22756f))
* rename all export methods ([73b354f](https://github.com/devxiyang/modern-screenshot/commit/73b354fbfb4e1132a02a260ece531b0dbdcc1237))
* rename package ([6fbb922](https://github.com/devxiyang/modern-screenshot/commit/6fbb922c6b41042b5b30de09d847277b460415cb))
* rename umd export ([8569f55](https://github.com/devxiyang/modern-screenshot/commit/8569f55bc247249d3777f993313e007c15a640e7))
* replace HTMLElement to Node ([fec1e29](https://github.com/devxiyang/modern-screenshot/commit/fec1e295382989f5984dc980db6d99079afebfc4))
* replace SVGSVGElement to SVGElement ([7b68b26](https://github.com/devxiyang/modern-screenshot/commit/7b68b26c2d3be02df88604dbf279bac2558dbd65))
* support `css.-webkit-scrollbar` (close [#19](https://github.com/devxiyang/modern-screenshot/issues/19)) ([0a3bfe3](https://github.com/devxiyang/modern-screenshot/commit/0a3bfe3ba4bd780511923805f783934a673f96e7))
* support browser console use ([569f599](https://github.com/devxiyang/modern-screenshot/commit/569f5996136b9ead1672f8b3663965bd31f7be4f))
* support css `-webkit-mask-image` ([c46bf7f](https://github.com/devxiyang/modern-screenshot/commit/c46bf7f93f658d5ac1b00c1e1fcfd8e33bc71d08))
* support currentColor in svg.symbol ([322b223](https://github.com/devxiyang/modern-screenshot/commit/322b223a1e09d0b6e8c22b7f62d59d18a0a3dfdf))
* support font minify using external lib ([f702db8](https://github.com/devxiyang/modern-screenshot/commit/f702db81dd85ed95422d20e8fafe7964ec0e769f))
* support iframe ([f37a8f5](https://github.com/devxiyang/modern-screenshot/commit/f37a8f5dc88dfd71ba1db1639bd0942d94bd3e60))
* support progress option ([96c4ac5](https://github.com/devxiyang/modern-screenshot/commit/96c4ac5d110790400ebd7b6a2c35170ce667fa65))
* support svg <use> href ([81a78ce](https://github.com/devxiyang/modern-screenshot/commit/81a78ce10037c91bd54dd443e3244c2463fb9dce))
* support Web Worker and `placeholderImage` as a callback ([#5](https://github.com/devxiyang/modern-screenshot/issues/5)) ([f22b0bc](https://github.com/devxiyang/modern-screenshot/commit/f22b0bcf75d660637617af151ac95200773c0282))
* support webp and use image.decode load media ([7650bfa](https://github.com/devxiyang/modern-screenshot/commit/7650bfa581b68b3e59c154b78937ecc3f145b4ba))
* supports -webkit-background-clip ([859f986](https://github.com/devxiyang/modern-screenshot/commit/859f9863314d1e34d3863a037f21c77aa8e338be))
* supports `fetch.bypassingCache` option value is `RegExp` (closes [#38](https://github.com/devxiyang/modern-screenshot/issues/38)) ([936581c](https://github.com/devxiyang/modern-screenshot/commit/936581ce934cb189cb1062dc5235e8d056652e29))
* supports background-image prop ([2180c4e](https://github.com/devxiyang/modern-screenshot/commit/2180c4e807d88fc3dd20dbf914d68034a55bb125))
* supports custom global window ([5c2d0a5](https://github.com/devxiyang/modern-screenshot/commit/5c2d0a536cce297d62fca685523e54b2960b302e))
* supports drawImageInterval option ([086c7a4](https://github.com/devxiyang/modern-screenshot/commit/086c7a46385cab68173f74e5473fc9ad1457ed6c))
* supports enable part features, fix more abnormal attributes ([#35](https://github.com/devxiyang/modern-screenshot/issues/35) [#36](https://github.com/devxiyang/modern-screenshot/issues/36)) ([c707dc2](https://github.com/devxiyang/modern-screenshot/commit/c707dc2e7fdefc26b1f2c7756ea559d5ee4b66cd))
* try fix svg+xml decode ([#34](https://github.com/devxiyang/modern-screenshot/issues/34)) ([cada074](https://github.com/devxiyang/modern-screenshot/commit/cada0740e883601e84d1e049dd10681997a994ce))
* update build target to es2015 ([fbdb3ae](https://github.com/devxiyang/modern-screenshot/commit/fbdb3ae89f51008f2784d9a38b526d4c74a03bbb))
* warnings are printed only when debug is enabled (close [#106](https://github.com/devxiyang/modern-screenshot/issues/106)) ([b50711a](https://github.com/devxiyang/modern-screenshot/commit/b50711a2d7f9bbe7d1baec19d6a78f2b727be8e4))


### Performance Improvements

* performance optimization ([aede0a7](https://github.com/devxiyang/modern-screenshot/commit/aede0a768d3adc6b4dd6cf5da6d707c227725687))



# [4.6.0](https://github.com/qq15725/modern-screenshot/compare/v4.5.5...v4.6.0) (2025-02-13)


### Bug Fixes

* copy css styles (closes [#131](https://github.com/qq15725/modern-screenshot/issues/131)) ([810cce6](https://github.com/qq15725/modern-screenshot/commit/810cce6f5577c86a895cc804df705642c93e1270))
* log prefix (closes [#129](https://github.com/qq15725/modern-screenshot/issues/129)) ([e8b2d3f](https://github.com/qq15725/modern-screenshot/commit/e8b2d3f757874a052aac1961347662a10e007bbc))
* textarea content rendered twice (closes [#50](https://github.com/qq15725/modern-screenshot/issues/50)) ([30ae39d](https://github.com/qq15725/modern-screenshot/commit/30ae39d6aaf8ac0f211a99eda6814d9efe406739))



## [4.5.5](https://github.com/qq15725/modern-screenshot/compare/v4.5.4...v4.5.5) (2024-12-01)


### Bug Fixes

* judgment error in copyScrollbar (link [#120](https://github.com/qq15725/modern-screenshot/issues/120)) ([028e994](https://github.com/qq15725/modern-screenshot/commit/028e99458aa28df1fea55492e8d9d3835f628623))



## [4.5.4](https://github.com/qq15725/modern-screenshot/compare/v4.5.3...v4.5.4) (2024-11-12)


### Bug Fixes

* worker export in the package.json ([c8c3fca](https://github.com/qq15725/modern-screenshot/commit/c8c3fcaec0c50d589e0eafaa8f4f40867f3bff5e))



## [4.5.3](https://github.com/qq15725/modern-screenshot/compare/v4.5.2...v4.5.3) (2024-11-12)


### Bug Fixes

* worker export in the package.json ([d163943](https://github.com/qq15725/modern-screenshot/commit/d163943763969d6bf1d2846f76edf7fff88cb8dc))



## [4.5.2](https://github.com/qq15725/modern-screenshot/compare/v4.5.1...v4.5.2) (2024-11-09)


### Bug Fixes

* revert to before fix 4-bit precision ([afeb6f6](https://github.com/qq15725/modern-screenshot/commit/afeb6f6d8c131d23a840c87a3371941b870f64da))



## [4.5.1](https://github.com/qq15725/modern-screenshot/compare/v4.5.0...v4.5.1) (2024-11-06)


### Bug Fixes

* a typographic anomaly caused by getComputedStyle getting px values only to 4-bit precision (close [#104](https://github.com/qq15725/modern-screenshot/issues/104)) ([ed8d711](https://github.com/qq15725/modern-screenshot/commit/ed8d711b08432fd0fef2f87f4ca55dff9f298bfe))



# [4.5.0](https://github.com/qq15725/modern-screenshot/compare/v4.4.39...v4.5.0) (2024-11-06)


### Bug Fixes

* 修复onCloneNode没有等待用户处理结束导致在回调中处理样式无效 ([868758a](https://github.com/qq15725/modern-screenshot/commit/868758a9f71b84ec6ffa52fd3f346f53abc46555))


### Features

* hooks are supported to return promises ([67d75b2](https://github.com/qq15725/modern-screenshot/commit/67d75b2e30f481741326c7f5e83d5835b160b525))
* support font minify using external lib ([f702db8](https://github.com/qq15725/modern-screenshot/commit/f702db81dd85ed95422d20e8fafe7964ec0e769f))
* warnings are printed only when debug is enabled (close [#106](https://github.com/qq15725/modern-screenshot/issues/106)) ([b50711a](https://github.com/qq15725/modern-screenshot/commit/b50711a2d7f9bbe7d1baec19d6a78f2b727be8e4))



## [4.4.39](https://github.com/qq15725/modern-screenshot/compare/v4.4.38...v4.4.39) (2024-04-10)


### Bug Fixes

* typo ([d238dca](https://github.com/qq15725/modern-screenshot/commit/d238dcade7d5411180ca5883760558f25c8af38b))



## [4.4.38](https://github.com/qq15725/modern-screenshot/compare/v4.4.37...v4.4.38) (2024-02-04)


### Bug Fixes

* 🐛 fix svg use element color error ([eb405e1](https://github.com/qq15725/modern-screenshot/commit/eb405e1c2519bdfb86221be615bd075126d955fe))



## [4.4.37](https://github.com/qq15725/modern-screenshot/compare/v4.4.36...v4.4.37) (2023-12-18)


### Bug Fixes

* get user-set css styles(close [#66](https://github.com/qq15725/modern-screenshot/issues/66)) ([7a99399](https://github.com/qq15725/modern-screenshot/commit/7a9939966ddb13d527f4c2cac59cf96b7a710ae2))



## [4.4.36](https://github.com/qq15725/modern-screenshot/compare/v4.4.35...v4.4.36) (2023-12-05)


### Features

* add `includeStyleProperties` option ([6f24f17](https://github.com/qq15725/modern-screenshot/commit/6f24f17c023cdecbb414fba1f56b890874190595))



## [4.4.35](https://github.com/qq15725/modern-screenshot/compare/v4.4.34...v4.4.35) (2023-12-05)



## [4.4.34](https://github.com/qq15725/modern-screenshot/compare/v4.4.33...v4.4.34) (2023-11-16)


### Bug Fixes

* `color` not taking effect in `font-family: unset` ([b3880c1](https://github.com/qq15725/modern-screenshot/commit/b3880c1a5ecee0853e007a8a4cfce52cb7122b66))



## [4.4.33](https://github.com/qq15725/modern-screenshot/compare/v4.4.32...v4.4.33) (2023-10-25)


### Bug Fixes

* when bgImage eq to none, still drawImageCount ([ae67b4d](https://github.com/qq15725/modern-screenshot/commit/ae67b4d7a8ee297c225c1ea847b97b722d8218e5))



## [4.4.32](https://github.com/qq15725/modern-screenshot/compare/v4.4.31...v4.4.32) (2023-10-04)


### Bug Fixes

* fix warning `Timer '[modern-screenshot] canvas to blob' already exists` ([1b46b22](https://github.com/qq15725/modern-screenshot/commit/1b46b227587caff3c048aa95b60e4491c9395270))



## [4.4.31](https://github.com/qq15725/modern-screenshot/compare/v4.4.30...v4.4.31) (2023-09-10)


### Features

* `clone-svg` rename to `embed-svg-use` ([67589ab](https://github.com/qq15725/modern-screenshot/commit/67589ab9fee60445089e5c5d094b54bc9dd86cad))
* supports `fetch.bypassingCache` option value is `RegExp` (closes [#38](https://github.com/qq15725/modern-screenshot/issues/38)) ([936581c](https://github.com/qq15725/modern-screenshot/commit/936581ce934cb189cb1062dc5235e8d056652e29))



## [4.4.30](https://github.com/qq15725/modern-screenshot/compare/v4.4.29...v4.4.30) (2023-08-29)



## [4.4.29](https://github.com/qq15725/modern-screenshot/compare/v4.4.28...v4.4.29) (2023-08-25)


### Bug Fixes

* abnormal attribute regex ([#42](https://github.com/qq15725/modern-screenshot/issues/42)) ([9a9b2eb](https://github.com/qq15725/modern-screenshot/commit/9a9b2eb83177e8e1daaf77a3c81ac53d3a5ea782))



## [4.4.28](https://github.com/qq15725/modern-screenshot/compare/v4.4.27...v4.4.28) (2023-07-31)


### Features

* try fix svg+xml decode ([#34](https://github.com/qq15725/modern-screenshot/issues/34)) ([cada074](https://github.com/qq15725/modern-screenshot/commit/cada0740e883601e84d1e049dd10681997a994ce))



## [4.4.27](https://github.com/qq15725/modern-screenshot/compare/v4.4.26...v4.4.27) (2023-07-31)


### Features

* supports enable part features, fix more abnormal attributes ([#35](https://github.com/qq15725/modern-screenshot/issues/35) [#36](https://github.com/qq15725/modern-screenshot/issues/36)) ([c707dc2](https://github.com/qq15725/modern-screenshot/commit/c707dc2e7fdefc26b1f2c7756ea559d5ee4b66cd))



## [4.4.26](https://github.com/qq15725/modern-screenshot/compare/v4.4.25...v4.4.26) (2023-06-03)


### Bug Fixes

* split font-family for Firefox ([#29](https://github.com/qq15725/modern-screenshot/issues/29)) ([a1d1bbc](https://github.com/qq15725/modern-screenshot/commit/a1d1bbc40393b96fd066f766991272f872150fcc))



## [4.4.25](https://github.com/qq15725/modern-screenshot/compare/v4.4.24...v4.4.25) (2023-05-25)


### Bug Fixes

* transition-property ([5a21371](https://github.com/qq15725/modern-screenshot/commit/5a21371fe9550f64ab7452e891f3519575017bab))


### Features

* change worker build target to es2015 ([e72e2e1](https://github.com/qq15725/modern-screenshot/commit/e72e2e1aa20f79dc1d58b0cc6add5ff51807da10))



## [4.4.24](https://github.com/qq15725/modern-screenshot/compare/v4.4.23...v4.4.24) (2023-05-14)


### Bug Fixes

* get diff style error (closes [#24](https://github.com/qq15725/modern-screenshot/issues/24) [#25](https://github.com/qq15725/modern-screenshot/issues/25)) ([69d11db](https://github.com/qq15725/modern-screenshot/commit/69d11db73708445cdbf62489efe479f795b53cbc))



## [4.4.23](https://github.com/qq15725/modern-screenshot/compare/v4.4.22...v4.4.23) (2023-05-12)


### Performance Improvements

* performance optimization ([aede0a7](https://github.com/qq15725/modern-screenshot/commit/aede0a768d3adc6b4dd6cf5da6d707c227725687))



## [4.4.22](https://github.com/qq15725/modern-screenshot/compare/v4.4.21...v4.4.22) (2023-05-08)


### Bug Fixes

* root box-sizing ([f2c66ce](https://github.com/qq15725/modern-screenshot/commit/f2c66ced9c645832c5d22e720886de5c98ea5e60))



## [4.4.21](https://github.com/qq15725/modern-screenshot/compare/v4.4.20...v4.4.21) (2023-05-08)


### Bug Fixes

* skip root margin ([a567b62](https://github.com/qq15725/modern-screenshot/commit/a567b625537db9c8ac035dcf2ec54613e6dc1236))



## [4.4.20](https://github.com/qq15725/modern-screenshot/compare/v4.4.19...v4.4.20) (2023-05-05)


### Bug Fixes

* safari not use web worker fetch resource(exists blob:null error) ([0b4ec02](https://github.com/qq15725/modern-screenshot/commit/0b4ec0244fa3e89a8174140d52dd805d1a85d82e))



## [4.4.19](https://github.com/qq15725/modern-screenshot/compare/v4.4.18...v4.4.19) (2023-04-26)


### Features

* support svg <use> href ([81a78ce](https://github.com/qq15725/modern-screenshot/commit/81a78ce10037c91bd54dd443e3244c2463fb9dce))



## [4.4.18](https://github.com/qq15725/modern-screenshot/compare/v4.4.17...v4.4.18) (2023-04-26)


### Features

* support currentColor in svg.symbol ([322b223](https://github.com/qq15725/modern-screenshot/commit/322b223a1e09d0b6e8c22b7f62d59d18a0a3dfdf))



## [4.4.17](https://github.com/qq15725/modern-screenshot/compare/v4.4.16...v4.4.17) (2023-04-26)


### Bug Fixes

* diff style logic(close [#17](https://github.com/qq15725/modern-screenshot/issues/17)) ([4fc4174](https://github.com/qq15725/modern-screenshot/commit/4fc4174820b00262c8c91f79eb34eadcfc558475))



## [4.4.16](https://github.com/qq15725/modern-screenshot/compare/v4.4.15...v4.4.16) (2023-04-26)


### Bug Fixes

* copy input value in web-component(close [#22](https://github.com/qq15725/modern-screenshot/issues/22)) ([5e4edce](https://github.com/qq15725/modern-screenshot/commit/5e4edce18ce84bc34f098e5627fcf844c9850019))



## [4.4.15](https://github.com/qq15725/modern-screenshot/compare/v4.4.14...v4.4.15) (2023-04-15)


### Bug Fixes

* `getDefaultStyle` nodeName not being converted to lower case ([c3d5c92](https://github.com/qq15725/modern-screenshot/commit/c3d5c920234db98d70cf9d6aac844f23db462794))



## [4.4.14](https://github.com/qq15725/modern-screenshot/compare/v4.4.13...v4.4.14) (2023-04-14)



## [4.4.13](https://github.com/qq15725/modern-screenshot/compare/v4.4.12...v4.4.13) (2023-04-14)



## [4.4.12](https://github.com/qq15725/modern-screenshot/compare/v4.4.11...v4.4.12) (2023-04-14)



## [4.4.11](https://github.com/qq15725/modern-screenshot/compare/v4.4.10...v4.4.11) (2023-04-14)


### Features

* support `css.-webkit-scrollbar` (close [#19](https://github.com/qq15725/modern-screenshot/issues/19)) ([0a3bfe3](https://github.com/qq15725/modern-screenshot/commit/0a3bfe3ba4bd780511923805f783934a673f96e7))



## [4.4.10](https://github.com/qq15725/modern-screenshot/compare/v4.4.9...v4.4.10) (2023-04-14)


### Bug Fixes

* web worker only http request ([77714aa](https://github.com/qq15725/modern-screenshot/commit/77714aaa3817eb7a3a7d321491dfa9a1242e2a4d))



## [4.4.9](https://github.com/qq15725/modern-screenshot/compare/v4.4.8...v4.4.9) (2023-03-21)


### Bug Fixes

* svg+xml image decoding in Safari and Firefox (close [#15](https://github.com/qq15725/modern-screenshot/issues/15)) ([86085a3](https://github.com/qq15725/modern-screenshot/commit/86085a3e5bf29afceb1f49d5c5bfeedf4f80cc62))



## [4.4.8](https://github.com/qq15725/modern-screenshot/compare/v4.4.7...v4.4.8) (2023-03-18)


### Bug Fixes

* font-family is case insensitive ([#14](https://github.com/qq15725/modern-screenshot/issues/14)) ([8aa3fac](https://github.com/qq15725/modern-screenshot/commit/8aa3fac898b24a47b134972a00d76a5d37d88fe6))



## [4.4.7](https://github.com/qq15725/modern-screenshot/compare/v4.4.6...v4.4.7) (2023-03-18)


### Bug Fixes

* `cssRule.style.fontFamily` null safe (close [#14](https://github.com/qq15725/modern-screenshot/issues/14)) ([b8ca4d4](https://github.com/qq15725/modern-screenshot/commit/b8ca4d491c3ca9e830476e903b4e86a674e8153b))



## [4.4.6](https://github.com/qq15725/modern-screenshot/compare/v4.4.5...v4.4.6) (2023-03-15)


### Bug Fixes

* logic interruption caused by reading CSS rules ([#12](https://github.com/qq15725/modern-screenshot/issues/12)) ([ecc09df](https://github.com/qq15725/modern-screenshot/commit/ecc09dffbd7464df0779952df7e939479519ae8a))



## [4.4.5](https://github.com/qq15725/modern-screenshot/compare/v4.4.4...v4.4.5) (2023-03-14)


### Bug Fixes

* xml legal characters regex ([#12](https://github.com/qq15725/modern-screenshot/issues/12)) ([e6f1e0b](https://github.com/qq15725/modern-screenshot/commit/e6f1e0bb15cc42fa592353baf95e47fa9847e88e))



## [4.4.4](https://github.com/qq15725/modern-screenshot/compare/v4.4.3...v4.4.4) (2023-03-12)


### Bug Fixes

* emoji ([#11](https://github.com/qq15725/modern-screenshot/issues/11)) ([76cd0b7](https://github.com/qq15725/modern-screenshot/commit/76cd0b7b6beba0215d60635b6a5f2b827a51b3df))



## [4.4.3](https://github.com/qq15725/modern-screenshot/compare/v4.4.2...v4.4.3) (2023-03-06)


### Bug Fixes

* ascii null character regex ([83aee39](https://github.com/qq15725/modern-screenshot/commit/83aee391d461627556b048ec0dd6195fc7593941))



## [4.4.2](https://github.com/qq15725/modern-screenshot/compare/v4.4.1...v4.4.2) (2023-03-05)


### Bug Fixes

* some text parsing exceptions caused by comment node ([c2e7df8](https://github.com/qq15725/modern-screenshot/commit/c2e7df87bf1ebb14fe031bfadcbc9e8a66093c96))
* xml parsing exception caused by ascii control character ([a48cb89](https://github.com/qq15725/modern-screenshot/commit/a48cb8977dd951e672ff3b6f6e6de1719b72343a))



## [4.4.1](https://github.com/qq15725/modern-screenshot/compare/v4.4.0...v4.4.1) (2023-02-22)


### Bug Fixes

* logic interruptions caused by video cors errors ([2bb1c3f](https://github.com/qq15725/modern-screenshot/commit/2bb1c3fa6c7b389fe544090ade491f0b3ca78a01))
* remove debug code ([88232a2](https://github.com/qq15725/modern-screenshot/commit/88232a27036c49cfdd9882695f77effa442065cc))
* video clone ([#10](https://github.com/qq15725/modern-screenshot/issues/10)) ([3c473d5](https://github.com/qq15725/modern-screenshot/commit/3c473d5283aefa19cb30ff8cc05e71fb6ef89f35))



# [4.4.0](https://github.com/qq15725/modern-screenshot/compare/v4.3.6...v4.4.0) (2023-02-21)


### Bug Fixes

* fetch error does not trigger ([e3cf180](https://github.com/qq15725/modern-screenshot/commit/e3cf1809ee31dac11f17c534d6fd555f82661b3f))


### Features

* DPI (png、jpeg) can be set by `scale` when `domToBlob` or `domToDataUrl` ([89e94bf](https://github.com/qq15725/modern-screenshot/commit/89e94bfa4c444fe3cb421238e938d35039790a61))



## [4.3.6](https://github.com/qq15725/modern-screenshot/compare/v4.3.5...v4.3.6) (2023-02-20)


### Features

* Support Web Worker ([#5](https://github.com/qq15725/modern-screenshot/issues/5)) ([f22b0bc](https://github.com/qq15725/modern-screenshot/commit/f22b0bcf75d660637617af151ac95200773c0282))



