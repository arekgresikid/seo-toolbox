
import React, { useState } from 'react';
import { Copy, Download, Plus, Trash2, ShieldCheck, CheckCircle, XCircle, Search, Loader2 } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { RobotsConfig } from '../types';
import { generateRobotsTxt } from '../utils/robotsUtils';
import toast from 'react-hot-toast';

const initialConfig: RobotsConfig = {
  userAgent: '*',
  allow: [],
  disallow: ['/admin', '/wp-admin', '/private'],
  sitemap: '',
  crawlDelay: '',
};

const RobotsGenerator = () => {
  const [config, setConfig] = useLocalStorage<RobotsConfig>('seo-robots-config', initialConfig);
  const [activeTab, setActiveTab] = useState<'generate' | 'check'>('generate');
  const [checkUrl, setCheckUrl] = useState('');
  const [isChecking, setIsChecking] = useState(false);
  const [checkResult, setCheckResult] = useState<{ exists: boolean; content: string } | null>(null);

  const addPath = (type: 'allow' | 'disallow') => {
    setConfig({ ...config, [type]: [...config[type], ''] });
  };

  const removePath = (type: 'allow' | 'disallow', index: number) => {
    const newPaths = [...config[type]];
    newPaths.splice(index, 1);
    setConfig({ ...config, [type]: newPaths });
  };

  const updatePath = (type: 'allow' | 'disallow', index: number, value: string) => {
    const newPaths = [...config[type]];
    newPaths[index] = value;
    setConfig({ ...config, [type]: newPaths });
  };

  const copyToClipboard = () => {
    const txt = generateRobotsTxt(config);
    navigator.clipboard.writeText(txt);
    toast.success('Robots.txt copied!');
  };

  const downloadTxt = () => {
    const txt = generateRobotsTxt(config);
    const blob = new Blob([txt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'robots.txt';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('Robots.txt downloaded!');
  };

  const checkRobots = async () => {
    if (!checkUrl) return;
    setIsChecking(true);
    setCheckResult(null);

    try {
      // Use internal API proxy
      const robotsUrl = checkUrl.endsWith('/robots.txt') ? checkUrl : `${checkUrl.replace(/\/$/, '')}/robots.txt`;
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(robotsUrl)}`;
      
      const response = await fetch(proxyUrl);
      const data = await response.json();
      if (response.ok) {
        setCheckResult({ exists: true, content: data.content });
      } else {
        setCheckResult({ exists: false, content: '' });
      }
    } catch (error) {
      setCheckResult({ exists: false, content: '' });
      toast.error('Could not fetch robots.txt');
    } finally {
      setIsChecking(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold">Robots.txt Generator & Checker</h2>
          <p className="text-muted-foreground">Manage how search engine bots crawl your website.</p>
        </div>
        <div className="flex border rounded-lg overflow-hidden">
          <button
            onClick={() => setActiveTab('generate')}
            className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'generate' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
          >
            Generator
          </button>
          <button
            onClick={() => setActiveTab('check')}
            className={`px-4 py-2 text-sm font-medium transition-all ${activeTab === 'check' ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground hover:bg-accent'}`}
          >
            Checker
          </button>
        </div>
      </div>

      {activeTab === 'generate' ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="lg:col-span-7 space-y-6">
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
              <h3 className="font-bold border-b pb-2 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" /> Settings
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">User-agent</label>
                  <input
                    type="text"
                    value={config.userAgent}
                    onChange={(e) => setConfig({ ...config, userAgent: e.target.value })}
                    placeholder="*"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Crawl-delay (seconds)</label>
                  <input
                    type="number"
                    value={config.crawlDelay}
                    onChange={(e) => setConfig({ ...config, crawlDelay: e.target.value })}
                    placeholder="e.g. 5"
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Sitemap URL</label>
                <input
                  type="url"
                  value={config.sitemap}
                  onChange={(e) => setConfig({ ...config, sitemap: e.target.value })}
                  placeholder="https://example.com/sitemap.xml"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-red-500">Disallowed Paths</h4>
                  <button onClick={() => addPath('disallow')} className="text-xs bg-red-500/10 text-red-500 px-2 py-1 rounded-md hover:bg-red-500/20 transition-all flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {config.disallow.map((path, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => updatePath('disallow', index, e.target.value)}
                        placeholder="/path-to-block"
                        className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button onClick={() => removePath('disallow', index)} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="space-y-4 pt-4">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm font-bold text-green-500">Allowed Paths</h4>
                  <button onClick={() => addPath('allow')} className="text-xs bg-green-500/10 text-green-500 px-2 py-1 rounded-md hover:bg-green-500/20 transition-all flex items-center gap-1">
                    <Plus className="h-3 w-3" /> Add
                  </button>
                </div>
                <div className="space-y-2">
                  {config.allow.map((path, index) => (
                    <div key={index} className="flex gap-2">
                      <input
                        type="text"
                        value={path}
                        onChange={(e) => updatePath('allow', index, e.target.value)}
                        placeholder="/path-to-allow"
                        className="flex-1 rounded-md border bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                      />
                      <button onClick={() => removePath('allow', index)} className="text-muted-foreground hover:text-red-500">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 space-y-4">
            <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24">
              <h3 className="font-bold mb-4">Preview Robots.txt</h3>
              <div className="relative group">
                <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed min-h-[200px]">
                  <code>{generateRobotsTxt(config)}</code>
                </pre>
                <div className="absolute top-4 right-4 flex gap-2">
                  <button onClick={copyToClipboard} className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
                    <Copy className="h-4 w-4" />
                  </button>
                  <button onClick={downloadTxt} className="p-2 bg-white/10 hover:bg-white/20 rounded-md transition-colors">
                    <Download className="h-4 w-4" />
                  </button>
                </div>
              </div>
              <div className="mt-4 p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 text-xs text-blue-500 space-y-2">
                <p><strong>Tip:</strong> Placing <code>Disallow: /</code> will block your entire site from search engines. Use with caution!</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold">Robots.txt Checker</h3>
            <p className="text-sm text-muted-foreground">Enter a website URL to check its robots.txt file.</p>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <input
                  type="url"
                  value={checkUrl}
                  onChange={(e) => setCheckUrl(e.target.value)}
                  placeholder="https://example.com"
                  className="w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <button
                onClick={checkRobots}
                disabled={isChecking || !checkUrl}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
              >
                {isChecking ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Check'}
              </button>
            </div>
          </div>

          {checkResult && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-4 space-y-4">
                <div className={`p-6 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center space-y-3 ${checkResult.exists ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                  {checkResult.exists ? (
                    <>
                      <CheckCircle className="h-12 w-12 text-green-500" />
                      <div>
                        <h4 className="font-bold text-lg">Robots.txt Found</h4>
                        <p className="text-sm text-muted-foreground">The file is accessible at the site root.</p>
                      </div>
                    </>
                  ) : (
                    <>
                      <XCircle className="h-12 w-12 text-red-500" />
                      <div>
                        <h4 className="font-bold text-lg">Not Found</h4>
                        <p className="text-sm text-muted-foreground">We couldn't find a robots.txt file.</p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {checkResult.exists && (
                <div className="lg:col-span-8">
                  <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                    <div className="px-6 py-3 border-b bg-muted/30 font-bold text-sm">File Content</div>
                    <pre className="p-6 text-xs overflow-x-auto leading-relaxed bg-zinc-950 text-zinc-50 max-h-[400px]">
                      <code>{checkResult.content}</code>
                    </pre>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RobotsGenerator;
