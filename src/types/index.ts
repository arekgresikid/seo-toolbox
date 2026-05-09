export type ToolType =
  | 'meta-tag'
  | 'sitemap'
  | 'robots'
  | 'google-tag'
  | 'schema'
  | 'hreflang'
  | 'mobile-friendly'
  | 'pagespeed'
  | 'structured-data-tester'
  | 'broken-link'
  | 'redirect'
  | 'keyword-density'
  | 'pwa-gen'
  | 'social-share'
  | 'image-seo'
  | 'geo-optimizer';

export interface MetaTags {
  title: string;
  description: string;
  keywords: string;
  author: string;
  robots: string;
  canonical: string;
  ogTitle: string;
  ogDescription: string;
  ogImage: string;
  ogUrl: string;
  ogType: string;
  ogSiteName: string;
  ogLocale: string;
  fbAppId: string;
  ogImageWidth: string;
  ogImageHeight: string;
  twitterCard: string;
  twitterTitle: string;
  twitterDescription: string;
  twitterImage: string;
}

export interface SitemapURL {
  url: string;
  priority: string;
  changefreq: string;
  lastmod: string;
}

export interface RobotsConfig {
  userAgent: string;
  allow: string[];
  disallow: string[];
  sitemap: string;
  crawlDelay: string;
}

export interface SchemaData {
  type: 'Article' | 'Product' | 'LocalBusiness' | 'FAQ' | 'BreadcrumbList';
  data: any;
}

export interface Hreflang {
  lang: string;
  url: string;
}

export interface SEOIssue {
  type: 'error' | 'warning' | 'success';
  message: string;
  suggestion?: string;
}

export interface SEOResult {
  score: number;
  issues: SEOIssue[];
}
