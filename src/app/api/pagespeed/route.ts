import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');
  const strategy = searchParams.get('strategy') || 'mobile';
  const apiKey = process.env.PAGESPEED_API_KEY;

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  if (!apiKey) {
    return NextResponse.json({ error: 'API Key not configured' }, { status: 500 });
  }

  try {
    // Categories: performance, accessibility, best-practices, seo
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return NextResponse.json({ error: data.error.message }, { status: data.error.code || 500 });
    }

    // Extract simplified data for the UI
    const lighthouse = data.lighthouseResult;
    const simplified = {
      scores: {
        performance: Math.round(lighthouse.categories.performance.score * 100),
        accessibility: Math.round(lighthouse.categories.accessibility.score * 100),
        bestPractices: Math.round(lighthouse.categories['best-practices'].score * 100),
        seo: Math.round(lighthouse.categories.seo.score * 100),
      },
      audits: {
        opportunities: Object.values(lighthouse.audits)
          .filter((audit: any) => audit.details?.type === 'opportunity' && audit.score !== null && audit.score < 0.9)
          .sort((a: any, b: any) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0))
          .slice(0, 5),
        passed: Object.values(lighthouse.audits)
          .filter((audit: any) => audit.score === 1 && audit.title)
          .slice(0, 10)
          .map((a: any) => a.title),
      }
    };

    return NextResponse.json(simplified);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch PageSpeed data' }, { status: 500 });
  }
}
