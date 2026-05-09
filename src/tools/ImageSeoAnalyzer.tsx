
import React, { useState } from 'react';
import { Image as ImageIcon, Search, CheckCircle, XCircle, Loader2, AlertCircle, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface ImageInfo {
  src: string;
  alt: string;
  width: string;
  height: string;
  status: 'valid' | 'missing-alt' | 'missing-dims' | 'both';
}

const ImageSeoAnalyzer = () => {
  const [url, setUrl] = useState('');
  const [isScanning, setIsScanning] = useState(false);
  const [images, setImages] = useState<ImageInfo[]>([]);

  const scanImages = async () => {
    if (!url) return;
    setIsScanning(true);
    setImages([]);

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const html = data.content;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const base = new URL(url);
      
      const imgTags = Array.from(doc.querySelectorAll('img'));
      const results: ImageInfo[] = imgTags.map(img => {
        const src = img.getAttribute('src') || '';
        const alt = img.getAttribute('alt') || '';
        const width = img.getAttribute('width') || '';
        const height = img.getAttribute('height') || '';
        
        let status: ImageInfo['status'] = 'valid';
        if (!alt && (!width || !height)) status = 'both';
        else if (!alt) status = 'missing-alt';
        else if (!width || !height) status = 'missing-dims';

        return {
          src: src.startsWith('http') ? src : new URL(src, base).href,
          alt,
          width,
          height,
          status
        };
      });

      setImages(results);
      toast.success(`Found ${results.length} images`);
    } catch (error) {
      toast.error('Failed to analyze images');
    } finally {
      setIsScanning(false);
    }
  };

  const missingAltCount = images.filter(img => img.status === 'missing-alt' || img.status === 'both').length;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Image SEO Analyzer</h2>
        <p className="text-muted-foreground">Analyze images on your page for ALT text and proper dimensions.</p>
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
            onClick={scanImages}
            disabled={isScanning || !url}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isScanning ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Scan Images'}
          </button>
        </div>
      </div>

      {images.length > 0 && (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-black text-xl">
                {images.length}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Total Images</p>
                <p className="text-sm font-medium">Detected on page</p>
              </div>
            </div>
            <div className={`bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4 ${missingAltCount > 0 ? 'border-red-500/50' : 'border-green-500/50'}`}>
              <div className={`h-12 w-12 rounded-full flex items-center justify-center font-black text-xl ${missingAltCount > 0 ? 'bg-red-500/10 text-red-500' : 'bg-green-500/10 text-green-500'}`}>
                {missingAltCount}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">Missing ALT</p>
                <p className="text-sm font-medium">{missingAltCount > 0 ? 'Needs attention' : 'All good!'}</p>
              </div>
            </div>
            <div className="bg-card p-4 rounded-xl border shadow-sm flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-yellow-500/10 flex items-center justify-center text-yellow-600 font-black text-xl">
                {images.filter(img => img.status === 'missing-dims' || img.status === 'both').length}
              </div>
              <div>
                <p className="text-xs font-bold uppercase text-muted-foreground">No Dimensions</p>
                <p className="text-sm font-medium">Potential CLS issues</p>
              </div>
            </div>
          </div>

          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Preview</th>
                    <th className="px-6 py-3">ALT Text</th>
                    <th className="px-6 py-3">Dimensions</th>
                    <th className="px-6 py-3">SEO Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {images.map((img, index) => (
                    <tr key={index} className="hover:bg-accent/5 transition-colors">
                      <td className="px-6 py-4">
                        <div className="h-10 w-10 rounded border bg-muted flex items-center justify-center overflow-hidden">
                          {img.src ? (
                            <img src={img.src} alt="Preview" className="h-full w-full object-cover" />
                          ) : (
                            <ImageIcon className="h-4 w-4 text-muted-foreground" />
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        {img.alt ? (
                          <span className="text-foreground">{img.alt}</span>
                        ) : (
                          <span className="text-red-500 italic flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" /> Missing
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-muted-foreground">
                        {img.width && img.height ? `${img.width}x${img.height}` : 'Not specified'}
                      </td>
                      <td className="px-6 py-4">
                        {img.status === 'valid' ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-blue-500/5 border border-blue-500/10 p-6 rounded-xl flex gap-4">
            <Info className="h-6 w-6 text-blue-500 shrink-0" />
            <div className="space-y-1 text-sm text-muted-foreground">
              <p><strong>Pro Tip:</strong> Alt text is essential for screen readers and helps Google images index your pictures. Always specify width and height to prevent Layout Shift (CLS).</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageSeoAnalyzer;
