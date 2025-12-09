// Cloudflare Pages Function - 更新排名数据
const SUPABASE_URL = "https://jqsmoygkbqukgnwzkxvq.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Impxc21veWdrYnF1a2dud3preHZxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzM1NjY1NTAsImV4cCI6MjA0OTE0MjU1MH0.QE4Yb0ncB3GK8wnAAF1YaSPKKpJJKdQv2hM9BNc8F4U";
const TRANCO_API = 'https://tranco-list.eu/api/ranks/domain/';

// 工具分类配置
const TOOLS_CONFIG = {
  '聊天对话': [
    { name: 'ChatGPT', domain: 'chatgpt.com' },
    { name: 'Claude', domain: 'claude.ai' },
    { name: 'Perplexity', domain: 'perplexity.ai' },
    { name: 'DeepSeek', domain: 'deepseek.com' },
    { name: 'Character.AI', domain: 'character.ai' },
    { name: 'Poe', domain: 'poe.com' },
    { name: 'Gemini', domain: 'gemini.google.com' },
    { name: '通义千问', domain: 'tongyi.aliyun.com' }
  ],
  '图片生成': [
    { name: 'Midjourney', domain: 'midjourney.com' },
    { name: 'Leonardo.AI', domain: 'leonardo.ai' },
    { name: 'Ideogram', domain: 'ideogram.ai' },
    { name: '海艺SeaArt', domain: 'seaart.ai' },
    { name: 'Civitai', domain: 'civitai.com' },
    { name: 'Freepik', domain: 'freepik.com' },
    { name: 'Adobe Firefly', domain: 'firefly.adobe.com' },
    { name: 'Stable Diffusion', domain: 'stability.ai' }
  ],
  '视频生成': [
    { name: 'Runway', domain: 'runwayml.com' },
    { name: 'Pika', domain: 'pika.art' },
    { name: 'HeyGen', domain: 'heygen.com' },
    { name: 'Synthesia', domain: 'synthesia.io' },
    { name: '可灵KLING', domain: 'klingai.com' },
    { name: 'CapCut', domain: 'capcut.com' },
    { name: 'Luma AI', domain: 'lumalabs.ai' },
    { name: 'Descript', domain: 'descript.com' }
  ],
  '设计创作': [
    { name: 'Canva', domain: 'canva.com' },
    { name: 'Figma', domain: 'figma.com' },
    { name: 'Notion', domain: 'notion.so' },
    { name: 'Framer', domain: 'framer.com' },
    { name: 'Remove.bg', domain: 'remove.bg' },
    { name: 'Gamma', domain: 'gamma.app' },
    { name: 'Beautiful.ai', domain: 'beautiful.ai' },
    { name: 'Miro', domain: 'miro.com' }
  ]
};

async function fetchTrancoRank(domain) {
  try {
    const response = await fetch(TRANCO_API + domain);
    if (!response.ok) return null;
    const data = await response.json();
    if (data.ranks && data.ranks.length > 0) {
      return data.ranks[0].rank;
    }
    return null;
  } catch (e) {
    return null;
  }
}

function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Pages Function 入口
export async function onRequest(context) {
  const startTime = Date.now();
  const results = [];
  const errors = [];

  for (const [category, tools] of Object.entries(TOOLS_CONFIG)) {
    for (const tool of tools) {
      const rank = await fetchTrancoRank(tool.domain);
      if (rank !== null) {
        results.push({
          name: tool.name,
          domain: tool.domain,
          category: category,
          tranco_rank: rank,
          is_active: true,
          updated_at: new Date().toISOString()
        });
      } else {
        errors.push(`${tool.name} (${tool.domain}): 获取排名失败`);
      }
      await delay(500);
    }
  }

  let dbSuccess = false;
  if (results.length > 0) {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/ai_tools`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`,
        'Prefer': 'resolution=merge-duplicates'
      },
      body: JSON.stringify(results)
    });
    dbSuccess = response.ok;
  }

  const duration = ((Date.now() - startTime) / 1000).toFixed(1);

  return new Response(JSON.stringify({
    success: dbSuccess,
    message: dbSuccess ? '排名数据更新成功' : '数据库更新失败',
    stats: {
      total: Object.values(TOOLS_CONFIG).flat().length,
      success: results.length,
      failed: errors.length,
      duration: `${duration}s`
    },
    errors: errors.length > 0 ? errors : undefined,
    updated_at: new Date().toISOString()
  }, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*'
    }
  });
}
