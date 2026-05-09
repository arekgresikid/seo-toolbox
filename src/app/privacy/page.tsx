'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { ShieldCheck, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <Header />
      <main className="flex-1 p-6 lg:p-10">
        <div className="max-w-3xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
          <Link href="/" className="flex items-center gap-2 text-sm text-primary hover:underline mb-8">
            <ArrowLeft className="h-4 w-4" /> Back to Tools
          </Link>

          <div className="flex items-center gap-4 border-b pb-6">
            <div className="h-12 w-12 bg-primary/10 rounded-xl flex items-center justify-center">
              <ShieldCheck className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Privacy Policy</h1>
              <p className="text-muted-foreground">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-bold">1. Data Collection</h2>
              <p className="text-muted-foreground leading-relaxed">
                SEO Toolbox Pro is designed with privacy in mind. We do not store any of the website URLs, meta tags, or content you analyze on our servers. All processing happens in your browser or through temporary serverless proxy requests.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold">2. Local Storage</h2>
              <p className="text-muted-foreground leading-relaxed">
                We use your browser's LocalStorage to save your tool preferences and current work so you can resume your tasks later. This data never leaves your device.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold">3. Third-Party Services</h2>
              <p className="text-muted-foreground leading-relaxed">
                Our PageSpeed Insights tool connects directly to Google's PageSpeed API. When using this feature, your URL is shared with Google to generate the performance report.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold">4. Cookies</h2>
              <p className="text-muted-foreground leading-relaxed">
                We do not use tracking cookies. Any cookies used are strictly necessary for the application's basic functionality.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
