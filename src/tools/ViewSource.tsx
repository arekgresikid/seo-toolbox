import { useState } from 'react';
import { Code, Search, Loader2, Copy, Check, Download, FileCode, Maximize2 } from 'lucide-react';
import toast from 'react-hot-toast';

const ViewSource = () => {
  const [url, setUrl] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [sourceCode, setSourceCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [stats, setStats] = useState({ size: 0, lines: 0 });

  const fetchSource = async () => {
    if (!url) {
      toast.error('Please enter a URL');
      return;
    }

    setIsFetching(true);
    setSourceCode('');

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data: any = await response.json();

      if (data.error) {
        throw new Error(data.error);
      }

      const code = data.content;
      setSourceCode(code);
      setStats({
        size: new Blob([code]).size,
        lines: code.split('\n').length
      });
      toast.success('Source code fetched!');
    } catch (error: any) {
      toast.error(error.message || 'Failed to fetch source code');
    } finally {
      setIsFetching(false);
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(sourceCode);
    setCopied(true);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const downloadSource = () => {
    const blob = new Blob([sourceCode], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'source.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Code className="h-6 w-6 text-primary" /> View Source
        </h2>
        <p className="text-muted-foreground">View and analyze the raw HTML source code of any website.</p>
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
            onClick={fetchSource}
            disabled={isFetching || !url}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isFetching ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Get Source'}
          </button>
        </div>
      </div>

      {sourceCode ? (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4">
          <div className="flex flex-wrap gap-4 items-center justify-between bg-muted/30 p-4 rounded-xl border">
            <div className="flex gap-6">
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">File Size</span>
                <span className="text-sm font-black">{(stats.size / 1024).toFixed(2)} KB</span>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] uppercase font-bold text-muted-foreground">Total Lines</span>
                <span className="text-sm font-black">{stats.lines.toLocaleString()}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyToClipboard}
                className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                {copied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                {copied ? 'Copied' : 'Copy Code'}
              </button>
              <button
                onClick={downloadSource}
                className="flex items-center gap-2 px-4 py-2 bg-background border rounded-lg text-sm font-medium hover:bg-accent transition-colors"
              >
                <Download className="h-4 w-4" />
                Download
              </button>
            </div>
          </div>

          <div className="relative group">
            <div className="absolute top-4 right-4 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
               <div className="bg-background/80 backdrop-blur border rounded-md p-1 flex gap-1 shadow-xl">
                  <button className="p-1.5 hover:bg-accent rounded text-muted-foreground" title="Full Screen">
                    <Maximize2 className="h-4 w-4" />
                  </button>
               </div>
            </div>
            <div className="bg-zinc-950 rounded-xl border border-white/10 overflow-hidden shadow-2xl">
              <div className="flex items-center justify-between px-4 py-2 bg-zinc-900 border-b border-white/5">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/40" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/40" />
                  <div className="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/40" />
                </div>
                <div className="flex items-center gap-2">
                  <FileCode className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest font-bold">Raw HTML</span>
                </div>
              </div>
              <pre className="p-6 overflow-auto max-h-[600px] text-xs font-mono text-zinc-300 custom-scrollbar selection:bg-primary selection:text-primary-foreground leading-relaxed">
                <code>{sourceCode}</code>
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20 space-y-4">
           <Code className="h-12 w-12 opacity-10" />
           <div className="text-center px-6">
             <p className="font-bold">Ready to inspect</p>
             <p className="text-xs">Paste a URL to see its raw HTML source code.</p>
           </div>
        </div>
      )}
    </div>
  );
};

export default ViewSource;
