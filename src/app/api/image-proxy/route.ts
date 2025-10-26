export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const url = searchParams.get('url');

  if (!url) {
    return new Response('Missing ?url=', { status: 400 });
  }

  try {
    const response = await fetch(url);

    if (!response.ok) {
      return new Response('Image fetch failed', { status: response.status });
    }

    const contentType = response.headers.get('content-type') || 'image/png';
    const arrayBuffer = await response.arrayBuffer();

    return new Response(arrayBuffer, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=31536000, immutable',
      },
    });
  } catch (error) {
    console.error('Proxy error:', error);
    return new Response('Internal proxy error', { status: 500 });
  }
}