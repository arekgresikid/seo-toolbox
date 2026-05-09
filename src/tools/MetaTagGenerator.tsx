'use client';

import React, { useState, useEffect } from 'react';
import { Copy, Download, RefreshCw, CheckCircle, AlertCircle, Info, ExternalLink, Globe, Loader2, Image as ImageIcon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { useSEOScore } from '../hooks/useSEOScore';
import { MetaTags } from '../types';
import { generateMetaHtml } from '../utils/seoUtils';
import toast from 'react-hot-toast';

const initialMeta: MetaTags = {
  title: '',
  description: '',
  keywords: '',
  author: '',
  robots: 'index, follow',
  canonical: '',
  ogTitle: '',
  ogDescription: '',
  ogImage: '',
  ogUrl: '',
  ogType: 'website',
  ogSiteName: '',
  ogLocale: 'en_US',
  fbAppId: '',
  ogImageWidth: '1200',
  ogImageHeight: '630',
  twitterCard: 'summary_large_image',
  twitterTitle: '',
  twitterDescription: '',
  twitterImage: '',
};

const MetaTagGenerator = () => {
  const [meta, setMeta] = useLocalStorage<MetaTags>('seo-meta-tags', initialMeta);
  const { score, issues } = useSEOScore(meta);
  const [activeTab, setActiveTab] = useState<'edit' | 'preview' | 'code'>('edit');
  const [previewPlatform, setPreviewPlatform] = useState<'google' | 'facebook' | 'twitter' | 'whatsapp'>('google');
  const [importUrl, setImportUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);

  const fetchFromUrl = async () => {
    if (!importUrl) return;
    setIsFetching(true);
    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(importUrl)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || 'Failed to fetch');
      
      const html = data.content;
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');

      const getMeta = (name: string, isProperty = false) => {
        const selector = isProperty ? `meta[property="${name}"]` : `meta[name="${name}"]`;
        return doc.querySelector(selector)?.getAttribute('content') || '';
      };

        setMeta({
          title: doc.title || '',
          description: getMeta('description'),
          keywords: getMeta('keywords'),
          author: getMeta('author'),
          robots: getMeta('robots') || 'index, follow',
          canonical: doc.querySelector('link[rel="canonical"]')?.getAttribute('href') || '',
          ogTitle: getMeta('og:title', true),
          ogDescription: getMeta('og:description', true),
          ogImage: getMeta('og:image', true),
          ogUrl: getMeta('og:url', true),
          ogType: getMeta('og:type', true) || 'website',
          ogSiteName: getMeta('og:site_name', true),
          ogLocale: getMeta('og:locale', true) || 'en_US',
          fbAppId: getMeta('fb:app_id', true),
          ogImageWidth: getMeta('og:image:width', true) || '1200',
          ogImageHeight: getMeta('og:image:height', true) || '630',
          twitterCard: getMeta('twitter:card') || 'summary_large_image',
          twitterTitle: getMeta('twitter:title'),
          twitterDescription: getMeta('twitter:description'),
          twitterImage: getMeta('twitter:image'),
        });

      toast.success('Meta tags detected successfully!');
    } catch (error) {
      toast.error('Could not fetch website data. Please check the URL or try another.');
    } finally {
      setIsFetching(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMeta((prev) => ({ ...prev, [name]: value }));
  };

  const copyToClipboard = () => {
    const code = generateMetaHtml(meta);
    navigator.clipboard.writeText(code);
    toast.success('Copied to clipboard!');
  };

  const downloadHtml = () => {
    const code = generateMetaHtml(meta);
    const blob = new Blob([code], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'meta-tags.html';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('File downloaded!');
  };

  const autoFillSocial = () => {
    setMeta(prev => ({
      ...prev,
      ogTitle: prev.ogTitle || prev.title,
      ogDescription: prev.ogDescription || prev.description,
      twitterTitle: prev.twitterTitle || prev.title,
      twitterDescription: prev.twitterDescription || prev.description,
    }));
    toast.success('Social tags synced with basic tags');
  };

  const getDisplayDomain = () => {
    try {
      const urlToParse = meta.canonical || meta.ogUrl || importUrl || 'https://example.com';
      return new URL(urlToParse).hostname;
    } catch {
      return 'example.com';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Meta Tag Generator</h2>
          <p className="text-muted-foreground">Generate and optimize meta tags for your website.</p>
        </div>
        <div className="flex items-center gap-4 bg-card p-3 rounded-xl border shadow-sm w-full md:w-auto">
          <div className="flex flex-col">
            <span className="text-xs text-muted-foreground uppercase font-bold tracking-wider">SEO Score</span>
            <div className="flex items-center gap-2">
              <span className={`text-2xl font-black ${score > 80 ? 'text-green-500' : score > 50 ? 'text-yellow-500' : 'text-red-500'}`}>
                {score}/100
              </span>
              <div className="w-24 h-2 bg-muted rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${score > 80 ? 'bg-green-500' : score > 50 ? 'bg-yellow-500' : 'bg-red-500'}`} 
                  style={{ width: `${score}%` }} 
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex flex-col gap-2">
          <label className="text-sm font-bold flex items-center gap-2">
            <Globe className="h-4 w-4 text-primary" /> Import from URL
          </label>
          <div className="flex gap-2">
            <input
              type="url"
              value={importUrl}
              onChange={(e) => setImportUrl(e.target.value)}
              placeholder="https://example.com"
              className="flex-1 rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <button
              onClick={fetchFromUrl}
              disabled={isFetching || !importUrl}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze Website'}
            </button>
          </div>
          <p className="text-[10px] text-muted-foreground italic">Detect meta tags from any live website automatically.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          {/* Tabs */}
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('edit')}
              className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'edit' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              Basic Info
            </button>
            <button
              onClick={() => setActiveTab('preview')}
              className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'preview' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              SERP Preview
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'code' ? 'border-b-2 border-primary text-primary' : 'text-muted-foreground hover:text-foreground'}`}
            >
              HTML Code
            </button>
          </div>

          {activeTab === 'edit' && (
            <div className="space-y-4 bg-card p-6 rounded-xl border shadow-sm animate-in fade-in slide-in-from-bottom-4">
              <div className="space-y-4">
                <h3 className="font-semibold text-lg border-b pb-2">Basic Meta Tags</h3>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Page Title</label>
                    <span className={`text-xs ${meta.title.length > 60 || meta.title.length < 50 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {meta.title.length} characters (Optimal: 50-60)
                    </span>
                  </div>
                  <input
                    type="text"
                    name="title"
                    value={meta.title}
                    onChange={handleInputChange}
                    placeholder="Enter page title"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Description</label>
                    <span className={`text-xs ${meta.description.length > 160 || meta.description.length < 120 ? 'text-yellow-500' : 'text-green-500'}`}>
                      {meta.description.length} characters (Optimal: 120-160)
                    </span>
                  </div>
                  <textarea
                    name="description"
                    value={meta.description}
                    onChange={handleInputChange}
                    placeholder="Enter meta description"
                    rows={3}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Keywords (comma separated)</label>
                    <input
                      type="text"
                      name="keywords"
                      value={meta.keywords}
                      onChange={handleInputChange}
                      placeholder="e.g. seo, tools, web"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Robots</label>
                    <select
                      name="robots"
                      value={meta.robots}
                      onChange={handleInputChange}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="index, follow">index, follow</option>
                      <option value="noindex, follow">noindex, follow</option>
                      <option value="index, nofollow">index, nofollow</option>
                      <option value="noindex, nofollow">noindex, nofollow</option>
                    </select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium">Canonical URL</label>
                  <input
                    type="url"
                    name="canonical"
                    value={meta.canonical}
                    onChange={handleInputChange}
                    placeholder="https://example.com/page"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center border-b pb-2">
                  <h3 className="font-semibold text-lg">Social Media (Open Graph & Twitter)</h3>
                  <button 
                    onClick={autoFillSocial}
                    className="text-xs bg-primary/10 text-primary px-2 py-1 rounded hover:bg-primary/20 transition-colors flex items-center gap-1"
                  >
                    <RefreshCw className="h-3 w-3" /> Sync from Basic
                  </button>
                </div>
                
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">OG Image URL</label>
                      <input
                        type="url"
                        name="ogImage"
                        value={meta.ogImage}
                        onChange={handleInputChange}
                        placeholder="https://example.com/image.jpg"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Width (px)</label>
                        <input
                          type="text"
                          name="ogImageWidth"
                          value={meta.ogImageWidth}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                      <div className="space-y-2">
                        <label className="text-sm font-medium">Height (px)</label>
                        <input
                          type="text"
                          name="ogImageHeight"
                          value={meta.ogImageHeight}
                          onChange={handleInputChange}
                          className="w-full rounded-md border bg-background px-3 py-2 text-sm"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Site Name (WhatsApp/FB)</label>
                      <input
                        type="text"
                        name="ogSiteName"
                        value={meta.ogSiteName}
                        onChange={handleInputChange}
                        placeholder="My Website Name"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Locale</label>
                      <input
                        type="text"
                        name="ogLocale"
                        value={meta.ogLocale}
                        onChange={handleInputChange}
                        placeholder="en_US or id_ID"
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">FB App ID (Optional)</label>
                      <input
                        type="text"
                        name="fbAppId"
                        value={meta.fbAppId}
                        onChange={handleInputChange}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">OG Type</label>
                      <select
                        name="ogType"
                        value={meta.ogType}
                        onChange={handleInputChange}
                        className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      >
                        <option value="website">Website</option>
                        <option value="article">Article</option>
                        <option value="profile">Profile</option>
                        <option value="book">Book</option>
                      </select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Twitter Card</label>
                    <select
                      name="twitterCard"
                      value={meta.twitterCard}
                      onChange={handleInputChange}
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    >
                      <option value="summary">Summary</option>
                      <option value="summary_large_image">Summary Large Image</option>
                      <option value="app">App</option>
                    </select>
                  </div>
              </div>
            </div>
          )}

          {activeTab === 'preview' && (
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden flex flex-col min-h-[400px] animate-in fade-in slide-in-from-bottom-4">
              <div className="px-6 py-3 border-b bg-muted/30 flex flex-wrap gap-2">
                {[
                  { id: 'google', name: 'Google' },
                  { id: 'facebook', name: 'Facebook' },
                  { id: 'twitter', name: 'Twitter / X' },
                  { id: 'whatsapp', name: 'WhatsApp' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => setPreviewPlatform(p.id as any)}
                    className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all ${
                      previewPlatform === p.id ? 'bg-primary text-primary-foreground' : 'bg-muted hover:bg-muted/80 text-muted-foreground'
                    }`}
                  >
                    {p.name}
                  </button>
                ))}
              </div>

              <div className="p-8 flex-1 flex flex-col justify-center bg-zinc-50 dark:bg-zinc-900/50">
                {previewPlatform === 'google' && (
                  <div className="max-w-xl animate-in fade-in zoom-in-95 duration-300">
                    <div className="text-[12px] text-[#202124] dark:text-[#bdc1c6] mb-1 truncate">
                      {meta.canonical || meta.ogUrl || importUrl || 'https://example.com'}
                    </div>
                    <h3 className="text-[20px] text-[#1a0dab] dark:text-[#8ab4f8] hover:underline cursor-pointer leading-tight mb-1">
                      {meta.title || 'Your Page Title Goes Here'}
                    </h3>
                    <p className="text-[14px] text-[#4d5156] dark:text-[#bdc1c6] line-clamp-2 leading-relaxed">
                      {meta.description || 'Provide a compelling meta description to increase click-through rates in search engine results...'}
                    </p>
                  </div>
                )}

                {previewPlatform === 'facebook' && (
                  <div className="max-w-md mx-auto border rounded-sm bg-white dark:bg-[#242526] overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      {meta.ogImage ? (
                        <img src={meta.ogImage} alt="OG" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                      )}
                    </div>
                    <div className="p-3 bg-[#f0f2f5] dark:bg-[#3a3b3c] border-t">
                      <div className="text-[12px] uppercase text-[#65676b] dark:text-[#b0b3b8] mb-1 truncate">
                        {meta.ogSiteName || getDisplayDomain().toUpperCase()}
                      </div>
                      <div className="font-bold text-[16px] text-[#050505] dark:text-[#e4e6eb] line-clamp-2 leading-tight mb-1">{meta.ogTitle || meta.title || 'Social Preview Title'}</div>
                      <div className="text-[14px] text-[#65676b] dark:text-[#b0b3b8] line-clamp-1">{meta.ogDescription || meta.description || 'Social description preview content...'}</div>
                    </div>
                  </div>
                )}

                {previewPlatform === 'twitter' && (
                  <div className="max-w-md mx-auto border rounded-2xl bg-white dark:bg-black overflow-hidden shadow-sm animate-in fade-in zoom-in-95 duration-300">
                    <div className="aspect-video bg-muted flex items-center justify-center overflow-hidden">
                      {meta.twitterImage || meta.ogImage ? (
                        <img src={meta.twitterImage || meta.ogImage} alt="Twitter" className="w-full h-full object-cover" />
                      ) : (
                        <ImageIcon className="h-12 w-12 text-muted-foreground opacity-20" />
                      )}
                    </div>
                    <div className="p-3 border-t">
                      <div className="text-[13px] text-[#536471] mb-1 truncate">
                        {getDisplayDomain()}
                      </div>
                      <div className="font-bold text-[15px] text-[#0f1419] dark:text-[#e7e9ea] line-clamp-1">{meta.twitterTitle || meta.ogTitle || meta.title || 'Twitter Card Title'}</div>
                      <div className="text-[15px] text-[#536471] line-clamp-2 leading-tight mt-0.5">{meta.twitterDescription || meta.ogDescription || meta.description || 'Twitter card description content...'}</div>
                    </div>
                  </div>
                )}

                {previewPlatform === 'whatsapp' && (
                  <div className="max-w-[350px] mx-auto w-full animate-in fade-in zoom-in-95 duration-300">
                    <div className="relative bg-[#dcf8c6] dark:bg-[#056162] p-1.5 rounded-lg rounded-tl-none shadow-sm mb-4">
                      {/* Bubble Tail */}
                      <div className="absolute top-0 -left-2 w-0 h-0 border-t-[10px] border-t-[#dcf8c6] dark:border-t-[#056162] border-l-[10px] border-l-transparent"></div>
                      
                      <div className="bg-[#cfe9ba] dark:bg-[#025152] rounded overflow-hidden flex flex-col">
                        {meta.ogImage && (
                          <div className="w-full aspect-video">
                            <img src={meta.ogImage} alt="WA" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="p-3">
                          <div className="text-[14px] font-bold text-primary dark:text-[#4fc3f7] truncate mb-0.5">
                            {meta.ogTitle || meta.title || 'WhatsApp Preview'}
                          </div>
                          <div className="text-[13px] text-zinc-600 dark:text-zinc-300 line-clamp-3 leading-snug mb-1">
                            {meta.ogDescription || meta.description || 'Message preview description content goes here...'}
                          </div>
                          <div className="text-[12px] text-zinc-500 dark:text-zinc-400 truncate opacity-70 italic">
                            {getDisplayDomain()}
                          </div>
                        </div>
                      </div>
                      <div className="flex justify-end items-center gap-1 mt-1 px-1">
                        <span className="text-[10px] text-zinc-500 dark:text-zinc-300">12:34</span>
                        <svg width="16" height="11" viewBox="0 0 16 11" fill="none" className="text-blue-500"><path d="M4.5 10.5L0.5 6.5L1.9 5.1L4.5 7.7L10.6 1.6L12 3L4.5 10.5ZM16 3L8.5 10.5L7.1 9.1L14.6 1.6L16 3Z" fill="currentColor"/></svg>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'code' && (
            <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
              <div className="relative group">
                <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed max-h-[500px]">
                  <code>{generateMetaHtml(meta)}</code>
                </pre>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button 
                    onClick={copyToClipboard}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                    title="Copy to clipboard"
                  >
                    <Copy className="h-4 w-4" />
                  </button>
                  <button 
                    onClick={downloadHtml}
                    className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-md transition-colors"
                    title="Download HTML"
                  >
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3 text-sm text-blue-500">
                <Info className="h-5 w-5 shrink-0" />
                <p>Place these tags inside the <code>&lt;head&gt;</code> section of your HTML document.</p>
              </div>
            </div>
          )}
        </div>

        <div className="lg:col-span-5 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-primary" /> SEO Checklist
            </h3>
            <div className="space-y-4">
              {issues.map((issue, index) => (
                <div key={index} className={`p-4 rounded-lg border flex gap-3 ${
                  issue.type === 'error' ? 'bg-red-500/5 border-red-500/20' : 
                  issue.type === 'warning' ? 'bg-yellow-500/5 border-yellow-500/20' : 
                  'bg-green-500/5 border-green-500/20'
                }`}>
                  {issue.type === 'error' ? (
                    <AlertCircle className="h-5 w-5 text-red-500 shrink-0" />
                  ) : (
                    <Info className="h-5 w-5 text-yellow-500 shrink-0" />
                  )}
                  <div className="space-y-1">
                    <p className="font-semibold text-sm leading-none">{issue.message}</p>
                    <p className="text-xs text-muted-foreground">{issue.suggestion}</p>
                  </div>
                </div>
              ))}
              {issues.length === 0 && (
                <div className="flex flex-col items-center justify-center py-8 text-center space-y-2">
                  <CheckCircle className="h-12 w-12 text-green-500" />
                  <p className="font-bold">Excellent!</p>
                  <p className="text-sm text-muted-foreground">Your meta tags are well-optimized.</p>
                </div>
              )}
            </div>

            <div className="mt-8 pt-6 border-t space-y-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">Resources</h4>
              <a 
                href="https://developers.google.com/search/docs/appearance/snippet" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between text-sm hover:text-primary transition-colors"
              >
                Google Search Snippets <ExternalLink className="h-3 w-3" />
              </a>
              <a 
                href="https://ogp.me/" 
                target="_blank" 
                rel="noreferrer"
                className="flex items-center justify-between text-sm hover:text-primary transition-colors"
              >
                Open Graph Protocol <ExternalLink className="h-3 w-3" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetaTagGenerator;
