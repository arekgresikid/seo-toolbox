'use client';

import React, { useState } from 'react';
import Header from '@/components/layout/Header';
import Sidebar from '@/components/layout/Sidebar';
import MetaTagGenerator from '@/tools/MetaTagGenerator';
import SitemapGenerator from '@/tools/SitemapGenerator';
import RobotsGenerator from '@/tools/RobotsGenerator';
import GoogleTagAnalytics from '@/tools/GoogleTagAnalytics';
import SchemaMarkupGenerator from '@/tools/SchemaMarkupGenerator';
import HreflangCanonical from '@/tools/HreflangCanonical';
import MobileFriendlyTest from '@/tools/MobileFriendlyTest';
import PageSpeedInsights from '@/tools/PageSpeedInsights';
import StructuredDataTester from '@/tools/StructuredDataTester';
import BrokenLinkChecker from '@/tools/BrokenLinkChecker';
import RedirectChecker from '@/tools/RedirectChecker';
import KeywordDensity from '@/tools/KeywordDensity';
import PwaGenerator from '@/tools/PwaGenerator';
import SocialShareGenerator from '@/tools/SocialShareGenerator';
import ImageSeoAnalyzer from '@/tools/ImageSeoAnalyzer';
import GeoOptimizer from '@/tools/GeoOptimizer';
import { ToolType } from '@/types';
import { Menu } from 'lucide-react';
import Link from 'next/link';
import { useRef, useEffect } from 'react';

