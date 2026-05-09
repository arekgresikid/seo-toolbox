import { RobotsConfig } from '../types';

export const generateRobotsTxt = (config: RobotsConfig): string => {
  let txt = `User-agent: ${config.userAgent || '*'}\n`;
  
  config.disallow.forEach((path) => {
    if (path) txt += `Disallow: ${path}\n`;
  });
  
  config.allow.forEach((path) => {
    if (path) txt += `Allow: ${path}\n`;
  });

  if (config.crawlDelay) {
    txt += `Crawl-delay: ${config.crawlDelay}\n`;
  }

  if (config.sitemap) {
    txt += `Sitemap: ${config.sitemap}\n`;
  }

  return txt;
};
