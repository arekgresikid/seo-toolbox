'use client';

import React from 'react';
import Header from '@/components/layout/Header';
import { FileText, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function TermsOfService() {
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
              <FileText className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Terms of Service</h1>
              <p className="text-muted-foreground">Last updated: April 2026</p>
            </div>
          </div>

          <div className="prose dark:prose-invert max-w-none space-y-6">
            <section className="space-y-3">
              <h2 className="text-xl font-bold">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground leading-relaxed">
                By accessing and using SEO Toolbox Pro, you agree to comply with and be bound by these terms. If you do not agree, please do not use the application.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold">2. Use License</h2>
              <p className="text-muted-foreground leading-relaxed">
                You are granted a license to use these SEO tools for personal or commercial website optimization. You may not attempt to reverse engineer or scrape the application's underlying infrastructure.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold">3. Disclaimer</h2>
              <p className="text-muted-foreground leading-relaxed">
                The tools provided are for educational and optimization purposes. While we strive for accuracy, we cannot guarantee that the suggestions provided will result in specific search engine rankings.
              </p>
            </section>

            <section className="space-y-3">
              <h2 className="text-xl font-bold">4. Limitation of Liability</h2>
              <p className="text-muted-foreground leading-relaxed">
                SEO Toolbox Pro shall not be held liable for any damages arising out of the use or inability to use the tools on this website.
              </p>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
