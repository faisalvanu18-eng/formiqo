/**
 * Generates all brand raster assets (PWA icons, favicons, Apple touch icon,
 * and the Open Graph image) from the Formiqo logo — with NO external
 * dependencies. Everything is drawn pixel-by-pixel and encoded as PNG here.
 *
 * The logo: a rounded-corner blue gradient tile containing a white "F" whose
 * lower area carries a checkmark accent. Matches src/components/Logo.tsx and
 * public/favicon.svg.
 *
 * Run: `node scripts/gen-icons.js`
 */
const fs = require("fs");
const path = require("path");
const zlib = require("zlib");

/* ----------------------------- PNG encoding ----------------------------- */

function crc32(buf) {
  let c = ~0;
  for (let i = 0; i < buf.length; i++) {
    c ^= buf[i];
    for (let k = 0; k < 8; k++) c = (c >>> 1) ^ (0xedb88320 & -(c & 1));
  }
  return ~c >>> 0;
}
function chunk(type, data) {
  const len = Buffer.alloc(4);
  len.writeUInt32BE(data.length, 0);
  const typeBuf = Buffer.from(type, "ascii");
  const crc = Buffer.alloc(4);
  crc.writeUInt32BE(crc32(Buffer.concat([typeBuf, data])), 0);
  return Buffer.concat([len, typeBuf, data, crc]);
}

/** Encode an RGBA pixel buffer (w*h*4) into a PNG buffer. */
function encodePng(width, height, rgba) {
  const raw = Buffer.alloc(height * (width * 4 + 1));
  for (let y = 0; y < height; y++) {
    const rowStart = y * (width * 4 + 1);
    raw[rowStart] = 0; // no filter
    rgba.copy(raw, rowStart + 1, y * width * 4, (y + 1) * width * 4);
  }
  const sig = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
  const ihdr = Buffer.alloc(13);
  ihdr.writeUInt32BE(width, 0);
  ihdr.writeUInt32BE(height, 4);
  ihdr[8] = 8; // bit depth
  ihdr[9] = 6; // colour type RGBA
  const idat = zlib.deflateSync(raw, { level: 9 });
  return Buffer.concat([
    sig,
    chunk("IHDR", ihdr),
    chunk("IDAT", idat),
    chunk("IEND", Buffer.alloc(0)),
  ]);
}

/* ------------------------------ Drawing --------------------------------- */

const BRAND_A = [59, 130, 246]; // #3b82f6
const BRAND_B = [37, 99, 235]; // #2563eb
const WHITE = [255, 255, 255];

function lerp(a, b, t) {
  return [
    Math.round(a[0] + (b[0] - a[0]) * t),
    Math.round(a[1] + (b[1] - a[1]) * t),
    Math.round(a[2] + (b[2] - a[2]) * t),
  ];
}

/**
 * Draw the logo into an RGBA buffer of size s x s.
 * `bleed` = true fills the whole square (maskable / og tile); otherwise the
 * tile has rounded corners with transparent outside.
 */
