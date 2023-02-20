import { baseFetch } from './fetch'
import type { BaseFetchOptions } from './fetch'

const worker = self as unknown as Worker

worker.onmessage = async event => {
  const options = event.data as BaseFetchOptions & { rawUrl: string }

  const result = await baseFetch(options)

  const stream = new ReadableStream<any>({
    pull(controller) {
      controller.enqueue(result)
      controller.close()
    },
  })

  const url = options.rawUrl || options.url

  if (stream) {
    worker.postMessage({ url, stream }, [stream])
  } else {
    worker.postMessage({ url })
  }
}
