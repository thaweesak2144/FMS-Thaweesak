const https = require('https');
const options = {
  hostname: 'dribbble.com',
  path: '/shots/25571331-Etail-landing-page-web-design-3D-animation',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
  }
};
https.get(options, (res) => {
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    const ogImg = data.match(/property="og:image"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:image"/i);
    const ogDesc = data.match(/property="og:description"\s+content="([^"]+)"/i) || data.match(/content="([^"]+)"\s+property="og:description"/i);
    const title = data.match(/<title>([^<]+)<\/title>/i);
    console.log(JSON.stringify({
      status: res.statusCode,
      title: title ? title[1] : null,
      ogImg: ogImg ? ogImg[1] : null,
      ogDesc: ogDesc ? ogDesc[1] : null
    }, null, 2));
  });
}).on('error', err => console.error(err.message));