export default function Home() {
  const [activeTool, setActiveTool] = useState<ToolType>('meta-tag');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const mainRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (mainRef.current) {
      mainRef.current.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [activeTool]);

  const renderTool = () => {
    switch (activeTool) {
      case 'meta-tag': return <MetaTagGenerator />;
      case 'sitemap': return <SitemapGenerator />;
      case 'robots': return <RobotsGenerator />;
      case 'google-tag': return <GoogleTagAnalytics />;
      case 'schema': return <SchemaMarkupGenerator />;
      case 'hreflang': return <HreflangCanonical />;
      case 'mobile-friendly': return <MobileFriendlyTest />;
      case 'pagespeed': return <PageSpeedInsights />;
      case 'structured-data-tester': return <StructuredDataTester />;
      case 'broken-link': return <BrokenLinkChecker />;
      case 'redirect': return <RedirectChecker />;
      case 'keyword-density': return <KeywordDensity />;
      case 'pwa-gen': return <PwaGenerator />;
      case 'social-share': return <SocialShareGenerator />;
      case 'image-seo': return <ImageSeoAnalyzer />;
      case 'geo-optimizer': return <GeoOptimizer />;
      default: return <MetaTagGenerator />;
    }
  };

  const tools = [
    { id: 'meta-tag', name: 'Meta Tag Generator' },
    { id: 'sitemap', name: 'Sitemap Generator' },
    { id: 'robots', name: 'Robots.txt Tool' },
    { id: 'google-tag', name: 'Google Tag & GA' },
    { id: 'schema', name: 'Schema Markup' },
    { id: 'hreflang', name: 'Hreflang & Canonical' },
    { id: 'mobile-friendly', name: 'Mobile Friendly' },
    { id: 'pagespeed', name: 'PageSpeed Insights' },
    { id: 'structured-data-tester', name: 'Schema Tester' },
    { id: 'broken-link', name: 'Broken Link Checker' },
    { id: 'redirect', name: 'Redirect Tracer' },
    { id: 'keyword-density', name: 'Keyword Density' },
    { id: 'pwa-gen', name: 'PWA Manifest' },
    { id: 'social-share', name: 'Social Share Links' },
    { id: 'image-seo', name: 'Image SEO' },
    { id: 'geo-optimizer', name: 'GEO Optimizer' },
  ];

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col">
      <a href="#main-content" className="sr-only focus:not-sr-only focus:absolute focus:z-[100] focus:p-4 focus:bg-primary focus:text-primary-foreground">
        Skip to content
      </a>
      <Header />
      
      <div className="flex flex-1">
        <Sidebar activeTool={activeTool} setActiveTool={(tool) => {
          setActiveTool(tool);
          setIsMobileMenuOpen(false);
        }} />

        {/* Mobile Nav Toggle */}
        <div className="md:hidden fixed bottom-6 right-6 z-50">
          <button 
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="h-14 w-14 bg-primary text-primary-foreground rounded-full shadow-2xl flex items-center justify-center hover:scale-110 transition-transform"
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>

        {/* Mobile Menu Overlay */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-40 bg-background p-6 animate-in slide-in-from-bottom-full duration-300 overflow-y-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-xl font-bold">Select Tool</h2>
              <button onClick={() => setIsMobileMenuOpen(false)} className="text-muted-foreground font-bold">Close</button>
            </div>
            <div className="grid grid-cols-1 gap-3">
              {tools.map((tool) => (
                <button
                  key={tool.id}
                  onClick={() => {
                    setActiveTool(tool.id as ToolType);
                    setIsMobileMenuOpen(false);
                  }}
                  className={`p-4 rounded-xl border text-left font-bold transition-all ${activeTool === tool.id ? 'bg-primary text-primary-foreground border-primary shadow-lg scale-[1.02]' : 'bg-card hover:bg-muted'}`}
                >
                  {tool.name}
                </button>
              ))}
            </div>
          </div>
        )}

        <main 
          id="main-content"
          ref={mainRef}
          className="flex-1 p-6 lg:p-10 overflow-y-auto max-h-[calc(100vh-4rem)]"
        >
          <div className="max-w-7xl mx-auto animate-in fade-in duration-500 space-y-12">
            {renderTool()}

            {/* Content for SEO Crawlers & Users */}
            <div className="pt-20 pb-10 border-t space-y-16">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black tracking-tight">Optimasi Website Anda ke Level Berikutnya</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    SEO Toolbox Pro menyediakan 16+ alat canggih yang dirancang untuk membantu pengembang, pemasar, dan pemilik bisnis meningkatkan visibilitas website mereka di mesin pencari tradisional seperti Google, serta mesin pencari AI generasi terbaru.
                  </p>
                  <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm font-medium">
                    <li className="flex items-center gap-2">✅ Analisis Meta Tag Akurat</li>
                    <li className="flex items-center gap-2">✅ Optimasi untuk AI (GEO)</li>
                    <li className="flex items-center gap-2">✅ Audit Performa PageSpeed</li>
                    <li className="flex items-center gap-2">✅ Generator Skema JSON-LD</li>
                  </ul>
                </div>
                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10 relative overflow-hidden">
                   <div className="absolute top-0 right-0 w-32 h-32 bg-primary/10 rounded-full blur-3xl -mr-16 -mt-16"></div>
                   <h3 className="text-xl font-bold mb-4">Kenapa SEO Penting di Era AI?</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Dengan munculnya AI Search (SGE, Perplexity, Gemini), optimasi website tidak lagi hanya tentang kata kunci. Kini, struktur data dan kutipan (citations) menjadi kunci utama agar brand Anda direkomendasikan oleh asisten AI.
                   </p>
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold text-center">Frequently Asked Questions (FAQ)</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {[
                    { q: "Apa itu GEO Optimizer?", a: "GEO (Generative Engine Optimization) adalah teknik untuk membuat konten Anda lebih mudah dipahami dan direkomendasikan oleh mesin pencari berbasis AI seperti ChatGPT dan Google SGE." },
                    { q: "Apakah alat ini gratis digunakan?", a: "Ya, SEO Toolbox Pro adalah suite alat SEO gratis yang dapat digunakan tanpa biaya langganan." },
                    { q: "Bagaimana cara kerja Broken Link Checker?", a: "Kami memindai halaman Anda melalui proxy serverless untuk mengecek status kode HTTP setiap link (200 OK, 404 Not Found, dll)." },
                    { q: "Apakah data saya disimpan di server?", a: "Tidak. Semua data input Anda diproses di sisi klien dan hanya disimpan sementara di LocalStorage browser Anda." }
                  ].map((faq, i) => (
                    <div key={i} className="bg-card p-6 rounded-2xl border shadow-sm hover:shadow-md transition-all">
                      <h4 className="font-bold mb-2 flex gap-2">
                        <span className="text-primary">Q:</span> {faq.q}
                      </h4>
                      <p className="text-sm text-muted-foreground">
                        <span className="font-bold text-foreground">A:</span> {faq.a}
                      </p>
                    </div>
                  ))}
                </div>
              </section>

              <section className="space-y-6">
                <h2 className="text-2xl font-bold">Glosarium SEO & AI</h2>
                <p className="text-sm text-muted-foreground italic">Pahami istilah kunci untuk optimasi masa depan.</p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[
                    { t: "E-E-A-T", d: "Experience, Expertise, Authoritativeness, Trustworthiness." },
                    { t: "JSON-LD", d: "Format data terstruktur untuk mesin pencari." },
                    { t: "LSI Keywords", d: "Kata kunci yang secara semantik berhubungan." },
                    { t: "Semantic Search", d: "Pencarian berdasarkan makna dan niat pengguna." },
                    { t: "SGE", d: "Search Generative Experience oleh Google." },
                    { t: "Canonical", d: "Sinyal untuk menghindari duplikasi konten." },
                    { t: "Core Web Vitals", d: "Metrik pengalaman pengguna dari Google." },
                    { t: "Structured Data", d: "Cara memberikan info eksplisit ke crawler." }
                  ].map((item, i) => (
                    <div key={i} className="p-4 rounded-xl border bg-card/50">
                      <div className="font-bold text-primary text-xs mb-1">{item.t}</div>
                      <p className="text-[10px] text-muted-foreground leading-tight">{item.d}</p>
                    </div>
                  ))}
                </div>
              </section>

              <footer className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                <div className="flex flex-col gap-1 text-center md:text-left">
                  <p className="font-bold text-foreground">SEO Toolbox Pro © 2026</p>
                  <p>Developed with ❤️ for the SEO Community.</p>
                  <div className="flex justify-center md:justify-start gap-4 mt-2">
                    <span className="text-[10px] bg-green-500/10 text-green-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">SSL Secured</span>
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-2 py-0.5 rounded-full font-bold uppercase tracking-widest">Mobile Ready</span>
                  </div>
                </div>
                <div className="flex flex-col items-center md:items-end gap-4">
                  <div className="flex gap-4">
                    <a href="#" className="hover:text-primary transition-all hover:scale-110">Facebook</a>
                    <a href="#" className="hover:text-primary transition-all hover:scale-110">Twitter</a>
                    <a href="#" className="hover:text-primary transition-all hover:scale-110">LinkedIn</a>
                  </div>
                  <div className="flex gap-6 text-[11px]">
                    <Link href="/privacy" className="hover:text-foreground">Privacy Policy</Link>
                    <Link href="/terms" className="hover:text-foreground">Terms</Link>
                    <Link href="/contact" className="hover:text-foreground">Contact</Link>
                  </div>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
