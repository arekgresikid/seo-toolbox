'use client';

import React, { useState } from 'react';
import { Link2, Search, CheckCircle, XCircle, Loader2, AlertTriangle, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

interface LinkStatus {
  url: string;
  text: string;
  status: number | string;
  loading: boolean;
}

const BrokenLinkChecker = () => {
  const [url, setUrl] = useState('');
  const [links, setLinks] = useState<LinkStatus[]>([]);
  const [isScanning, setIsScanning] = useState(false);

  const scanLinks = async () => {
    if (!url) return;
    setIsScanning(true);
    setLinks([]);

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const html = data.content;
      
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const base = new URL(url);
      
      const anchorTags = Array.from(doc.querySelectorAll('a'));
      const detectedLinks: LinkStatus[] = anchorTags
        .map((a): LinkStatus | null => {
          const href = a.getAttribute('href');
          if (!href) return null;
          try {
            const absoluteUrl = new URL(href, base).href;
            return {
              url: absoluteUrl,
              text: a.innerText.trim() || '(No Text)',
              status: 'Pending',
              loading: false
            };
          } catch {
            return null;
          }
        })
        .filter((l): l is LinkStatus => l !== null && l.url.startsWith('http'))
        .slice(0, 20);

      setLinks(detectedLinks);
      toast.success(`Found ${detectedLinks.length} links. Starting validation...`);

      // Sequential validation to avoid overwhelming the proxy
      for (let i = 0; i < detectedLinks.length; i++) {
        setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, loading: true } : l));
        
        try {
          const checkProxy = `/api/proxy?url=${encodeURIComponent(detectedLinks[i].url)}`;
          const checkRes = await fetch(checkProxy, { method: 'HEAD' });
          const status = checkRes.status;
          
          setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, status, loading: false } : l));
        } catch {
          setLinks(prev => prev.map((l, idx) => idx === i ? { ...l, status: 'Error', loading: false } : l));
        }
      }
      
      toast.success('Link scan complete!');
    } catch (error) {
      toast.error('Failed to scan website');
    } finally {
      setIsScanning(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Broken Link Checker</h2>
        <p className="text-muted-foreground">Scan a page for broken links (404s) and validation errors.</p>
      </div>

      <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://example.com"
              className="w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <button
            onClick={scanLinks}
            disabled={isScanning || !url}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Scan Page'}
          </button>
        </div>
      </div>

      {links.length > 0 && (
        <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-4">
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-6 py-3">Link Text</th>
                  <th className="px-6 py-3">URL</th>
                  <th className="px-6 py-3 w-32">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {links.map((link, index) => (
                  <tr key={index} className="hover:bg-accent/5 transition-colors">
                    <td className="px-6 py-4 font-medium">{link.text}</td>
                    <td className="px-6 py-4 text-muted-foreground truncate max-w-[300px]">
                      <a href={link.url} target="_blank" rel="noreferrer" className="hover:text-primary flex items-center gap-1">
                        {link.url} <ExternalLink className="h-3 w-3" />
                      </a>
                    </td>
                    <td className="px-6 py-4">
                      {link.loading ? (
                        <div className="flex items-center gap-2 text-primary animate-pulse">
                          <Loader2 className="h-3 w-3 animate-spin" /> Checking
                        </div>
                      ) : typeof link.status === 'number' ? (
                        link.status >= 200 && link.status < 300 ? (
                          <div className="flex items-center gap-1.5 text-green-500 font-bold">
                            <CheckCircle className="h-4 w-4" /> {link.status}
                          </div>
                        ) : (
                          <div className="flex items-center gap-1.5 text-red-500 font-bold">
                            <XCircle className="h-4 w-4" /> {link.status}
                          </div>
                        )
                      ) : (
                        <div className="flex items-center gap-1.5 text-muted-foreground">
                          <AlertTriangle className="h-4 w-4" /> {link.status}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BrokenLinkChecker;
