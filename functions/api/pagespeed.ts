export const onRequestGet = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');
  const strategy = url.searchParams.get('strategy') || 'mobile';
  const apiKey = context.env.PAGESPEED_API_KEY;

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL is required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  if (!apiKey) {
    return new Response(JSON.stringify({ error: 'API Key not configured' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(targetUrl)}&key=${apiKey}&strategy=${strategy}&category=performance&category=accessibility&category=best-practices&category=seo`;
    const response = await fetch(apiUrl);
    const data = await response.json();

    if (data.error) {
      return new Response(JSON.stringify({ error: data.error.message }), { 
        status: data.error.code || 500, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

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

    return new Response(JSON.stringify(simplified), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Failed to fetch PageSpeed data' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
