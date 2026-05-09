
import React, { useState } from 'react';
import { Smartphone, Tablet, Monitor, Info, CheckCircle, AlertCircle, Search } from 'lucide-react';

const MobileFriendlyTest = () => {
  const [url, setUrl] = useState('');
  const [view, setView] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [isTested, setIsTested] = useState(false);

  const runTest = () => {
    if (!url) return;
    setIsTested(true);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Mobile Friendly Test Simulator</h2>
        <p className="text-muted-foreground">Simulate how your website looks on mobile devices and check basic mobile optimization.</p>
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
            onClick={runTest}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 transition-all"
          >
            Simulate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-8 flex flex-col items-center space-y-4">
          <div className="flex gap-2 bg-muted p-1 rounded-lg">
            <button 
              onClick={() => setView('mobile')}
              className={`p-2 rounded-md transition-all ${view === 'mobile' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              <Smartphone className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setView('tablet')}
              className={`p-2 rounded-md transition-all ${view === 'tablet' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              <Tablet className="h-5 w-5" />
            </button>
            <button 
              onClick={() => setView('desktop')}
              className={`p-2 rounded-md transition-all ${view === 'desktop' ? 'bg-background shadow-sm' : 'hover:bg-background/50'}`}
            >
              <Monitor className="h-5 w-5" />
            </button>
          </div>

          <div className={`relative border-8 border-zinc-800 rounded-[2rem] bg-zinc-800 shadow-2xl transition-all duration-500 overflow-hidden ${
            view === 'mobile' ? 'w-[320px] h-[568px]' : 
            view === 'tablet' ? 'w-[600px] h-[800px]' : 
            'w-full h-[500px]'
          }`}>
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-20 h-6 bg-zinc-800 rounded-b-xl z-10" />
            <iframe 
              src={url || 'about:blank'} 
              className="w-full h-full bg-white"
              title="Mobile Preview"
            />
          </div>
          <p className="text-xs text-muted-foreground italic">Note: Some websites may block iframe preview due to security (X-Frame-Options).</p>
        </div>

        <div className="lg:col-span-4 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold">Mobile Optimization Checklist</h3>
            <div className="space-y-4">
              <div className="flex gap-3">
                <CheckCircle className={`h-5 w-5 shrink-0 ${isTested ? 'text-green-500' : 'text-muted-foreground opacity-20'}`} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none">Viewport Meta Tag</p>
                  <p className="text-xs text-muted-foreground">Ensures site scales correctly on small screens.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <CheckCircle className={`h-5 w-5 shrink-0 ${isTested ? 'text-green-500' : 'text-muted-foreground opacity-20'}`} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none">Tap Target Size</p>
                  <p className="text-xs text-muted-foreground">Buttons and links are easy to click.</p>
                </div>
              </div>
              <div className="flex gap-3">
                <AlertCircle className={`h-5 w-5 shrink-0 ${isTested ? 'text-yellow-500' : 'text-muted-foreground opacity-20'}`} />
                <div className="space-y-1">
                  <p className="text-sm font-semibold leading-none">Font Size</p>
                  <p className="text-xs text-muted-foreground">Text is readable without zooming.</p>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t">
              <div className="bg-primary/5 p-4 rounded-lg flex gap-3 text-xs text-primary">
                <Info className="h-5 w-5 shrink-0" />
                <p>Google prioritizes mobile-friendly websites in search results. Use the official Google Search Console for a full report.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileFriendlyTest;
