
import React, { useState } from 'react';
import { Copy, Languages, Plus, Trash2, Info, CheckCircle, Link as LinkIcon } from 'lucide-react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Hreflang } from '../types';
import toast from 'react-hot-toast';

const initialHreflangs: Hreflang[] = [
  { lang: 'en', url: 'https://example.com/en/' },
  { lang: 'id', url: 'https://example.com/id/' },
];

const HreflangCanonical = () => {
  const [hreflangs, setHreflangs] = useLocalStorage<Hreflang[]>('seo-hreflangs', initialHreflangs);
  const [canonical, setCanonical] = useLocalStorage<string>('seo-canonical-solo', 'https://example.com/page');

  const addHreflang = () => {
    setHreflangs([...hreflangs, { lang: '', url: '' }]);
  };

  const removeHreflang = (index: number) => {
    const newHrefs = [...hreflangs];
    newHrefs.splice(index, 1);
    setHreflangs(newHrefs);
  };

  const updateHreflang = (index: number, field: keyof Hreflang, value: string) => {
    const newHrefs = [...hreflangs];
    newHrefs[index] = { ...newHrefs[index], [field]: value };
    setHreflangs(newHrefs);
  };

  const generateCode = () => {
    let code = `<!-- Canonical Tag -->\n<link rel="canonical" href="${canonical}" />\n\n`;
    code += `<!-- Hreflang Tags -->\n`;
    hreflangs.forEach(h => {
      if (h.lang && h.url) {
        code += `<link rel="alternate" hreflang="${h.lang}" href="${h.url}" />\n`;
      }
    });
    code += `<link rel="alternate" hreflang="x-default" href="${hreflangs[0]?.url || canonical}" />`;
    return code;
  };

  const copyCode = () => {
    navigator.clipboard.writeText(generateCode());
    toast.success('Tags copied!');
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Hreflang & Canonical Generator</h2>
        <p className="text-muted-foreground">Manage international versions of your page and define the authoritative URL.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        <div className="lg:col-span-7 space-y-6">
          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <h3 className="font-bold flex items-center gap-2">
              <LinkIcon className="h-5 w-5 text-primary" /> Canonical URL
            </h3>
            <div className="space-y-2">
              <label className="text-sm font-medium">Main authoritative URL</label>
              <input
                type="url"
                value={canonical}
                onChange={(e) => setCanonical(e.target.value)}
                placeholder="https://example.com/page"
                className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold flex items-center gap-2">
                <Languages className="h-5 w-5 text-primary" /> Hreflang (Internationalization)
              </h3>
              <button onClick={addHreflang} className="text-xs bg-primary/10 text-primary px-3 py-1.5 rounded-lg hover:bg-primary/20 transition-all flex items-center gap-1">
                <Plus className="h-4 w-4" /> Add Language
              </button>
            </div>

            <div className="space-y-3">
              {hreflangs.map((h, index) => (
                <div key={index} className="flex gap-3 items-end">
                  <div className="w-32 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Lang Code</label>
                    <input
                      type="text"
                      value={h.lang}
                      onChange={(e) => updateHreflang(index, 'lang', e.target.value)}
                      placeholder="en, id, fr"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <div className="flex-1 space-y-1">
                    <label className="text-[10px] font-bold uppercase text-muted-foreground">Language URL</label>
                    <input
                      type="url"
                      value={h.url}
                      onChange={(e) => updateHreflang(index, 'url', e.target.value)}
                      placeholder="https://example.com/lang-page/"
                      className="w-full rounded-md border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                  <button onClick={() => removeHreflang(index)} className="mb-2 text-muted-foreground hover:text-red-500">
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="lg:col-span-5 space-y-4">
          <div className="bg-card p-6 rounded-xl border shadow-sm sticky top-24 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-bold">Preview Tags</h3>
              <button onClick={copyCode} className="text-xs flex items-center gap-1 text-primary hover:underline">
                <Copy className="h-3.5 w-3.5" /> Copy Tags
              </button>
            </div>
            <pre className="p-4 bg-zinc-950 text-zinc-50 rounded-xl border overflow-x-auto text-xs leading-relaxed min-h-[150px]">
              <code>{generateCode()}</code>
            </pre>
            
            <div className="space-y-4 pt-4">
              <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground">SEO Check</h4>
              <div className="p-3 rounded-lg bg-green-500/10 border border-green-500/20 flex gap-3 text-xs text-green-600">
                <CheckCircle className="h-4 w-4 shrink-0" />
                <p>x-default tag included. This helps search engines choose the best version when no language matches.</p>
              </div>
              <div className="p-3 rounded-lg bg-blue-500/10 border border-blue-500/20 flex gap-3 text-xs text-blue-600">
                <Info className="h-4 w-4 shrink-0" />
                <p>Make sure each language page also contains the exact same set of hreflang tags (bi-directional links).</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HreflangCanonical;
