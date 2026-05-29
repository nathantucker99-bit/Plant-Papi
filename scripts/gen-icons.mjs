import { createWriteStream } from 'fs'
import { deflateSync } from 'zlib'
import { mkdir } from 'fs/promises'

await mkdir('public/icons', { recursive: true })

function png(size) {
  const w = size, h = size

  // Build raw RGBA rows
  const rows = []
  const cx = w / 2, cy = h / 2, r = w * 0.38

  for (let y = 0; y < h; y++) {
    const row = Buffer.alloc(w * 4)
    for (let x = 0; x < w; x++) {
      // background #1a2e1e
      let R = 0x1a, G = 0x2e, B = 0x1e, A = 255

      // simple leaf shape: ellipse rotated 45deg
      const dx = x - cx, dy = y - cy
      // rotate -45deg
      const rx = (dx + dy) / Math.SQRT2
      const ry = (-dx + dy) / Math.SQRT2
      const inLeaf = (rx * rx) / (r * r) + (ry * ry) / ((r * 0.55) * (r * 0.55)) < 1 && ry < r * 0.1

      // stem: thin vertical line below center
      const inStem = Math.abs(dx) < w * 0.03 && dy > 0 && dy < r * 0.9

      if (inLeaf) { R = 0x4a; G = 0x8a; B = 0x5a }
      if (inStem) { R = 0x2d; G = 0x5a; B = 0x3a }

      row[x * 4] = R
      row[x * 4 + 1] = G
      row[x * 4 + 2] = B
      row[x * 4 + 3] = A
    }
    rows.push(row)
  }

  // PNG structure
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])

  function chunk(type, data) {
    const t = Buffer.from(type, 'ascii')
    const len = Buffer.alloc(4); len.writeUInt32BE(data.length)
    const crcBuf = Buffer.concat([t, data])
    let crc = 0xffffffff
    for (const b of crcBuf) {
      crc ^= b
      for (let i = 0; i < 8; i++) crc = (crc >>> 1) ^ (crc & 1 ? 0xedb88320 : 0)
    }
    crc ^= 0xffffffff
    const crcOut = Buffer.alloc(4); crcOut.writeUInt32BE(crc >>> 0)
    return Buffer.concat([len, t, data, crcOut])
  }

  const ihdr = Buffer.alloc(13)
  ihdr.writeUInt32BE(w, 0); ihdr.writeUInt32BE(h, 4)
  ihdr[8] = 8   // bit depth
  ihdr[9] = 2   // color type RGB (no alpha for simplicity — rewrite to 6 for RGBA)
  ihdr[9] = 6   // RGBA
  ihdr[10] = 0; ihdr[11] = 0; ihdr[12] = 0

  // raw image data: filter byte + row data
  const rawParts = rows.map(row => Buffer.concat([Buffer.from([0]), row]))
  const raw = Buffer.concat(rawParts)
  const compressed = deflateSync(raw, { level: 6 })

  const iend = Buffer.alloc(0)

  return Buffer.concat([sig, chunk('IHDR', ihdr), chunk('IDAT', compressed), chunk('IEND', iend)])
}

for (const size of [192, 512]) {
  const buf = png(size)
  const path = `public/icons/icon-${size}.png`
  createWriteStream(path).end(buf)
  console.log(`wrote ${path}`)
}

// apple-touch-icon (180x180)
const buf = png(180)
createWriteStream('public/apple-touch-icon.png').end(buf)
console.log('wrote public/apple-touch-icon.png')
