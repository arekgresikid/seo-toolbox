import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "react-hot-toast";
import { ClerkProvider } from "@clerk/nextjs";
import Script from "next/script";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    default: "SEO Toolbox Pro - All-in-One SEO Suite & AI Optimizer",
    template: "%s | SEO Toolbox Pro"
  },
  description: "Comprehensive SEO toolkit: Meta Tag Generator, Sitemap Builder, Robots.txt Generator, Schema Markup, GEO Optimizer, and PageSpeed Insights. Optimize your website for Google, Social Media, and AI Search Engines.",
  keywords: ["SEO Tools", "Meta Tag Generator", "Sitemap Builder", "Robots.txt Generator", "Schema Markup", "GEO Optimizer", "PageSpeed Insights", "Web Optimization"],
  authors: [{ name: "SEO Toolbox Team" }],
  creator: "SEO Toolbox Pro",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://seo-toolbox-pro.vercel.app", 
    siteName: "SEO Toolbox Pro",
    title: "SEO Toolbox Pro - All-in-One SEO Suite",
    description: "The ultimate toolkit for modern SEO. Optimize for traditional search engines and Generative AI.",
    images: [
      {
        url: "https://seo-toolbox-pro.vercel.app/og-image.png",
        width: 1200,
        height: 630,
        alt: "SEO Toolbox Pro Dashboard",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "SEO Toolbox Pro - All-in-One SEO Suite",
    description: "Optimize your website for Google, Social Media, and AI Search Engines.",
    images: ["https://seo-toolbox-pro.vercel.app/og-image.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: "/favicon.ico",
    apple: "/icon-512x512.png",
  },
  manifest: "/manifest.json",
  alternates: {
    canonical: "https://seo-toolbox-pro.vercel.app",
    languages: {
      'en-US': 'https://seo-toolbox-pro.vercel.app',
      'x-default': 'https://seo-toolbox-pro.vercel.app',
    },
  },
  verification: {
    google: "google-site-verification-code",
    yandex: "yandex-verification-code",
    yahoo: "yahoo-verification-code",
  },
  category: 'technology',
  other: {
    'theme-color': '#0ea5e9',
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'black-translucent',
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const structuredData = [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      "name": "SEO Toolbox Pro",
      "operatingSystem": "Web",
      "applicationCategory": "DeveloperApplication",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "1250"
      },
      "offers": {
        "@type": "Offer",
        "price": "0",
        "priceCurrency": "USD"
      }
    },
    {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "SEO Toolbox Pro",
      "url": "https://seo-toolbox-pro.vercel.app",
      "logo": "https://seo-toolbox-pro.vercel.app/icon-512x512.png",
      "sameAs": [
        "https://facebook.com/seotoolboxpro",
        "https://twitter.com/seotoolboxpro",
        "https://linkedin.com/company/seotoolboxpro"
      ]
    },
    {
      "@context": "https://schema.org",
      "@type": "WebSite",
      "url": "https://seo-toolbox-pro.vercel.app",
      "potentialAction": {
        "@type": "SearchAction",
        "target": "https://seo-toolbox-pro.vercel.app/?q={search_term_string}",
        "query-input": "required name=search_term_string"
      }
    }
  ];

  return (
    <ClerkProvider>
      <html lang="en" suppressHydrationWarning>
        <body className={inter.className}>
          <ThemeProvider
            attribute="class"
            defaultTheme="system"
            enableSystem
            disableTransitionOnChange
          >
            {children}
            <Toaster position="bottom-right" />
          </ThemeProvider>
          
          <Script
            id="structured-data"
            type="application/ld+json"
            dangerouslySetInnerHTML={{
              __html: JSON.stringify(structuredData)
            }}
          />
        </body>
      </html>
    </ClerkProvider>
  );
}
