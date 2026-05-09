'use client';

import React, { useState } from 'react';
import { FileJson, Play, CheckCircle, XCircle, Info, AlertTriangle } from 'lucide-react';
import toast from 'react-hot-toast';

const StructuredDataTester = () => {
  const [jsonCode, setJsonCode] = useState('');
  const [result, setResult] = useState<{ valid: boolean; data?: any; error?: string } | null>(null);

  const testSchema = () => {
    if (!jsonCode) return;
    
    try {
      // Try to clean the input if it includes script tags
      let cleanCode = jsonCode.trim();
      if (cleanCode.includes('<script')) {
        const match = cleanCode.match(/<script[^>]*>([\s\S]*?)<\/script>/);
        if (match && match[1]) {
          cleanCode = match[1].trim();
        }
      }

      const parsed = JSON.parse(cleanCode);
      setResult({ valid: true, data: parsed });
      toast.success('Valid JSON-LD!');
    } catch (e: any) {
      setResult({ valid: false, error: e.message });
      toast.error('Invalid JSON structure');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Schema Markup / Structured Data Tester</h2>
        <p className="text-muted-foreground">Paste your JSON-LD code to validate its syntax and preview the structure.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
            <div className="px-6 py-3 border-b flex justify-between items-center bg-muted/30">
              <h3 className="font-bold text-sm">Paste JSON-LD</h3>
              <button 
                onClick={testSchema}
                className="bg-primary text-primary-foreground px-4 py-1.5 rounded-lg text-xs font-bold hover:opacity-90 flex items-center gap-1.5 transition-all"
              >
                <Play className="h-3 w-3 fill-current" /> Run Test
              </button>
            </div>
            <textarea
              value={jsonCode}
              onChange={(e) => setJsonCode(e.target.value)}
              placeholder='{ "@context": "https://schema.org", "@type": "Article", ... }'
              className="w-full h-[500px] p-6 bg-zinc-950 text-zinc-50 font-mono text-xs focus:outline-none resize-none leading-relaxed"
            />
          </div>
          <div className="p-4 rounded-lg bg-blue-500/5 border border-blue-500/10 flex gap-3 text-xs text-blue-500">
            <Info className="h-4 w-4 shrink-0" />
            <p>You can paste the raw JSON or the complete <code>&lt;script type="application/ld+json"&gt;</code> block.</p>
          </div>
        </div>

        <div className="space-y-4">
          {result ? (
            <div className="animate-in fade-in slide-in-from-right-4 space-y-6">
              <div className={`p-6 rounded-xl border shadow-sm flex items-center gap-4 ${result.valid ? 'bg-green-500/5 border-green-500/20' : 'bg-red-500/5 border-red-500/20'}`}>
                {result.valid ? (
                  <>
                    <CheckCircle className="h-10 w-10 text-green-500" />
                    <div>
                      <h4 className="font-bold text-lg">Valid JSON-LD</h4>
                      <p className="text-sm text-muted-foreground">Syntax check passed. No formatting errors found.</p>
                    </div>
                  </>
                ) : (
                  <>
                    <XCircle className="h-10 w-10 text-red-500" />
                    <div>
                      <h4 className="font-bold text-lg">Invalid JSON</h4>
                      <p className="text-sm text-red-500 font-mono text-xs mt-1">{result.error}</p>
                    </div>
                  </>
                )}
              </div>

              {result.valid && (
                <div className="bg-card rounded-xl border shadow-sm overflow-hidden">
                  <div className="px-6 py-3 border-b bg-muted/30 font-bold text-sm flex items-center gap-2">
                    <FileJson className="h-4 w-4 text-primary" /> Data Structure Preview
                  </div>
                  <div className="p-6 space-y-4">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold uppercase text-muted-foreground">Type:</span>
                      <span className="px-2 py-0.5 bg-primary/10 text-primary rounded text-sm font-bold">{result.data['@type'] || 'Not specified'}</span>
                    </div>
                    <div className="divide-y border rounded-lg">
                      {Object.entries(result.data).map(([key, value]) => (
                        key !== '@context' && key !== '@type' && (
                          <div key={key} className="p-3 flex flex-col md:flex-row md:items-start gap-1 md:gap-4 hover:bg-muted/30 transition-colors">
                            <span className="text-xs font-bold w-32 shrink-0 text-muted-foreground">{key}</span>
                            <span className="text-sm break-all font-medium">
                              {typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value)}
                            </span>
                          </div>
                        )
                      ))}
                    </div>
                  </div>
                </div>
              )}

              <div className="p-4 rounded-lg bg-yellow-500/5 border border-yellow-500/10 flex gap-3 text-xs text-yellow-600">
                <AlertTriangle className="h-4 w-4 shrink-0" />
                <p>This only validates JSON syntax. To check if the fields meet Google's specific rich result requirements, use the <a href="https://search.google.com/test/rich-results" target="_blank" rel="noreferrer" className="underline font-bold">Rich Results Test</a>.</p>
              </div>
            </div>
          ) : (
            <div className="h-[500px] border-2 border-dashed rounded-xl flex flex-col items-center justify-center text-muted-foreground bg-muted/10 space-y-4">
              <FileJson className="h-16 w-16 opacity-10" />
              <div className="text-center px-6">
                <p className="font-bold">Waiting for Test</p>
                <p className="text-xs">Paste your code and click "Run Test" to see results.</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StructuredDataTester;
