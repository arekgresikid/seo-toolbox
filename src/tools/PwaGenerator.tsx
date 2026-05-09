
import React, { useState } from 'react';
import { Copy, Download, Smartphone, Layout, Info, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

const PwaGenerator = () => {
  const [data, setData] = useState({
    name: '',
    shortName: '',
    description: '',
    startUrl: '/',
    display: 'standalone',
    themeColor: '#ffffff',
    backgroundColor: '#ffffff',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setData(prev => ({ ...prev, [name]: value }));
  };

  const generateManifest = () => {
    const manifest = {
      name: data.name || 'My Progressive Web App',
      short_name: data.shortName || 'My PWA',
      description: data.description,
      start_url: data.startUrl,
      display: data.display,
      theme_color: data.themeColor,
      background_color: data.backgroundColor,
      icons: [
        {
          src: "/icon-192x192.png",
          sizes: "192x192",
          type: "image/png"
        },
        {
          src: "/icon-512x512.png",
          sizes: "512x512",
          type: "image/png"
        }
      ]
    };
    return JSON.stringify(manifest, null, 2);
  };

  const copyManifest = () => {
    navigator.clipboard.writeText(generateManifest());
    toast.success('Manifest JSON copied!');
  };

  const downloadManifest = () => {
    const blob = new Blob([generateManifest()], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'manifest.json';
    a.click();
    URL.revokeObjectURL(url);
    toast.success('manifest.json downloaded!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">PWA Manifest Generator</h2>
        <p className="text-muted-foreground">Generate a Web App Manifest to make your website installable as a PWA.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-6 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold border-b pb-2 flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-primary" /> App Settings
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">App Name (Full)</label>
                <input
                  type="text"
                  name="name"
                  value={data.name}
                  onChange={handleInputChange}
                  placeholder="e.g. My Awesome Portfolio"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Short Name</label>
                <input
                  type="text"
                  name="shortName"
                  value={data.shortName}
                  onChange={handleInputChange}
                  placeholder="e.g. Portfolio"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Description</label>
                <textarea
                  name="description"
                  value={data.description}
                  onChange={handleInputChange}
                  placeholder="Briefly describe your app"
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium">Theme Color</label>
                  <div className="flex gap-2">
                    <input
                      type="color"
                      name="themeColor"
                      value={data.themeColor}
                      onChange={handleInputChange}
                      className="h-9 w-12 rounded border bg-background p-1"
                    />
                    <input
                      type="text"
                      name="themeColor"
                      value={data.themeColor}
                      onChange={handleInputChange}
                      className="flex-1 rounded-md border bg-background px-3 py-2 text-xs"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium">Display Mode</label>
                  <select
                    name="display"
                    value={data.display}
                    onChange={handleInputChange}
                    className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="standalone">Standalone</option>
                    <option value="fullscreen">Fullscreen</option>
                    <option value="minimal-ui">Minimal UI</option>
                    <option value="browser">Browser</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="lg:col-span-6 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4 sticky top-24">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Layout className="h-5 w-5 text-primary" /> manifest.json Preview
              </h3>
              <div className="flex gap-2">
                <button onClick={copyManifest} className="p-2 hover:bg-muted rounded-md transition-colors" title="Copy JSON">
                  <Copy className="h-4 w-4" />
                </button>
                <button onClick={downloadManifest} className="p-2 hover:bg-muted rounded-md transition-colors" title="Download JSON">
                  <Download className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed max-h-[400px]">
              <code>{generateManifest()}</code>
            </pre>

            <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 space-y-2">
              <div className="flex gap-3 text-xs text-blue-500 font-bold">
                <Info className="h-4 w-4 shrink-0" />
                Instructions:
              </div>
              <ul className="text-[10px] text-muted-foreground space-y-1 pl-7 list-disc">
                <li>Save this file as <code>manifest.json</code> in your root directory.</li>
                <li>Add <code>&lt;link rel="manifest" href="/manifest.json"&gt;</code> to your HTML <code>&lt;head&gt;</code>.</li>
                <li>Don't forget to upload icons (192x192 and 512x512) to the same location.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PwaGenerator;
