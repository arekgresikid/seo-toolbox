'use client';

import React, { useState } from 'react';
import { Repeat, ArrowRight, CheckCircle, Search, Loader2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';

interface RedirectStep {
  url: string;
  status: number;
}

const RedirectChecker = () => {
  const [url, setUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [steps, setSteps] = useState<RedirectStep[]>([]);

  const checkRedirects = async () => {
    if (!url) return;
    setIsChecking(true);
    setSteps([]);
    
    let currentUrl = url;
    const history: RedirectStep[] = [];
    const maxRedirects = 10;
    
    try {
      while (history.length < maxRedirects) {
        const proxyUrl = `/api/proxy?url=${encodeURIComponent(currentUrl)}`;
        const response = await fetch(proxyUrl);
        const data = await response.json();
        
        history.push({ url: currentUrl, status: data.status });
        
        if (data.status >= 300 && data.status < 400 && data.location) {
          // Normalize relative location
          if (data.location.startsWith('/')) {
            const base = new URL(currentUrl);
            currentUrl = `${base.origin}${data.location}`;
          } else if (!data.location.startsWith('http')) {
             const base = new URL(currentUrl);
             currentUrl = new URL(data.location, base).href;
          } else {
            currentUrl = data.location;
          }
        } else {
          break;
        }
      }
      setSteps(history);
      if (history.length === maxRedirects) {
        toast.error('Possible redirect loop detected');
      } else {
        toast.success('Redirect trace complete');
      }
    } catch (error) {
      toast.error('Failed to trace redirects');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Redirect Checker (Trace)</h2>
        <p className="text-muted-foreground">Trace the full redirect path of a URL to find redirect chains and loops.</p>
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
            onClick={checkRedirects}
            disabled={isChecking || !url}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Trace URL'}
          </button>
        </div>
      </div>

      {steps.length > 0 && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="space-y-2">
            {steps.map((step, index) => (
              <div key={index} className="flex flex-col items-center">
                <div className={`w-full p-4 rounded-xl border flex items-center justify-between ${
                  step.status >= 300 && step.status < 400 ? 'bg-yellow-500/5 border-yellow-500/20' : 
                  step.status >= 200 && step.status < 300 ? 'bg-green-500/5 border-green-500/20' : 
                  'bg-red-500/5 border-red-500/20'
                }`}>
                  <div className="flex items-center gap-3">
                    <div className={`h-8 w-8 rounded-full flex items-center justify-center text-xs font-bold ${
                      step.status >= 300 && step.status < 400 ? 'bg-yellow-500 text-white' : 
                      step.status >= 200 && step.status < 300 ? 'bg-green-500 text-white' : 
                      'bg-red-500 text-white'
                    }`}>
                      {step.status}
                    </div>
                    <span className="text-sm font-medium truncate max-w-[200px] md:max-w-md">{step.url}</span>
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                    {step.status >= 300 && step.status < 400 ? 'Redirect' : 
                     step.status >= 200 && step.status < 300 ? 'Success' : 'Error'}
                  </span>
                </div>
                {index < steps.length - 1 && (
                  <div className="h-8 w-0.5 bg-muted flex items-center justify-center">
                    <ArrowRight className="h-4 w-4 text-muted rotate-90" />
                  </div>
                )}
              </div>
            ))}
          </div>

          {steps.length > 2 && (
            <div className="p-4 rounded-lg bg-red-500/5 border border-red-500/20 flex gap-3 text-sm text-red-500">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <p><strong>SEO Warning:</strong> Long redirect chains (3+ steps) can slow down page speed and waste crawl budget. Try to link directly to the final destination.</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RedirectChecker;
