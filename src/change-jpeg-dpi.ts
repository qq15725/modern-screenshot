export function changeJpegDpi(uint8Array: Uint8Array, dpi: number) {
  uint8Array[13] = 1 // 1 pixel per inch or 2 pixel per cm
  uint8Array[14] = dpi >> 8 // dpiX high byte
  uint8Array[15] = dpi & 0xFF // dpiX low byte
  uint8Array[16] = dpi >> 8 // dpiY high byte
  uint8Array[17] = dpi & 0xFF // dpiY low byte
  return uint8Array
}
