
import React, { useState } from 'react';
import { Copy, Download, Plus, Trash2, FileText, AlertTriangle } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { SitemapURL } from '../types';
import { generateSitemapXml } from '../utils/sitemapUtils';
import { isValidUrl } from '../utils/seoUtils';
import toast from 'react-hot-toast';

const initialUrls: SitemapURL[] = [
  { url: 'https://example.com/', priority: '1.0', changefreq: 'daily', lastmod: new Date().toISOString().split('T')[0] },
];

const SitemapGenerator = () => {
  const [urls, setUrls] = useLocalStorage<SitemapURL[]>('seo-sitemap-urls', initialUrls);
  const [view, setView] = useState<'edit' | 'preview'>('edit');

  const addUrl = () => {
    setUrls([...urls, { url: '', priority: '0.5', changefreq: 'weekly', lastmod: new Date().toISOString().split('T')[0] }]);
  };

  const removeUrl = (index: number) => {
    const newUrls = [...urls];
    newUrls.splice(index, 1);
    setUrls(newUrls);
  };

  const updateUrl = (index: number, field: keyof SitemapURL, value: string) => {
    const newUrls = [...urls];
    newUrls[index] = { ...newUrls[index], [field]: value };
    setUrls(newUrls);
  };

  const copyToClipboard = () => {
    const xml = generateSitemapXml(urls);
    navigator.clipboard.writeText(xml);
    toast.success('XML copied to clipboard!');
  };

  const downloadXml = () => {
    const xml = generateSitemapXml(urls);
    const blob = new Blob([xml], { type: 'application/xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'sitemap.xml';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Sitemap.xml downloaded!');
  };

  const handleBulkImport = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const lines = e.target.value.split('\n').filter(line => line.trim() !== '');
    const newUrls = lines.map(line => ({
      url: line.trim(),
      priority: '0.5',
      changefreq: 'weekly',
      lastmod: new Date().toISOString().split('T')[0]
    }));
    setUrls([...urls, ...newUrls]);
    toast.success(`Imported ${newUrls.length} URLs`);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Sitemap Generator</h2>
          <p className="text-muted-foreground">Create an XML sitemap for your website to help search engines index your pages.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setView('edit')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'edit' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
          >
            Edit URLs
          </button>
          <button
            onClick={() => setView('preview')}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-all ${view === 'preview' ? 'bg-primary text-primary-foreground shadow-md' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
          >
            Preview XML
          </button>
        </div>
      </div>

      {view === 'edit' ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">URL List ({urls.length})</h3>
              <button onClick={addUrl} className="flex items-center gap-2 text-sm bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all">
                <Plus className="h-4 w-4" /> Add URL
              </button>
            </div>

            <div className="overflow-x-auto border rounded-lg">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-4 py-3">URL</th>
                    <th className="px-4 py-3 w-32">Priority</th>
                    <th className="px-4 py-3 w-40">Changefreq</th>
                    <th className="px-4 py-3 w-40">Lastmod</th>
                    <th className="px-4 py-3 w-12"></th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {urls.map((item, index) => (
                    <tr key={index} className="hover:bg-accent/5 transition-colors">
                      <td className="px-4 py-2">
                        <div className="relative">
                          <input
                            type="url"
                            value={item.url}
                            onChange={(e) => updateUrl(index, 'url', e.target.value)}
                            placeholder="https://example.com/page"
                            className={`w-full bg-transparent border-none focus:ring-0 p-1 text-sm ${item.url && !isValidUrl(item.url) ? 'text-red-500' : ''}`}
                          />
                          {item.url && !isValidUrl(item.url) && (
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 text-red-500" title="Invalid URL">
                              <AlertTriangle className="h-4 w-4" />
                            </div>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.priority}
                          onChange={(e) => updateUrl(index, 'priority', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-1 text-sm"
                        >
                          {['1.0', '0.9', '0.8', '0.7', '0.6', '0.5', '0.4', '0.3', '0.2', '0.1'].map(p => (
                            <option key={p} value={p}>{p}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <select
                          value={item.changefreq}
                          onChange={(e) => updateUrl(index, 'changefreq', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-1 text-sm"
                        >
                          {['always', 'hourly', 'daily', 'weekly', 'monthly', 'yearly', 'never'].map(f => (
                            <option key={f} value={f}>{f}</option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="date"
                          value={item.lastmod}
                          onChange={(e) => updateUrl(index, 'lastmod', e.target.value)}
                          className="w-full bg-transparent border-none focus:ring-0 p-1 text-sm"
                        />
                      </td>
                      <td className="px-4 py-2 text-right">
                        <button onClick={() => removeUrl(index)} className="text-muted-foreground hover:text-red-500 p-1">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <FileText className="h-5 w-5 text-primary" /> Bulk Import
            </h3>
            <p className="text-xs text-muted-foreground">Paste multiple URLs (one per line) to add them all at once.</p>
            <textarea
              placeholder="https://example.com/page1\nhttps://example.com/page2"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary min-h-[100px]"
              onBlur={handleBulkImport}
            />
          </div>
        </div>
      ) : (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="relative group">
            <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed max-h-[600px]">
              <code>{generateSitemapXml(urls)}</code>
            </pre>
            <div className="absolute top-4 right-4 flex gap-2">
              <button 
                onClick={copyToClipboard}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                title="Copy XML"
              >
                <Copy className="h-4 w-4" />
              </button>
              <button 
                onClick={downloadXml}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors"
                title="Download Sitemap.xml"
              >
                <Download className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4 flex gap-3 text-sm text-blue-500">
            <FileText className="h-5 w-5 shrink-0" />
            <div>
              <p className="font-bold">Instructions:</p>
              <p>1. Upload this file to your website's root directory (e.g., <code>https://example.com/sitemap.xml</code>).</p>
              <p>2. Submit the URL to Google Search Console and Bing Webmaster Tools.</p>
              <p>3. Add the sitemap location to your <code>robots.txt</code> file.</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SitemapGenerator;