function drawLogo(s, { rounded = true } = {}) {
  const rgba = Buffer.alloc(s * s * 4); // transparent by default
  const radius = rounded ? Math.round(s * 0.25) : 0;

  // "F" geometry (relative to tile), matching the SVG proportions.
  const stemX0 = 0.355 * s;
  const stemX1 = 0.435 * s;
  const topY0 = 0.28 * s;
  const topY1 = 0.36 * s;
  const midY0 = 0.46 * s;
  const midY1 = 0.54 * s;
  const barRight = 0.66 * s;
  const midRight = 0.6 * s;
  const stemBottom = 0.72 * s;

  // Checkmark stroke points.
  const ck = [
    [0.56 * s, 0.63 * s],
    [0.63 * s, 0.7 * s],
    [0.76 * s, 0.56 * s],
  ];
  const ckW = Math.max(2, s * 0.06);

  function inRoundedRect(x, y) {
    if (!rounded) return true;
    // Distance into the nearest corner's rounding zone.
    const left = x < radius;
    const right = x > s - 1 - radius;
    const top = y < radius;
    const bottom = y > s - 1 - radius;
    // Only the four corners are rounded; edges/centre are always inside.
    if ((left || right) && (top || bottom)) {
      const cx = left ? radius : s - 1 - radius;
      const cy = top ? radius : s - 1 - radius;
      const dx = x - cx;
      const dy = y - cy;
      return dx * dx + dy * dy <= radius * radius;
    }
    return true;
  }

  function distToSegment(px, py, ax, ay, bx, by) {
    const dx = bx - ax;
    const dy = by - ay;
    const l2 = dx * dx + dy * dy || 1;
    let t = ((px - ax) * dx + (py - ay) * dy) / l2;
    t = Math.max(0, Math.min(1, t));
    const cx = ax + t * dx;
    const cy = ay + t * dy;
    return Math.hypot(px - cx, py - cy);
  }

  for (let y = 0; y < s; y++) {
    for (let x = 0; x < s; x++) {
      const idx = (y * s + x) * 4;
      if (!inRoundedRect(x, y)) continue; // transparent outside rounded tile

      // Diagonal gradient background.
      const t = (x + y) / (2 * s);
      let color = lerp(BRAND_A, BRAND_B, t);
      let alpha = 255;

      // White "F": vertical stem + top bar + middle bar.
      const inStem = x >= stemX0 && x <= stemX1 && y >= topY0 && y <= stemBottom;
      const inTop = y >= topY0 && y <= topY1 && x >= stemX0 && x <= barRight;
      const inMid = y >= midY0 && y <= midY1 && x >= stemX0 && x <= midRight;
      if (inStem || inTop || inMid) color = WHITE;

      // Checkmark accent.
      let onCheck = false;
      for (let i = 0; i < ck.length - 1; i++) {
        if (
          distToSegment(x, y, ck[i][0], ck[i][1], ck[i + 1][0], ck[i + 1][1]) <=
          ckW / 2
        ) {
          onCheck = true;
          break;
        }
      }
      if (onCheck) color = WHITE;

      rgba[idx] = color[0];
      rgba[idx + 1] = color[1];
      rgba[idx + 2] = color[2];
      rgba[idx + 3] = alpha;
    }
  }
  return rgba;
}

function writePng(name, size, opts) {
  const rgba = drawLogo(size, opts);
  const png = encodePng(size, size, rgba);
  fs.writeFileSync(path.join(outDir, name), png);
  console.log("wrote", name, `${size}x${size}`);
}

/* ------------------------------ OG image -------------------------------- */

function writeOgImage() {
  const W = 1200;
  const H = 630;
  const rgba = Buffer.alloc(W * H * 4);
  // Background gradient (brand-50 -> slate-50), plus a brand band at the bottom.
  const bandTop = H - 90;
  for (let y = 0; y < H; y++) {
    for (let x = 0; x < W; x++) {
      const idx = (y * W + x) * 4;
      let c;
      if (y >= bandTop) {
        // Bottom brand band with a subtle horizontal gradient.
        c = lerp(BRAND_A, BRAND_B, x / W);
      } else {
        const t = y / bandTop;
        c = lerp([239, 246, 255], [248, 250, 252], t);
      }
      rgba[idx] = c[0];
      rgba[idx + 1] = c[1];
      rgba[idx + 2] = c[2];
      rgba[idx + 3] = 255;
    }
  }
  // Centre the logo tile horizontally in the upper area.
  const tile = 300;
  const logo = drawLogo(tile, { rounded: true });
  const offX = Math.round((W - tile) / 2);
  const offY = Math.round((bandTop - tile) / 2);
  for (let y = 0; y < tile; y++) {
    for (let x = 0; x < tile; x++) {
      const sIdx = (y * tile + x) * 4;
      const a = logo[sIdx + 3];
      if (a === 0) continue;
      const dIdx = ((offY + y) * W + (offX + x)) * 4;
      rgba[dIdx] = logo[sIdx];
      rgba[dIdx + 1] = logo[sIdx + 1];
      rgba[dIdx + 2] = logo[sIdx + 2];
      rgba[dIdx + 3] = 255;
    }
  }
  const png = encodePng(W, H, rgba);
  fs.writeFileSync(path.join(outDir, "og-image.png"), png);
  console.log("wrote og-image.png 1200x630");
}

/* -------------------------------- main ---------------------------------- */

const outDir = path.join(__dirname, "..", "public");
fs.mkdirSync(outDir, { recursive: true });

writePng("favicon-16.png", 16, { rounded: false });
writePng("favicon-32.png", 32, { rounded: false });
writePng("apple-touch-icon.png", 180, { rounded: true });
writePng("icon-192.png", 192, { rounded: true });
writePng("icon-512.png", 512, { rounded: true });
// Maskable needs full-bleed background (no transparent corners).
writePng("icon-maskable-512.png", 512, { rounded: false });

writeOgImage();

// favicon.ico: browsers accept a PNG payload named .ico; ship the 32px PNG.
fs.copyFileSync(
  path.join(outDir, "favicon-32.png"),
  path.join(outDir, "favicon.ico")
);
console.log("wrote favicon.ico (from 32px PNG)");
