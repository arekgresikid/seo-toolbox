import { MetaTags, SEOResult } from '../types';

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const escapeXml = (unsafe: string): string => {
  return unsafe.replace(/[<>&"']/g, (m) => {
    switch (m) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case '"': return '&quot;';
      case "'": return '&apos;';
      default: return m;
    }
  });
};

export const calculateSEOScore = (tags: MetaTags): SEOResult => {
  let score = 100;
  const issues: any[] = [];

  if (!tags.title) {
    score -= 20;
    issues.push({ type: 'error', message: 'Title is missing', suggestion: 'Add a title between 50-60 characters.' });
  } else if (tags.title.length < 30 || tags.title.length > 65) {
    score -= 10;
    issues.push({ type: 'warning', message: 'Title length is not optimal', suggestion: 'Optimize title to be between 50-60 characters.' });
  }

  if (!tags.description) {
    score -= 20;
    issues.push({ type: 'error', message: 'Description is missing', suggestion: 'Add a description between 150-160 characters.' });
  } else if (tags.description.length < 120 || tags.description.length > 165) {
    score -= 10;
    issues.push({ type: 'warning', message: 'Description length is not optimal', suggestion: 'Optimize description to be between 150-160 characters.' });
  }

  if (!tags.ogTitle || !tags.ogDescription || !tags.ogImage) {
    score -= 15;
    issues.push({ type: 'warning', message: 'Open Graph tags are incomplete', suggestion: 'Fill in all OG tags for better social media sharing.' });
  }

  if (!tags.canonical) {
    score -= 10;
    issues.push({ type: 'warning', message: 'Canonical URL is missing', suggestion: 'Add a canonical URL to avoid duplicate content issues.' });
  }

  return { score: Math.max(0, score), issues };
};

export const generateMetaHtml = (tags: MetaTags): string => {
  let html = `<!-- Basic Meta Tags -->\n`;
  if (tags.title) html += `<title>${tags.title}</title>\n`;
  if (tags.description) html += `<meta name="description" content="${tags.description}">\n`;
  if (tags.keywords) html += `<meta name="keywords" content="${tags.keywords}">\n`;
  if (tags.author) html += `<meta name="author" content="${tags.author}">\n`;
  if (tags.robots) html += `<meta name="robots" content="${tags.robots}">\n`;
  if (tags.canonical) html += `<link rel="canonical" href="${tags.canonical}">\n\n`;

  html += `<!-- Open Graph / Facebook -->\n`;
  html += `<meta property="og:type" content="${tags.ogType || 'website'}">\n`;
  if (tags.ogUrl) html += `<meta property="og:url" content="${tags.ogUrl}">\n`;
  if (tags.ogTitle) html += `<meta property="og:title" content="${tags.ogTitle}">\n`;
  if (tags.ogDescription) html += `<meta property="og:description" content="${tags.ogDescription}">\n`;
  if (tags.ogImage) {
    html += `<meta property="og:image" content="${tags.ogImage}">\n`;
    if (tags.ogImageWidth) html += `<meta property="og:image:width" content="${tags.ogImageWidth}">\n`;
    if (tags.ogImageHeight) html += `<meta property="og:image:height" content="${tags.ogImageHeight}">\n`;
  }
  if (tags.ogSiteName) html += `<meta property="og:site_name" content="${tags.ogSiteName}">\n`;
  if (tags.ogLocale) html += `<meta property="og:locale" content="${tags.ogLocale}">\n`;
  if (tags.fbAppId) html += `<meta property="fb:app_id" content="${tags.fbAppId}">\n\n`;

  html += `<!-- Twitter -->\n`;
  html += `<meta property="twitter:card" content="${tags.twitterCard || 'summary_large_image'}">\n`;
  if (tags.ogUrl) html += `<meta property="twitter:url" content="${tags.ogUrl}">\n`;
  if (tags.twitterTitle) html += `<meta property="twitter:title" content="${tags.twitterTitle}">\n`;
  if (tags.twitterDescription) html += `<meta property="twitter:description" content="${tags.twitterDescription}">\n`;
  if (tags.twitterImage) html += `<meta property="twitter:image" content="${tags.twitterImage}">\n`;

  return html;
};
