import { SitemapURL } from '../types';
import { escapeXml } from './seoUtils';

export const generateSitemapXml = (urls: SitemapURL[]): string => {
  let xml = `<?xml version="1.0" encoding="UTF-8"?>\n`;
  xml += `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n`;

  urls.forEach((item) => {
    if (item.url) {
      xml += `  <url>\n`;
      xml += `    <loc>${escapeXml(item.url)}</loc>\n`;
      if (item.lastmod) xml += `    <lastmod>${item.lastmod}</lastmod>\n`;
      if (item.changefreq) xml += `    <changefreq>${item.changefreq}</changefreq>\n`;
      if (item.priority) xml += `    <priority>${item.priority}</priority>\n`;
      xml += `  </url>\n`;
    }
  });

  xml += `</urlset>`;
  return xml;
};
