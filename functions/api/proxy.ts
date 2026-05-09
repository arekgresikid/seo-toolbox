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
    // Menambahkan User-Agent agar tidak dianggap bot sederhana oleh beberapa situs
    const response = await fetch(targetUrl, {
      redirect: 'follow',
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
      }
    });

    const content = await response.text();

    // Pastikan kita mengembalikan status asli dan kontennya
    return new Response(JSON.stringify({ 
      content,
      status: response.status,
      statusText: response.statusText,
      finalUrl: response.url
    }), { 
      headers: { 
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*' 
      } 
    });
  } catch (error: any) {
    return new Response(JSON.stringify({ error: `Failed to fetch: ${error.message}` }), { 
      status: 500, 
      headers: { 'Content-Type': 'application/json' } 
    });
  }
}
