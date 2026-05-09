
import React, { useState } from 'react';
import { Bot, Search, Loader2, CheckCircle, AlertTriangle, Info, BarChart3, Quote } from 'lucide-react';
import toast from 'react-hot-toast';

interface GeoAnalysis {
  score: number;
  factors: {
    name: string;
    status: 'pass' | 'fail' | 'warn';
    message: string;
    suggestion: string;
  }[];
  stats: {
    citations: number;
    statistics: number;
    questions: number;
    readability: string;
  };
}

import AuthGuard from '@/components/auth/AuthGuard';

const GeoOptimizer = () => {
  const [url, setUrl] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<GeoAnalysis | null>(null);

  const analyzeGEO = async () => {
    // ... existing logic ...
    if (!url) return;
    setIsAnalyzing(true);
    setResult(null);

    try {
      const proxyUrl = `/api/proxy?url=${encodeURIComponent(url)}`;
      const response = await fetch(proxyUrl);
      const data = await response.json();
      const html = data.content;

      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      const text = doc.body.innerText || '';

      // GEO Analysis Logic
      const citations = (text.match(/\[\d+\]|source:|referensi:|reference:|cited by/gi) || []).length;
      const statsMatch = (text.match(/\d+(\.\d+)?%|\d+\s+(juta|ribu|miliar|million|billion|percent)/gi) || []).length;
      const questions = (text.match(/\?|bagaimana|apa|kenapa|siapa|kapan|how|what|why|who|when/gi) || []).length;
      
      const factors: GeoAnalysis['factors'] = [];
      let score = 0;

      // Factor 1: Citations (AI loves sources)
      if (citations > 2) {
        factors.push({ name: 'Citations & Sources', status: 'pass', message: 'Good usage of references.', suggestion: 'Excellent. AI models prioritize content with verifiable sources.' });
        score += 25;
      } else {
        factors.push({ name: 'Citations & Sources', status: 'warn', message: 'Few or no citations found.', suggestion: 'Add links to reputable sources or use [1] style citations to increase trust.' });
        score += 5;
      }

      // Factor 2: Statistics & Data
      if (statsMatch > 3) {
        factors.push({ name: 'Statistical Data', status: 'pass', message: 'Rich in data points.', suggestion: 'AI engines use numbers to provide specific answers.' });
        score += 25;
      } else {
        factors.push({ name: 'Statistical Data', status: 'fail', message: 'Lacks specific data.', suggestion: 'Try to include statistics or percentage data to make content more authoritative.' });
      }

      // Factor 3: Question Coverage
      if (questions > 3) {
        factors.push({ name: 'Q&A Optimization', status: 'pass', message: 'Covers common questions.', suggestion: 'Your content is structured to answer direct user queries.' });
        score += 25;
      } else {
        factors.push({ name: 'Q&A Optimization', status: 'warn', message: 'Could use more Q&A structure.', suggestion: 'Add an FAQ section or use H2/H3 tags as questions.' });
        score += 10;
      }

      // Factor 4: Schema Presence
      const hasSchema = html.includes('application/ld+json');
      if (hasSchema) {
        factors.push({ name: 'Structured Data', status: 'pass', message: 'JSON-LD detected.', suggestion: 'Perfect. Structured data helps AI understand entities and relationships.' });
        score += 25;
      } else {
        factors.push({ name: 'Structured Data', status: 'fail', message: 'No Schema Markup found.', suggestion: 'Add FAQ or Article Schema to help AI engines parse your data.' });
      }

      setResult({
        score,
        factors,
        stats: {
          citations,
          statistics: statsMatch,
          questions,
          readability: text.length > 2000 ? 'Comprehensive' : 'Brief'
        }
      });
      toast.success('GEO Analysis complete!');
    } catch (error) {
      toast.error('Failed to analyze content');
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <AuthGuard 
      featureName="GEO Optimizer" 
      description="Optimize your content for Generative AI Engines (Gemini, ChatGPT, SGE). Join 1,000+ SEO experts using this tool to rank in AI search results."
    >
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h2 className="text-2xl font-bold flex items-center gap-2">
              <Bot className="h-6 w-6 text-primary" /> GEO Optimizer
            </h2>
            <p className="text-muted-foreground">Optimize your content for Generative AI Engines (Gemini, ChatGPT, SGE).</p>
          </div>
          {result && (
            <div className="bg-primary/10 px-4 py-2 rounded-xl border border-primary/20 flex items-center gap-3">
               <span className="text-xs font-bold uppercase text-primary">GEO Ready Score</span>
               <span className="text-2xl font-black text-primary">{result.score}%</span>
            </div>
          )}
        </div>

        <div className="bg-card p-6 rounded-xl border shadow-sm space-y-4">
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="url"
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com/article"
                className="w-full rounded-md border bg-background pl-10 pr-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <button
              onClick={analyzeGEO}
              disabled={isAnalyzing || !url}
              className="bg-primary text-primary-foreground px-6 py-2 rounded-md font-medium hover:opacity-90 disabled:opacity-50 transition-all flex items-center gap-2"
            >
              {isAnalyzing ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Analyze for AI'}
            </button>
          </div>
        </div>

        {result ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4">
            <div className="lg:col-span-8 space-y-4">
              {result.factors.map((factor, i) => (
                <div key={i} className={`p-5 rounded-xl border flex gap-4 ${
                  factor.status === 'pass' ? 'bg-green-500/5 border-green-500/20' : 
                  factor.status === 'warn' ? 'bg-yellow-500/5 border-yellow-500/20' : 
                  'bg-red-500/5 border-red-500/20'
                }`}>
                  {factor.status === 'pass' ? <CheckCircle className="h-6 w-6 text-green-500 shrink-0" /> : 
                   factor.status === 'warn' ? <AlertTriangle className="h-6 w-6 text-yellow-500 shrink-0" /> : 
                   <AlertTriangle className="h-6 w-6 text-red-500 shrink-0" />}
                  <div className="space-y-1">
                    <h4 className="font-bold text-sm">{factor.name}</h4>
                    <p className="text-sm text-foreground/80">{factor.message}</p>
                    <p className="text-xs text-muted-foreground italic mt-2">{factor.suggestion}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="lg:col-span-4 space-y-4">
              <div className="bg-card p-6 rounded-xl border shadow-sm">
                <h3 className="font-bold mb-4 flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-primary" /> Content Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Quote className="h-3 w-3" /> Citations</span>
                    <span className="font-bold">{result.stats.citations}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><BarChart3 className="h-3 w-3" /> Statistics</span>
                    <span className="font-bold">{result.stats.statistics}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground flex items-center gap-2"><Search className="h-3 w-3" /> Questions</span>
                    <span className="font-bold">{result.stats.questions}</span>
                  </div>
                  <div className="pt-2 border-t mt-2">
                    <div className="text-[10px] uppercase font-bold text-muted-foreground tracking-widest mb-1">Depth</div>
                    <div className="text-sm font-black text-primary">{result.stats.readability}</div>
                  </div>
                </div>
              </div>

              <div className="bg-primary p-6 rounded-2xl text-primary-foreground shadow-lg space-y-3">
                <h3 className="font-bold text-lg flex items-center gap-2">
                  <Bot className="h-5 w-5" /> What is GEO?
                </h3>
                <p className="text-xs leading-relaxed opacity-90">
                  Generative Engine Optimization (GEO) is the practice of optimizing content to be more visible in AI-powered search engines like Google SGE and Perplexity.
                </p>
                <ul className="text-[11px] space-y-1 opacity-80 list-disc pl-4">
                  <li>AI loves data points and numbers.</li>
                  <li>Clear citations build trust (E-E-A-T).</li>
                  <li>Questions as headers help AI extract answers.</li>
                </ul>
              </div>
            </div>
          </div>
        ) : (
          <div className="h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/20 space-y-4">
             <Bot className="h-12 w-12 opacity-10" />
             <div className="text-center px-6">
               <p className="font-bold">Is your content AI-ready?</p>
               <p className="text-xs">Paste an article URL to check its Generative Engine Optimization score.</p>
             </div>
          </div>
        )}
      </div>
    </AuthGuard>
  );
};

export default GeoOptimizer;
