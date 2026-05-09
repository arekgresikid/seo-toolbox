
import React, { useState } from 'react';
import { Search, Loader2, BarChart2, Info } from 'lucide-react';
import toast from 'react-hot-toast';

interface KeywordStat {
  word: string;
  count: number;
  density: number;
}

const KeywordDensity = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [stats, setStats] = useState<KeywordStat[]>([]);
  const [totalWords, setTotalWords] = useState(0);

  const analyzeKeywords = async () => {
    if (!url) return;
    setIsAnalyzing(true);
    setStats([]);

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const html = data.content;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      
      // Remove scripts, styles, and non-content elements
      doc.querySelectorAll('script, style, nav, footer, header, noscript').forEach(el => el.remove());
      
      const text = doc.body.innerText || '';
      const words = text.toLowerCase()
        .replace(/[^\w\s]/g, '')
        .split(/\s+/)
        .filter(word => word.length > 3); // Filter small words

      const counts: Record<string, number> = {};
      words.forEach(word => {
        counts[word] = (counts[word] || 0) + 1;
      });

      const sortedStats: KeywordStat[] = Object.entries(counts)
        .map(([word, count]) => ({
          word,
          count,
          density: (count / words.length) * 100
        }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 30);

      setStats(sortedStats);
      setTotalWords(words.length);
      toast.success('Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze website');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Keyword Density Analyzer</h2>
        <p className="text-muted-foreground">Analyze the most frequent words on your page and their density.</p>
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
            onClick={analyzeKeywords}
            disabled={isAnalyzing || !url}
            className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
          >
            {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze'}
          </button>
        </div>
      </div>

      {stats.length > 0 && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4">
          <div className="lg:col-span-8">
            <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
              <table className="w-full text-sm text-left">
                <thead className="bg-muted/50 text-muted-foreground font-bold uppercase text-[10px] tracking-wider">
                  <tr>
                    <th className="px-6 py-3">Keyword</th>
                    <th className="px-6 py-3">Count</th>
                    <th className="px-6 py-3">Density</th>
                    <th className="px-6 py-3">Visualization</th>
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {stats.map((stat, index) => (
                    <tr key={index} className="hover:bg-accent/5 transition-colors">
                      <td className="px-6 py-4 font-bold">{stat.word}</td>
                      <td className="px-6 py-4">{stat.count}</td>
                      <td className="px-6 py-4">{stat.density.toFixed(2)}%</td>
                      <td className="px-6 py-4">
                        <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-primary transition-all duration-500" 
                            style={{ width: `${Math.min(100, stat.density * 20)}%` }}
                          />
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
          <div className="lg:col-span-4 space-y-4">
            <div className="bg-primary/10 p-6 rounded-xl border border-primary/20 text-center">
              <BarChart2 className="h-10 w-10 text-primary mx-auto mb-2" />
              <div className="text-2xl font-black text-primary">{totalWords}</div>
              <p className="text-xs font-bold uppercase tracking-widest text-primary/70">Total Words (4+ chars)</p>
            </div>
            <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-sm">
                <Info className="h-4 w-4 text-primary" /> SEO Recommendations
              </h3>
              <div className="space-y-3 text-xs text-muted-foreground">
                <p>• Avoid keyword density over <strong>3%</strong> to prevent search engines from seeing it as spam.</p>
                <p>• Focus on <strong>Long-tail keywords</strong> for better conversion.</p>
                <p>• Ensure your main keyword appears in the first 100 words.</p>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default KeywordDensity;
