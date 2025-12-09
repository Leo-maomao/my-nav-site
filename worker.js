// Cloudflare Worker - 处理 API 请求
const SUPABASE_URL = "https://aexcnubowsarpxkohqvv.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFleGNudWJvd3NhcnB4a29ocXZ2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQyMjYyOTksImV4cCI6MjA3OTgwMjI5OX0.TCGkoBou99fui-cgcpod-b3BaSdq1mg7SFUtR2mIxms";
const TRANCO_API = 'https://tranco-list.eu/api/ranks/domain/';

// AI 工具候选列表（每分类8个，确保能选出前5）
const TOOLS_CONFIG = {
  '聊天对话': [
    { name: 'ChatGPT', domain: 'chatgpt.com' },
    { name: 'Claude', domain: 'claude.ai' },
    { name: 'Perplexity', domain: 'perplexity.ai' },
    { name: 'DeepSeek', domain: 'deepseek.com' },
    { name: 'Character.AI', domain: 'character.ai' },
    { name: 'Poe', domain: 'poe.com' },
    { name: 'You.com', domain: 'you.com' },
    { name: 'HuggingChat', domain: 'huggingface.co' }
  ],
  '图片生成': [
    { name: 'Midjourney', domain: 'midjourney.com' },
    { name: 'Leonardo.AI', domain: 'leonardo.ai' },
    { name: 'Ideogram', domain: 'ideogram.ai' },
    { name: '海艺SeaArt', domain: 'seaart.ai' },
    { name: 'Civitai', domain: 'civitai.com' },
    { name: 'Freepik', domain: 'freepik.com' },
    { name: 'Stability AI', domain: 'stability.ai' },
    { name: 'Pixlr', domain: 'pixlr.com' }
  ],
  '视频生成': [
    { name: 'Runway', domain: 'runwayml.com' },
    { name: 'Pika', domain: 'pika.art' },
    { name: 'HeyGen', domain: 'heygen.com' },
    { name: 'Synthesia', domain: 'synthesia.io' },
    { name: '可灵KLING', domain: 'klingai.com' },
    { name: 'CapCut', domain: 'capcut.com' },
    { name: 'Luma AI', domain: 'lumalabs.ai' },
    { name: 'Veed', domain: 'veed.io' }
  ],
  '设计创作': [
    { name: 'Canva', domain: 'canva.com' },
    { name: 'Figma', domain: 'figma.com' },
    { name: 'Notion', domain: 'notion.so' },
    { name: 'Framer', domain: 'framer.com' },
    { name: 'Remove.bg', domain: 'remove.bg' },
    { name: 'Gamma', domain: 'gamma.app' },
    { name: 'Miro', domain: 'miro.com' },
    { name: 'Beautiful.ai', domain: 'beautiful.ai' }
  ]
};

async function fetchTrancoRank(domain) {
  try {
    const response = await fetch(TRANCO_API + domain);
    if (!response.ok) return null;
    const data = await response.json();
    return data.ranks?.[0]?.rank || null;
  } catch (e) {
    return null;
  }
}

const delay = ms => new Promise(r => setTimeout(r, ms));

async function updateRankings() {
  const startTime = Date.now();
  const results = [];
  const errors = [];

  // 串行获取每个工具的排名（避免被限流）
  for (const [category, tools] of Object.entries(TOOLS_CONFIG)) {
    for (const tool of tools) {
      const rank = await fetchTrancoRank(tool.domain);
      if (rank !== null) {
        results.push({
          name: tool.name,
          domain: tool.domain,
          category,
          tranco_rank: rank,
          is_active: true,
          updated_at: new Date().toISOString()
        });
      } else {
        errors.push(`${tool.name}: 获取失败`);
      }
      await delay(200); // 200ms间隔避免限流
    }
  }

  let dbSuccess = false;
  let dbError = null;
  if (results.length > 0) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?on_conflict=domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(results)
    });
    dbSuccess = res.ok;
    if (!res.ok) {
      dbError = await res.text();
    }
  }

  return {
    success: dbSuccess,
    message: dbSuccess ? '更新成功' : '数据库更新失败',
    stats: { total: 32, success: results.length, failed: errors.length, duration: `${((Date.now() - startTime) / 1000).toFixed(1)}s` },
    errors: errors.length > 0 ? errors : undefined,
    dbError: dbError
  };
}

// 快速测试：只获取4个工具的排名
async function quickTest() {
  const testTools = [
    { name: 'ChatGPT', domain: 'chatgpt.com', category: '聊天对话' },
    { name: 'Midjourney', domain: 'midjourney.com', category: '图片生成' },
    { name: 'Runway', domain: 'runwayml.com', category: '视频生成' },
    { name: 'Canva', domain: 'canva.com', category: '设计创作' }
  ];

  const results = [];
  for (const tool of testTools) {
    const rank = await fetchTrancoRank(tool.domain);
    if (rank !== null) {
      results.push({
        name: tool.name,
        domain: tool.domain,
        category: tool.category,
        tranco_rank: rank,
        is_active: true,
        updated_at: new Date().toISOString()
      });
    }
  }

  let dbSuccess = false;
  let dbError = null;
  if (results.length > 0) {
    const res = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools?on_conflict=domain`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(results)
    });
    dbSuccess = res.ok;
    if (!res.ok) {
      dbError = await res.text();
    }
  }

  return { success: dbSuccess, results, dbError };
}

// Workers 入口
export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === '/api/update-rankings') {
      const result = await updateRankings();
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    // 快速测试接口
    if (url.pathname === '/api/quick-test') {
      const result = await quickTest();
      return new Response(JSON.stringify(result, null, 2), {
        headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' }
      });
    }

    return env.ASSETS.fetch(request);
  },

  // 定时触发器 - 每天自动更新排名
  async scheduled(event, env, ctx) {
    ctx.waitUntil(updateRankings());
  }
};
