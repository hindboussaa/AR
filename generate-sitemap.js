const fs = require('fs');
const path = require('path');

const BASE_URL = 'https://www.arsishop.co.uk';

const pages = [
  '/',
  '/shop',
  '/about',
  '/contact',
];

const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">

${pages.map(page => `
  <url>
    <loc>${BASE_URL}${page}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>${page === '/' ? '1.0' : '0.8'}</priority>
  </url>
`).join('')}

</urlset>
`;

path.join(__dirname, 'public/sitemap.xml'),
  sitemap
);

console.log('✅ sitemap.xml generated');


