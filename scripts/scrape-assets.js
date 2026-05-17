const puppeteer = require('puppeteer');
const https = require('https');
const fs = require('fs');
const path = require('path');

async function downloadFile(url, dest) {
  return new Promise((resolve, reject) => {
    const file = fs.createWriteStream(dest);
    https.get(url, (res) => {
      if (res.statusCode === 301 || res.statusCode === 302) {
        file.close();
        fs.unlinkSync(dest);
        downloadFile(res.headers.location, dest).then(resolve).catch(reject);
        return;
      }
      res.pipe(file);
      file.on('finish', () => { file.close(); resolve(); });
    }).on('error', (err) => { fs.unlinkSync(dest); reject(err); });
  });
}

(async () => {
  const outDir = path.join(__dirname, '../client/public/assets/printer');
  fs.mkdirSync(outDir, { recursive: true });

  try {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setUserAgent('Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36');
    await page.goto('https://bambulab.com/en/p2s', {
      waitUntil: 'networkidle2',
      timeout: 60000,
    });

    const imageUrls = await page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .map(img => img.src || img.dataset.src)
        .filter(src => src && src.startsWith('http'));
    });

    console.log(`Found ${imageUrls.length} images`);

    let idx = 0;
    for (const url of imageUrls) {
      const ext = url.split('.').pop().split('?')[0] || 'jpg';
      const dest = path.join(outDir, `p2s-asset-${idx++}.${ext}`);
      try {
        await downloadFile(url, dest);
        console.log(`Downloaded: ${dest}`);
      } catch (e) {
        console.error(`Failed: ${url} — ${e.message}`);
      }
    }

    await browser.close();
    console.log('Done. Assets saved to client/public/assets/printer/');
  } catch (e) {
    console.error('Scraping failed:', e.message);
    console.log('Using procedural 3D model fallback — see PrinterScene.jsx');
  }
})();
