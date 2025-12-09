// Cloudflare Worker: Tranco API 代理（解决 CORS 问题）
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    // 处理 /api/tranco/:domain 请求
    if (url.pathname.startsWith('/api/tranco/')) {
      const domain = url.pathname.replace('/api/tranco/', '');

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
            'Cache-Control': 'public, max-age=86400' // 缓存24小时
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

    // 其他请求返回静态资源
    return env.ASSETS.fetch(request);
  }
};
