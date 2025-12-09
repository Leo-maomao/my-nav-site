// Cloudflare Pages Function: Tranco API 代理
export async function onRequest(context) {
  const domain = context.params.domain;

  if (!domain) {
    return new Response(JSON.stringify({ error: 'Missing domain' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  try {
    const trancoUrl = `https://tranco-list.eu/api/ranks/domain/${domain}`;
    const response = await fetch(trancoUrl);
    const data = await response.json();

    return new Response(JSON.stringify(data), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Cache-Control': 'public, max-age=86400'
      }
    });
  } catch (e) {
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*'
      }
    });
  }
}
