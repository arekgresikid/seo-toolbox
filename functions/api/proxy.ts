/// <reference types="@cloudflare/workers-types" />

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const targetUrl = url.searchParams.get('url');

  if (!targetUrl) {
    return new Response(JSON.stringify({ error: 'URL is required' }), { 
      status: 400, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }

  try {
    const parsedUrl = new URL(targetUrl);
    
    // SSRF Protection
    if (parsedUrl.protocol !== 'http:' && parsedUrl.protocol !== 'https:') {
      return new Response(JSON.stringify({ error: 'Invalid protocol' }), { 
        status: 400, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const hostname = parsedUrl.hostname.toLowerCase();
    const isLocalOrPrivate = [
      'localhost', '127.0.0.1', '0.0.0.0', '169.254.169.254', '::1'
    ].includes(hostname) || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    (hostname.startsWith('172.') && parseInt(hostname.split('.')[1]) >= 16 && parseInt(hostname.split('.')[1]) <= 31);

    if (isLocalOrPrivate) {
      return new Response(JSON.stringify({ error: 'Access to private/local networks is forbidden' }), { 
        status: 403, 
        headers: { 'Content-Type': 'application/json' } 
      });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'manual'
    });

    const data = await response.text();
    const location = response.headers.get('location');
    
    return new Response(JSON.stringify({
      status: response.status,
      content: data,
      location: location,
      contentType: response.headers.get('Content-Type')
    }), { 
      headers: { 'Content-Type': 'application/json' } 
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: 'Invalid URL or failed to fetch' }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
