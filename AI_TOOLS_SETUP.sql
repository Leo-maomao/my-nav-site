-- =============================================
-- AI工具榜单数据表
-- 在Supabase SQL Editor中执行此脚本
-- =============================================

-- 创建AI工具表
CREATE TABLE IF NOT EXISTS ai_tools (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,           -- 工具名称
    domain VARCHAR(200) NOT NULL UNIQUE,  -- 域名（用于Tranco API查询）
    category VARCHAR(50) NOT NULL,        -- 分类：chat/image/video/design
    logo VARCHAR(500),                    -- Logo URL（可选）
    description VARCHAR(500),             -- 简介（可选）
    is_active BOOLEAN DEFAULT true,       -- 是否启用
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_ai_tools_category ON ai_tools(category);
CREATE INDEX IF NOT EXISTS idx_ai_tools_active ON ai_tools(is_active);

-- 启用RLS
ALTER TABLE ai_tools ENABLE ROW LEVEL SECURITY;

-- 允许所有人读取
CREATE POLICY "Allow public read ai_tools" ON ai_tools
    FOR SELECT USING (true);

-- =============================================
-- 插入初始数据
-- =============================================

-- 聊天对话类 (chat)
INSERT INTO ai_tools (name, domain, category, description) VALUES
('ChatGPT', 'chatgpt.com', 'chat', 'OpenAI旗下对话AI'),
('Claude', 'claude.ai', 'chat', 'Anthropic旗下对话AI'),
('Perplexity', 'perplexity.ai', 'chat', 'AI搜索引擎'),
('DeepSeek', 'deepseek.com', 'chat', '深度求索对话AI'),
('Character.AI', 'character.ai', 'chat', 'AI角色扮演聊天'),
('Poe', 'poe.com', 'chat', 'Quora旗下AI聚合平台'),
('Kimi', 'kimi.moonshot.cn', 'chat', '月之暗面对话AI')
ON CONFLICT (domain) DO NOTHING;

-- 图片生成类 (image)
INSERT INTO ai_tools (name, domain, category, description) VALUES
('Midjourney', 'midjourney.com', 'image', 'AI绘画领军者'),
('Leonardo.AI', 'leonardo.ai', 'image', 'AI图像生成平台'),
('Ideogram', 'ideogram.ai', 'image', 'AI文字图像生成'),
('海艺SeaArt', 'seaart.ai', 'image', 'AI创作平台'),
('Stability AI', 'stability.ai', 'image', 'Stable Diffusion'),
('Civitai', 'civitai.com', 'image', 'AI模型社区'),
('Freepik', 'freepik.com', 'image', 'AI图像素材平台')
ON CONFLICT (domain) DO NOTHING;

-- 视频生成类 (video)
INSERT INTO ai_tools (name, domain, category, description) VALUES
('Runway', 'runwayml.com', 'video', 'AI视频生成领先者'),
('Pika', 'pika.art', 'video', 'AI视频生成'),
('HeyGen', 'heygen.com', 'video', 'AI数字人视频'),
('Synthesia', 'synthesia.io', 'video', 'AI虚拟人视频'),
('可灵KLING', 'klingai.com', 'video', '快手AI视频生成'),
('Luma AI', 'lumalabs.ai', 'video', 'AI 3D和视频'),
('CapCut', 'capcut.com', 'video', '剪映国际版AI剪辑')
ON CONFLICT (domain) DO NOTHING;

-- 设计创作类 (design)
INSERT INTO ai_tools (name, domain, category, description) VALUES
('Canva', 'canva.com', 'design', 'AI设计平台'),
('Figma', 'figma.com', 'design', '协作设计工具'),
('Notion', 'notion.so', 'design', 'AI笔记和协作'),
('Framer', 'framer.com', 'design', 'AI网站构建'),
('Remove.bg', 'remove.bg', 'design', 'AI抠图工具'),
('Gamma', 'gamma.app', 'design', 'AI演示文稿'),
('Beautiful.ai', 'beautiful.ai', 'design', 'AI PPT制作')
ON CONFLICT (domain) DO NOTHING;

-- =============================================
-- 验证数据
-- =============================================
SELECT category, COUNT(*) as count FROM ai_tools GROUP BY category ORDER BY category;
