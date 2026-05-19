const fs = require('fs');
const { SitemapStream, streamToPromise } = require('sitemap');

async function generate() {
  const smStream = new SitemapStream({
    hostname: 'https://www.arsishop.co.uk',
  });

  smStream.write({ url: '/', changefreq: 'daily', priority: 1.0 });

  // Add more pages here
  smStream.write({ url: '/shop', changefreq: 'weekly', priority: 0.8 });
  smStream.write({ url: '/contact', changefreq: 'monthly', priority: 0.5 });

  smStream.end();

  const sitemap = await streamToPromise(smStream);

  fs.writeFileSync('./public/sitemap.xml', sitemap.toString());
}

generate();