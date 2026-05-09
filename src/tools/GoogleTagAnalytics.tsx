'use client';

import React, { useState } from 'react';
import { Copy, FileCode, CheckCircle, Info, ExternalLink } from 'lucide-react';
import toast from 'react-hot-toast';

const GoogleTagAnalytics = () => {
  const [gaId, setGaId] = useState('');
  const [gtmId, setGtmId] = useState('');

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Snippet copied!');
  };

  const gaSnippet = `<!-- Google Analytics (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=${gaId}"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', '${gaId}');
</script>`;

  const gtmHeadSnippet = `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','${gtmId}');</script>
<!-- End Google Tag Manager -->`;

  const gtmBodySnippet = `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=${gtmId}"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Google Tag & Analytics Generator</h2>
        <p className="text-muted-foreground">Generate tracking snippets for Google Analytics 4 and Google Tag Manager.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-orange-500/10 text-orange-600 flex items-center justify-center font-bold">GA</div>
            <h3 className="font-bold text-lg">Google Analytics 4</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Measurement ID</label>
            <input
              type="text"
              value={gaId}
              onChange={(e) => setGaId(e.target.value)}
              placeholder="G-XXXXXXXXXX"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-2">
            <p className="flex items-center gap-1 font-semibold text-foreground">
              <Info className="h-3 w-3" /> How to find:
            </p>
            <p>Admin → Data Streams → Select Stream → Measurement ID.</p>
          </div>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="h-8 w-8 rounded-lg bg-blue-500/10 text-blue-600 flex items-center justify-center font-bold">GTM</div>
            <h3 className="font-bold text-lg">Google Tag Manager</h3>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium">Container ID</label>
            <input
              type="text"
              value={gtmId}
              onChange={(e) => setGtmId(e.target.value)}
              placeholder="GTM-XXXXXXX"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
          <div className="p-4 rounded-lg bg-muted/50 text-xs text-muted-foreground space-y-2">
            <p className="flex items-center gap-1 font-semibold text-foreground">
              <Info className="h-3 w-3" /> How to find:
            </p>
            <p>In your GTM Workspace, it's displayed at the top right header.</p>
          </div>
        </div>
      </div>

      <div className="space-y-6">
        {gaId && (
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden animate-in fade-in slide-in-from-bottom-2">
            <div className="px-6 py-3 border-b flex justify-between items-center bg-muted/30">
              <h4 className="font-bold text-sm">Google Analytics Snippet (Paste in &lt;head&gt;)</h4>
              <button onClick={() => copyCode(gaSnippet)} className="text-xs flex items-center gap-1 text-primary hover:underline">
                <Copy className="h-3 w-3" /> Copy Snippet
              </button>
            </div>
            <pre className="p-6 text-xs overflow-x-auto leading-relaxed bg-zinc-950 text-zinc-50">
              <code>{gaSnippet}</code>
            </pre>
          </div>
        )}

        {gtmId && (
          <div className="space-y-4 animate-in fade-in slide-in-from-bottom-2">
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b flex justify-between items-center bg-muted/30">
                <h4 className="font-bold text-sm">GTM Code 1 (Paste in &lt;head&gt;)</h4>
                <button onClick={() => copyCode(gtmHeadSnippet)} className="text-xs flex items-center gap-1 text-primary hover:underline">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <pre className="p-6 text-xs overflow-x-auto leading-relaxed bg-zinc-950 text-zinc-50">
                <code>{gtmHeadSnippet}</code>
              </pre>
            </div>

            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <div className="px-6 py-3 border-b flex justify-between items-center bg-muted/30">
                <h4 className="font-bold text-sm">GTM Code 2 (Paste in &lt;body&gt;)</h4>
                <button onClick={() => copyCode(gtmBodySnippet)} className="text-xs flex items-center gap-1 text-primary hover:underline">
                  <Copy className="h-3 w-3" /> Copy
                </button>
              </div>
              <pre className="p-6 text-xs overflow-x-auto leading-relaxed bg-zinc-950 text-zinc-50">
                <code>{gtmBodySnippet}</code>
              </pre>
            </div>
          </div>
        )}

        {!gaId && !gtmId && (
          <div className="h-40 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20">
            <FileCode className="h-8 w-8 mb-2 opacity-20" />
            <p>Enter an ID to generate snippets</p>
          </div>
        )}
      </div>

      <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-xl flex gap-4">
        <CheckCircle className="h-6 w-6 text-blue-500 shrink-0" />
        <div className="space-y-1">
          <h4 className="font-bold">Next.js 14 Tip</h4>
          <p className="text-sm text-muted-foreground">For Next.js projects, it's recommended to use the <code>next/third-parties</code> library for better performance.</p>
          <a href="https://nextjs.org/docs/app/building-your-application/optimizing/third-party-libraries" target="_blank" rel="noreferrer" className="text-xs text-blue-500 hover:underline flex items-center gap-1">
            Read documentation <ExternalLink className="h-3 w-3" />
          </a>
        </div>
      </div>
    </div>
  );
};

export default GoogleTagAnalytics;
