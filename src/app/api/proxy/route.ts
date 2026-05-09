import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const targetUrl = searchParams.get('url');

  if (!targetUrl) {
    return NextResponse.json({ error: 'URL is required' }, { status: 400 });
  }

  try {
    const url = new URL(targetUrl);
    
    // Proteksi SSRF Dasar: Pastikan protokol adalah http atau https
    if (url.protocol !== 'http:' && url.protocol !== 'https:') {
      return NextResponse.json({ error: 'Invalid protocol' }, { status: 400 });
    }

    // Proteksi SSRF: Blokir alamat lokal dan privat
    const hostname = url.hostname.toLowerCase();
    const isLocalOrPrivate = [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '169.254.169.254', // Metadata AWS/Azure/GCP
      '::1',
    ].includes(hostname) || 
    hostname.startsWith('192.168.') || 
    hostname.startsWith('10.') || 
    (hostname.startsWith('172.') && parseInt(hostname.split('.')[1]) >= 16 && parseInt(hostname.split('.')[1]) <= 31);

    if (isLocalOrPrivate) {
      return NextResponse.json({ error: 'Access to private/local networks is forbidden' }, { status: 403 });
    }

    const response = await fetch(targetUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
      },
      redirect: 'manual',
      next: { revalidate: 0 }
    });

    const data = await response.text();
    const location = response.headers.get('location');
    
    return NextResponse.json({
      status: response.status,
      content: data,
      location: location,
      contentType: response.headers.get('Content-Type')
    });
  } catch (error) {
    return NextResponse.json({ error: 'Invalid URL or failed to fetch' }, { status: 500 });
  }
}
