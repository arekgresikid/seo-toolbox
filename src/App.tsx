import React, { useState, useRef, useEffect } from 'react';
import Header from './components/layout/Header';
import Sidebar from './components/layout/Sidebar';
import MetaTagGenerator from './tools/MetaTagGenerator';
import SitemapGenerator from './tools/SitemapGenerator';
import RobotsGenerator from './tools/RobotsGenerator';
import GoogleTagAnalytics from './tools/GoogleTagAnalytics';
import SchemaMarkupGenerator from './tools/SchemaMarkupGenerator';
import HreflangCanonical from './tools/HreflangCanonical';
import MobileFriendlyTest from './tools/MobileFriendlyTest';
import PageSpeedInsights from './tools/PageSpeedInsights';
import StructuredDataTester from './tools/StructuredDataTester';
import BrokenLinkChecker from './tools/BrokenLinkChecker';
import RedirectChecker from './tools/RedirectChecker';
import KeywordDensity from './tools/KeywordDensity';
import PwaGenerator from './tools/PwaGenerator';
import SocialShareGenerator from './tools/SocialShareGenerator';
import ImageSeoAnalyzer from './tools/ImageSeoAnalyzer';
import GeoOptimizer from './tools/GeoOptimizer';
import { ToolType } from './types';
import { Menu } from 'lucide-react';

function App() {
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

            {/* Footer Section */}
            <div className="pt-20 pb-10 border-t space-y-16">
              <section className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
                <div className="space-y-4">
                  <h2 className="text-3xl font-black tracking-tight">Optimasi Website Anda ke Level Berikutnya</h2>
                  <p className="text-muted-foreground leading-relaxed">
                    SEO Toolbox Pro menyediakan 16+ alat canggih yang dirancang untuk membantu pengembang, pemasar, dan pemilik bisnis meningkatkan visibilitas website mereka di mesin pencari tradisional seperti Google.
                  </p>
                </div>
                <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
                   <h3 className="text-xl font-bold mb-4">Kenapa SEO Penting di Era AI?</h3>
                   <p className="text-sm text-muted-foreground leading-relaxed">
                     Optimasi website tidak lagi hanya tentang kata kunci. Kini, struktur data menjadi kunci utama agar brand Anda direkomendasikan oleh asisten AI.
                   </p>
                </div>
              </section>

              <footer className="pt-10 border-t flex flex-col md:flex-row justify-between items-center gap-6 text-sm text-muted-foreground">
                <p className="font-bold text-foreground">SEO Toolbox Pro © 2026</p>
                <div className="flex gap-6 text-[11px]">
                  <a href="#" className="hover:text-foreground">Privacy Policy</a>
                  <a href="#" className="hover:text-foreground">Terms</a>
                  <a href="#" className="hover:text-foreground">Contact</a>
                </div>
              </footer>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
