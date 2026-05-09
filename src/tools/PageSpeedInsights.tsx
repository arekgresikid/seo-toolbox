
import React, { useState } from 'react';
import { Zap, ExternalLink, Search, Info, CheckCircle, BarChart3, Loader2, Smartphone, Monitor } from 'lucide-react';
import toast from 'react-hot-toast';

interface PageSpeedData {
  scores: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  audits: {
    opportunities: any[];
    passed: string[];
  };
}

import AuthGuard from '@/components/auth/AuthGuard';

const PageSpeedInsights = () => {
  const [url, setUrl] = useState('');
  const [strategy, setStrategy] = useState<'mobile' | 'desktop'>('mobile');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [data, setData] = useState<PageSpeedData | null>(null);

  const startAnalysis = async () => {
    // ... existing logic ...
    if (!url) return;
    setIsAnalyzing(true);
    setData(null);

    try {
      const response = await fetch(`/api/pagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}`);
      const result = await response.json();

      if (result.error) {
        throw new Error(result.error);
      }

      setData(result);
      toast.success('Analysis complete!');
    } catch (error: any) {
      toast.error(error.message || 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-500';
    if (score >= 50) return 'text-yellow-500';
    return 'text-red-500';
  };

  return (
    <AuthGuard 
      featureName="PageSpeed Insights" 
      description="Get deep performance metrics and Lighthouse audits. Analyze your site's speed across mobile and desktop to improve user experience and SEO rankings."
    >
      <div className="space-y-6">
        <div>
          <h2 className="text-2xl font-bold">PageSpeed Insights</h2>
          <p className="text-muted-foreground">Analyze real performance, accessibility, and SEO data using Google Lighthouse.</p>
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex flex-col md:flex-row gap-4">
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
            <div className="flex gap-2">
              <div className="flex border rounded-md overflow-hidden">
                <button 
                  onClick={() => setStrategy('mobile')}
                  className={`px-3 py-2 ${strategy === 'mobile' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  title="Mobile"
                >
                  <Smartphone className="h-4 w-4" />
                </button>
                <button 
                  onClick={() => setStrategy('desktop')}
                  className={`px-3 py-2 ${strategy === 'desktop' ? 'bg-primary text-primary-foreground' : 'bg-muted'}`}
                  title="Desktop"
                >
                  <Monitor className="h-4 w-4" />
                </button>
              </div>
              <button
                onClick={startAnalysis}
                disabled={isAnalyzing || !url}
                className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2 shrink-0"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Analyzing...
                  </>
                ) : 'Run Audit'}
              </button>
            </div>
          </div>
        </div>

        {data ? (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Performance', score: data.scores.performance },
                { label: 'Accessibility', score: data.scores.accessibility },
                { label: 'Best Practices', score: data.scores.bestPractices },
                { label: 'SEO', score: data.scores.seo },
              ].map((item, i) => (
                <div key={i} className="bg-card p-4 rounded-xl border shadow-sm flex flex-col items-center justify-center text-center">
                  <div className={`text-3xl font-black mb-1 ${getScoreColor(item.score)}`}>{item.score}</div>
                  <div className="text-xs font-bold uppercase tracking-wider text-muted-foreground">{item.label}</div>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <Zap className="h-5 w-5 text-yellow-500" /> Key Opportunities
                </h3>
                <div className="space-y-4">
                  {data.audits.opportunities.length > 0 ? data.audits.opportunities.map((op, i) => (
                    <div key={i} className="flex justify-between items-start p-3 rounded-lg border bg-muted/20">
                      <div className="space-y-1">
                        <p className="text-sm font-semibold">{op.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-1">{op.description.replace(/\[Learn more\]\(.*\)\./, '')}</p>
                      </div>
                      {op.displayValue && (
                        <span className="text-xs font-bold text-red-500 bg-red-500/10 px-2 py-0.5 rounded shrink-0 ml-2">{op.displayValue}</span>
                      )}
                    </div>
                  )) : (
                    <p className="text-sm text-muted-foreground italic">No major opportunities found. Good job!</p>
                  )}
                </div>
              </div>

              <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
                <h3 className="font-bold flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-green-500" /> Passed Audits ({data.audits.passed.length})
                </h3>
                <div className="space-y-2 max-h-[300px] overflow-y-auto pr-2">
                  {data.audits.passed.map((audit, i) => (
                    <div key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CheckCircle className="h-4 w-4 text-green-500 shrink-0" />
                      {audit}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-primary/5 rounded-2xl border-2 border-dashed border-primary/20 space-y-4">
              <BarChart3 className="h-12 w-12 text-primary opacity-50" />
              <div className="text-center">
                <h4 className="font-bold text-lg">Full Lighthouse Report</h4>
                <p className="text-sm text-muted-foreground max-w-md">For the complete technical report including treemaps and performance traces, visit the official site.</p>
              </div>
              <a 
                href={`https://pagespeed.web.dev/analysis?url=${encodeURIComponent(url)}&strategy=${strategy}`}
                target="_blank"
                rel="noreferrer"
                className="bg-primary text-primary-foreground px-8 py-3 rounded-xl font-bold shadow-lg hover:shadow-primary/20 transition-all flex items-center gap-2"
              >
                View Full Report on PageSpeed Insights <ExternalLink className="h-4 w-4" />
              </a>
            </div>
          </div>
        ) : (
          <div className="h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20 space-y-4">
            {!isAnalyzing ? (
              <>
                <div className="p-4 rounded-full bg-background border shadow-sm">
                  <Zap className="h-10 w-10 text-yellow-500 opacity-20" />
                </div>
                <div className="text-center">
                  <p className="font-medium">Enter a URL to run a live audit</p>
                  <p className="text-xs">Using Google's PageSpeed Insights API v5</p>
                </div>
              </>
            ) : (
              <div className="flex flex-col items-center gap-4">
                <Loader2 className="h-12 w-12 animate-spin text-primary" />
                <p className="text-sm font-bold animate-pulse">Running Lighthouse audit... this may take up to 30 seconds.</p>
              </div>
            )}
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default PageSpeedInsights;
