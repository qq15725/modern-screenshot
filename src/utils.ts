export function loadImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    var image = new Image()
    image.onload = () => resolve(image)
    image.onerror = reject
    image.src = url
  })
}

export function escapeXhtml(string: string) {
  return string
    .replace(/#/g, '%23')
    .replace(/\n/g, '%0A')
}

export function escape(string: string) {
  return string.replace(/([.*+?^${}()|\[\]\/\\])/g, '\\$1')
}

let index = 0
export function getUid() {
  return `u${
    // http://stackoverflow.com/a/6248722/2519373
    ('0000' + (Math.random() * Math.pow(36, 4) << 0).toString(36)).slice(-4)
  }${ index++ }`
}

const MIMES = {
  'woff': 'application/font-woff',
  'woff2': 'application/font-woff',
  'ttf': 'application/font-truetype',
  'eot': 'application/vnd.ms-fontobject',
  'png': 'image/png',
  'jpg': 'image/jpeg',
  'jpeg': 'image/jpeg',
  'gif': 'image/gif',
  'tiff': 'image/tiff',
  'svg': 'image/svg+xml',
} as const

const EXT_RE = /\.([^.\/]+?)$/

export async function loadUrlToDataURL(url: string) {
  const ext = url.match(EXT_RE)?.[1]?.toLowerCase()
  const mime = MIMES[ext as keyof typeof MIMES] ?? ext
  return `data:${ mime };base64,${ await loadDataToBase64(url) }`
}

export function loadDataToBase64(url: string): Promise<string> {
  const TIMEOUT = 30000
  return new Promise(resolve => {
    const request = new XMLHttpRequest()
    request.onreadystatechange = () => {
      if (request.readyState !== 4) return
      if (request.status !== 200) return
      const encoder = new FileReader()
      encoder.onloadend = () => resolve((encoder.result as string).split(/,/)[1])
      encoder.readAsDataURL(request.response)
    }
    request.ontimeout = () => {
      console.error(`timeout of ${ TIMEOUT } ms occured while fetching resource: ${ url }`)
      resolve('')
    }
    request.responseType = 'blob'
    request.timeout = TIMEOUT
    request.open('GET', url, true)
    request.send()
  })
}
