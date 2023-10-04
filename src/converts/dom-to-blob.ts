import { changeJpegDpi } from '../change-jpeg-dpi'
import { changePngDpi } from '../change-png-dpi'
import { orCreateContext } from '../create-context'
import { blobToArrayBuffer, canvasToBlob } from '../utils'
import { domToCanvas } from './dom-to-canvas'
import type { Context } from '../context'
import type { Options } from '../options'

export async function domToBlob<T extends Node>(node: T, options?: Options): Promise<Blob>
export async function domToBlob<T extends Node>(context: Context<T>): Promise<Blob>
export async function domToBlob(node: any, options?: any) {
  const context = await orCreateContext(node, options)
  const { log, type, quality, dpi } = context
  const canvas = await domToCanvas(context)
  log.time('canvas to blob')
  const blob = await canvasToBlob(canvas, type, quality)
  if (['image/png', 'image/jpeg'].includes(type) && dpi) {
    const arrayBuffer = await blobToArrayBuffer(blob.slice(0, 33))
    let uint8Array = new Uint8Array(arrayBuffer)
    if (type === 'image/png') {
      uint8Array = changePngDpi(uint8Array, dpi)
    } else if (type === 'image/jpeg') {
      uint8Array = changeJpegDpi(uint8Array, dpi)
    }
    log.timeEnd('canvas to blob')
    return new Blob([uint8Array, blob.slice(33)], { type })
  }
  log.timeEnd('canvas to blob')
  return blob
}
