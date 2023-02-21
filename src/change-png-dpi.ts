const _P = 'p'.charCodeAt(0)
const _H = 'H'.charCodeAt(0)
const _Y = 'Y'.charCodeAt(0)
const _S = 's'.charCodeAt(0)

let pngDataTable: ReturnType<typeof createPngDataTable>

function createPngDataTable() {
  /* Table of CRCs of all 8-bit messages. */
  const crcTable = new Int32Array(256)
  for (let n = 0; n < 256; n++) {
    let c = n
    for (let k = 0; k < 8; k++) {
      c = (c & 1) ? 0xEDB88320 ^ (c >>> 1) : c >>> 1
    }
    crcTable[n] = c
  }
  return crcTable
}

function calcCrc(uint8Array: Uint8Array) {
  let c = -1
  if (!pngDataTable) pngDataTable = createPngDataTable()
  for (let n = 0; n < uint8Array.length; n++) {
    c = pngDataTable[(c ^ uint8Array[n]) & 0xFF] ^ (c >>> 8)
  }
  return c ^ -1
}

function searchStartOfPhys(uint8Array: Uint8Array) {
  const length = uint8Array.length - 1
  // we check from the end since we cut the string in proximity of the header
  // the header is within 21 bytes from the end.
  for (let i = length; i >= 4; i--) {
    if (uint8Array[i - 4] === 9 && uint8Array[i - 3] === _P
      && uint8Array[i - 2] === _H && uint8Array[i - 1] === _Y
      && uint8Array[i] === _S) {
      return i - 3
    }
  }
  return 0
}

export function changePngDpi(uint8Array: Uint8Array, dpi: number, overwritepHYs = false) {
  const physChunk = new Uint8Array(13)
  // chunk header pHYs
  // 9 bytes of data
  // 4 bytes of crc
  // this multiplication is because the standard is dpi per meter.
  dpi *= 39.3701
  physChunk[0] = _P
  physChunk[1] = _H
  physChunk[2] = _Y
  physChunk[3] = _S
  physChunk[4] = dpi >>> 24 // dpiX highest byte
  physChunk[5] = dpi >>> 16 // dpiX veryhigh byte
  physChunk[6] = dpi >>> 8 // dpiX high byte
  physChunk[7] = dpi & 0xFF // dpiX low byte
  physChunk[8] = physChunk[4] // dpiY highest byte
  physChunk[9] = physChunk[5] // dpiY veryhigh byte
  physChunk[10] = physChunk[6] // dpiY high byte
  physChunk[11] = physChunk[7] // dpiY low byte
  physChunk[12] = 1 // dot per meter....

  const crc = calcCrc(physChunk)

  const crcChunk = new Uint8Array(4)
  crcChunk[0] = crc >>> 24
  crcChunk[1] = crc >>> 16
  crcChunk[2] = crc >>> 8
  crcChunk[3] = crc & 0xFF

  if (overwritepHYs) {
    const startingIndex = searchStartOfPhys(uint8Array)
    uint8Array.set(physChunk, startingIndex)
    uint8Array.set(crcChunk, startingIndex + 13)
    return uint8Array
  } else {
    // i need to give back an array of data that is divisible by 3 so that
    // dataurl encoding gives me integers, for luck this chunk is 17 + 4 = 21
    // if it was we could add a text chunk contaning some info, untill desired
    // length is met.

    // chunk structur 4 bytes for length is 9
    const chunkLength = new Uint8Array(4)
    chunkLength[0] = 0
    chunkLength[1] = 0
    chunkLength[2] = 0
    chunkLength[3] = 9

    const finalHeader = new Uint8Array(54)
    finalHeader.set(uint8Array, 0)
    finalHeader.set(chunkLength, 33)
    finalHeader.set(physChunk, 37)
    finalHeader.set(crcChunk, 50)
    return finalHeader
  }
}

// those are 3 possible signature of the physBlock in base64.
// the pHYs signature block is preceed by the 4 bytes of lenght. The length of
// the block is always 9 bytes. So a phys block has always this signature:
// 0 0 0 9 p H Y s.
// However the data64 encoding aligns we will always find one of those 3 strings.
// this allow us to find this particular occurence of the pHYs block without
// converting from b64 back to string
const b64PhysSignature1 = 'AAlwSFlz'
const b64PhysSignature2 = 'AAAJcEhZ'
const b64PhysSignature3 = 'AAAACXBI'

export function detectPhysChunkFromDataUrl(dataUrl: string) {
  let b64index = dataUrl.indexOf(b64PhysSignature1)
  if (b64index === -1) {
    b64index = dataUrl.indexOf(b64PhysSignature2)
  }
  if (b64index === -1) {
    b64index = dataUrl.indexOf(b64PhysSignature3)
  }
  return b64index
}
