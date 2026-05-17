const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d');
const measureCache = new Map();

function cacheKey(text, fontSize, fontFamily, fontWeight) {
  return `${text}|${fontSize}|${fontFamily}|${fontWeight}`;
}

function measure(text, fontSize, fontFamily, fontWeight = '400') {
  const key = cacheKey(text, fontSize, fontFamily, fontWeight);
  if (measureCache.has(key)) return measureCache.get(key);
  ctx.font = `${fontWeight} ${fontSize}px ${fontFamily}`;
  const width = ctx.measureText(text).width;
  measureCache.set(key, width);
  return width;
}

/**
 * Binary search for the largest font size (px) at which `text` fits within `maxWidth`.
 */
export function fitTextToWidth(text, maxWidth, fontFamily, fontWeight = '700') {
  let lo = 8;
  let hi = 400;
  while (lo < hi - 1) {
    const mid = Math.floor((lo + hi) / 2);
    const width = measure(text, mid, fontFamily, fontWeight);
    if (width <= maxWidth) lo = mid;
    else hi = mid;
  }
  return lo;
}

/**
 * Word-wrap text into lines that fit within maxWidth at a given font size.
 */
export function wrapText(text, maxWidth, fontSize, fontFamily, fontWeight = '400') {
  const words = text.split(' ');
  const lines = [];
  let current = '';

  for (const word of words) {
    const test = current ? `${current} ${word}` : word;
    const w = measure(test, fontSize, fontFamily, fontWeight);
    if (w > maxWidth && current) {
      lines.push(current);
      current = word;
    } else {
      current = test;
    }
  }
  if (current) lines.push(current);
  return lines;
}

/**
 * Clear the measurement cache (e.g. on font load or window resize).
 */
export function clearMeasureCache() {
  measureCache.clear();
}
