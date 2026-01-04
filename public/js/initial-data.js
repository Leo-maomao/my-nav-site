// 默认工具数据 (Seed Data)
// 版本号：更新工具数据时递增此值，会强制覆盖云端旧数据
var DEFAULT_TOOLS_VERSION = 3;

var DEFAULT_TOOLS_DATA = [
    {
        key: "text",
        name: "AI文本工具",
        icon: '<i class="ri-file-text-line"></i>',
        items: [
            { name: "ChatGPT", desc: "OpenAI 官方的多语言对话与写作助手，支持 GPT-4o", link: "https://chatgpt.com", icon: "https://chatgpt.com/favicon.ico" },
            { name: "Claude", desc: "Anthropic 出品的大语言模型，Claude 3.5 长文能力强", link: "https://claude.ai", icon: "https://claude.ai/favicon.ico" },
            { name: "DeepSeek", desc: "深度求索出品，开源模型性能媲美 GPT-4，价格极低", link: "https://chat.deepseek.com", icon: "https://chat.deepseek.com/favicon.ico" },
            { name: "Gemini", desc: "Google 推出的 Gemini 2.0 模型，多模态能力领先", link: "https://gemini.google.com", icon: "https://gemini.google.com/favicon.ico" },
            { name: "Kimi", desc: "Moonshot AI 的长文助手，支持 200 万字超长上下文", link: "https://kimi.moonshot.cn", icon: "https://kimi.moonshot.cn/favicon.ico" },
            { name: "豆包", desc: "字节跳动推出的智能助理，日活过亿的国民级 AI", link: "https://www.doubao.com", icon: "https://www.doubao.com/favicon.ico" },
            { name: "通义千问", desc: "阿里云出品，Qwen 系列模型开源领先", link: "https://tongyi.aliyun.com/qianwen", icon: "https://tongyi.aliyun.com/favicon.ico" },
            { name: "文心一言", desc: "百度文心大模型，深度集成搜索能力", link: "https://yiyan.baidu.com", icon: "https://yiyan.baidu.com/static/favicon.ico" },
            { name: "腾讯元宝", desc: "腾讯混元大模型对话产品，支持微信生态", link: "https://yuanbao.tencent.com", icon: "https://yuanbao.tencent.com/favicon.ico" },
            { name: "海螺AI", desc: "MiniMax 出品，擅长角色扮演和创意写作", link: "https://hailuoai.com", icon: "https://hailuoai.com/favicon.ico" },
            { name: "智谱清言", desc: "智谱 AI 的 GLM-4 对话产品，中文理解优秀", link: "https://chatglm.cn", icon: "https://chatglm.cn/favicon.ico" },
            { name: "Perplexity", desc: "AI 原生搜索引擎，实时联网回答问题", link: "https://www.perplexity.ai", icon: "https://www.perplexity.ai/favicon.ico" }
        ]
    },
    {
        key: "image",
        name: "AI图像工具",
        icon: '<i class="ri-image-line"></i>',
        items: [
            { name: "Midjourney", desc: "最受欢迎的 AI 绘画工具，V6 画质惊艳", link: "https://www.midjourney.com", icon: "https://www.midjourney.com/favicon.ico" },
            { name: "DALL·E 3", desc: "OpenAI 图像生成，集成在 ChatGPT 中使用", link: "https://openai.com/dall-e-3", icon: "https://openai.com/favicon.ico" },
            { name: "Ideogram", desc: "文字渲染能力最强的 AI 绘图工具", link: "https://ideogram.ai", icon: "https://ideogram.ai/favicon.ico" },
            { name: "Leonardo.AI", desc: "专业级 AI 图像生成平台，模型丰富", link: "https://leonardo.ai", icon: "https://leonardo.ai/favicon.ico" },
            { name: "Flux", desc: "Black Forest Labs 开源模型，生成质量领先", link: "https://flux1.ai", icon: "https://flux1.ai/favicon.ico" },
            { name: "可图 Kolors", desc: "快手出品的中文友好图像生成模型", link: "https://kolors.kuaishou.com", icon: "https://kolors.kuaishou.com/favicon.ico" },
            { name: "通义万相", desc: "阿里通义系列图像生成，支持中文提示词", link: "https://tongyi.aliyun.com/wanxiang", icon: "https://tongyi.aliyun.com/favicon.ico" },
            { name: "Stable Diffusion", desc: "开源图像生成生态，SD3/SDXL 本地部署", link: "https://stability.ai", icon: "https://stability.ai/favicon.ico" },
            { name: "Adobe Firefly", desc: "Adobe 官方 AI 生成工具，版权安全", link: "https://firefly.adobe.com", icon: "https://firefly.adobe.com/favicon.ico" },
            { name: "Civitai", desc: "最大的 SD 模型与 LoRA 分享社区", link: "https://civitai.com", icon: "https://civitai.com/favicon.ico" }
        ]
    },
    {
        key: "video",
        name: "AI视频工具",
        icon: '<i class="ri-movie-line"></i>',
        items: [
            { name: "Sora", desc: "OpenAI 革命性文生视频模型，电影级画质", link: "https://sora.com", icon: "https://sora.com/favicon.ico" },
            { name: "可灵 Kling", desc: "快手出品，国产视频生成天花板，支持 5 秒", link: "https://klingai.kuaishou.com", icon: "https://klingai.kuaishou.com/favicon.ico" },
            { name: "即梦 Jimeng", desc: "字节跳动 AI 视频生成，与剪映深度集成", link: "https://jimeng.jianying.com", icon: "https://jimeng.jianying.com/favicon.ico" },
            { name: "Vidu", desc: "生数科技出品，国内首个长视频生成模型", link: "https://www.vidu.studio", icon: "https://www.vidu.studio/favicon.ico" },
            { name: "Runway Gen-3", desc: "专业级 AI 视频生成与特效平台", link: "https://runwayml.com", icon: "https://runwayml.com/favicon.ico" },
            { name: "Luma Dream Machine", desc: "快速高质量的视频生成工具", link: "https://lumalabs.ai/dream-machine", icon: "https://lumalabs.ai/favicon.ico" },
            { name: "Pika 2.0", desc: "视频生成新锐，特效和编辑能力强", link: "https://pika.art", icon: "https://pika.art/favicon.ico" },
            { name: "HeyGen", desc: "数字人和口播视频生成领导者", link: "https://www.heygen.com", icon: "https://www.heygen.com/favicon.ico" },
            { name: "CapCut 剪映", desc: "字节出品，内置 AI 剪辑和特效", link: "https://www.capcut.com", icon: "https://www.capcut.com/favicon.ico" },
            { name: "Opus Clip", desc: "长视频智能切片成多条短视频", link: "https://www.opus.pro", icon: "https://www.opus.pro/favicon.ico" }
        ]
    },
    {
        key: "audio",
        name: "AI音频工具",
        icon: '<i class="ri-headphone-line"></i>',
        items: [
            { name: "Suno", desc: "最火的 AI 音乐生成，一句话创作完整歌曲", link: "https://suno.com", icon: "https://suno.com/favicon.ico" },
            { name: "Udio", desc: "专业级 AI 音乐创作，音质出众", link: "https://www.udio.com", icon: "https://www.udio.com/favicon.ico" },
            { name: "ElevenLabs", desc: "最逼真的 AI 语音合成与克隆平台", link: "https://elevenlabs.io", icon: "https://elevenlabs.io/favicon.ico" },
            { name: "海绵音乐", desc: "字节跳动 AI 音乐生成，中文歌词优秀", link: "https://www.haimian.com", icon: "https://www.haimian.com/favicon.ico" },
            { name: "天工音乐", desc: "昆仑万维出品的中文 AI 音乐创作", link: "https://music.tiangong.cn", icon: "https://music.tiangong.cn/favicon.ico" },
            { name: "Adobe Podcast", desc: "Adobe 出品的播客录制与音频增强", link: "https://podcast.adobe.com", icon: "https://podcast.adobe.com/favicon.ico" },
            { name: "Murf AI", desc: "企业级 AI 配音和旁白生成", link: "https://murf.ai", icon: "https://murf.ai/favicon.ico" },
            { name: "Krisp", desc: "实时 AI 降噪，会议必备", link: "https://krisp.ai", icon: "https://krisp.ai/favicon.ico" }
        ]
    },
    {
        key: "office",
        name: "AI办公工具",
        icon: '<i class="ri-briefcase-4-line"></i>',
        items: [
            { name: "Notion AI", desc: "集笔记、文档和数据库于一体的工作空间，内置 AI 助手", link: "https://www.notion.so", icon: "https://www.notion.so/favicon.ico" },
            { name: "飞书文档", desc: "字节跳动出品的协作套件，支持 AI 总结和写作", link: "https://www.feishu.cn", icon: "https://www.feishu.cn/favicon.ico" },
            { name: "石墨文档", desc: "国内老牌在线文档工具，支持智能写作", link: "https://shimo.im", icon: "https://shimo.im/favicon.ico" },
            { name: "Microsoft Copilot", desc: "深度集成在 Office / Windows 里的 AI 助手", link: "https://www.microsoft.com/microsoft-365/copilot", icon: "https://www.microsoft.com/favicon.ico" },
            { name: "Google Workspace", desc: "Gmail / Docs / Sheets 等协作套件，内置 Gemini 能力", link: "https://workspace.google.com", icon: "https://workspace.google.com/favicon.ico" },
            { name: "Slack", desc: "团队沟通工具，支持 AI 总结和智能搜索", link: "https://slack.com", icon: "https://slack.com/favicon.ico" },
            { name: "AiPPT", desc: "中文场景友好的 AI PPT 生成工具", link: "https://www.aippt.cn", icon: "https://www.aippt.cn/favicon.ico" },
            { name: "ClickUp AI", desc: "项目管理与任务协作平台，集成 AI 写作和总结", link: "https://clickup.com/ai", icon: "https://clickup.com/favicon.ico" }
        ]
    },
    {
        key: "code",
        name: "AI编程工具",
        icon: '<i class="ri-code-s-slash-line"></i>',
        items: [
            { name: "Cursor", desc: "最火的 AI IDE，深度集成 Claude 和 GPT", link: "https://cursor.com", icon: "https://cursor.com/favicon.ico" },
            { name: "GitHub Copilot", desc: "GitHub 官方 AI 编程助手，支持多模型", link: "https://github.com/features/copilot", icon: "https://github.githubassets.com/favicons/favicon.svg" },
            { name: "Windsurf", desc: "Codeium 推出的 AI-first IDE，免费强大", link: "https://codeium.com/windsurf", icon: "https://codeium.com/favicon.ico" },
            { name: "v0.dev", desc: "Vercel 推出的 AI 前端代码生成工具", link: "https://v0.dev", icon: "https://v0.dev/favicon.ico" },
            { name: "bolt.new", desc: "StackBlitz 出品，对话式全栈开发", link: "https://bolt.new", icon: "https://bolt.new/favicon.ico" },
            { name: "Replit Agent", desc: "在线 IDE 的 AI 自动开发助手", link: "https://replit.com", icon: "https://replit.com/favicon.ico" },
            { name: "Amazon Q", desc: "AWS 新一代 AI 开发助手，原 CodeWhisperer", link: "https://aws.amazon.com/q/", icon: "https://aws.amazon.com/favicon.ico" },
            { name: "JetBrains AI", desc: "JetBrains 全家桶内置 AI 助手", link: "https://www.jetbrains.com/ai/", icon: "https://www.jetbrains.com/favicon.ico" },
            { name: "Codeium", desc: "免费的 AI 代码补全，支持多编辑器", link: "https://codeium.com", icon: "https://codeium.com/favicon.ico" },
            { name: "通义灵码", desc: "阿里云 AI 编程助手，中文友好", link: "https://tongyi.aliyun.com/lingma", icon: "https://tongyi.aliyun.com/favicon.ico" }
        ]
    },
    {
        key: "design",
        name: "AI设计工具",
        icon: '<i class="ri-palette-line"></i>',
        items: [
            { name: "Figma", desc: "主流 UI / UX 设计协作工具，支持 AI 辅助", link: "https://www.figma.com", icon: "https://www.figma.com/favicon.ico" },
            { name: "Canva", desc: "人人可用的在线设计平台，内置大量 AI 功能", link: "https://www.canva.com", icon: "https://www.canva.com/favicon.ico" },
            { name: "Framer", desc: "可视化建站工具，支持 AI 一键生成网站", link: "https://www.framer.com", icon: "https://www.framer.com/favicon.ico" },
            { name: "Uizard", desc: "支持草图转界面的原型设计工具", link: "https://uizard.io", icon: "https://uizard.io/favicon.ico" },
            { name: "Visily", desc: "面向产品和运营的低门槛原型设计工具", link: "https://www.visily.ai", icon: "https://www.visily.ai/favicon.ico" },
            { name: "Figma AI", desc: "Figma 官方内置的 AI 设计功能（原 Diagram）", link: "https://www.figma.com/ai", icon: "https://www.figma.com/favicon.ico" }
        ]
    },
    {
        key: "news",
        name: "AI资讯工具",
        icon: '<i class="ri-newspaper-line"></i>',
        items: [
            { name: "AI工具集导航", desc: "中文 AI 工具和资讯导航站", link: "https://ai-bot.cn", icon: "https://ai-bot.cn/favicon.ico" },
            { name: "Futurepedia", desc: "收录上千款 AI 工具的英文导航网站", link: "https://www.futurepedia.io", icon: "https://www.futurepedia.io/favicon.ico" },
            { name: "TopAI Tools", desc: "聚合热门 AI 产品和工具的导航站", link: "https://topai.tools", icon: "https://topai.tools/favicon.ico" },
            { name: "Hugging Face", desc: "开源模型社区，同时也是 AI 资讯与教程中心", link: "https://huggingface.co", icon: "https://huggingface.co/favicon.ico" },
            { name: "OpenAI Blog", desc: "OpenAI 官方博客，发布产品更新与技术文章", link: "https://openai.com/blog", icon: "https://openai.com/favicon.ico" },
            { name: "Anthropic News", desc: "Anthropic 官方新闻与技术动态", link: "https://www.anthropic.com/news", icon: "https://www.anthropic.com/favicon.ico" },
            { name: "DeepLearning.ai", desc: "Ng 团队运营的 AI 教程与新闻平台", link: "https://www.deeplearning.ai", icon: "https://www.deeplearning.ai/favicon.ico" }
        ]
    },
    {
        key: "model",
        name: "AI模型工具",
        icon: '<i class="ri-cpu-line"></i>',
        items: [
            { name: "Hugging Face Models", desc: "最大规模的开源模型与数据集仓库", link: "https://huggingface.co/models", icon: "https://huggingface.co/favicon.ico" },
            { name: "ModelScope 魔搭社区", desc: "阿里巴巴达摩院的模型社区，提供大量开源模型", link: "https://modelscope.cn", icon: "https://modelscope.cn/favicon.ico" },
            { name: "OpenAI Platform", desc: "OpenAI 模型调用与管理平台", link: "https://platform.openai.com", icon: "https://platform.openai.com/favicon.ico" },
            { name: "Google AI Studio", desc: "Gemini 等模型的在线试用与 API 控制台", link: "https://ai.google.dev", icon: "https://ai.google.dev/favicon.ico" },
            { name: "Anthropic Console", desc: "Claude 模型的 API 控制台和工具集", link: "https://console.anthropic.com", icon: "https://console.anthropic.com/favicon.ico" },
            { name: "Replicate", desc: "按调用计费的模型托管与部署平台", link: "https://replicate.com", icon: "https://replicate.com/favicon.ico" },
            { name: "Together AI", desc: "聚合多家开源和商用模型的推理平台", link: "https://www.together.ai", icon: "https://www.together.ai/favicon.ico" },
            { name: "Cohere", desc: "提供文本与嵌入等多种企业级模型服务", link: "https://cohere.com", icon: "https://cohere.com/favicon.ico" }
        ]
    },
    {
        key: "prompt",
        name: "AI指令工具",
        icon: '<i class="ri-lightbulb-line"></i>',
        items: [
            { name: "PromptBase", desc: "可买卖提示词的专业 Prompt 市场", link: "https://promptbase.com", icon: "https://promptbase.com/favicon.ico" },
            { name: "FlowGPT", desc: "聚合社区优秀提示词与工作流的平台", link: "https://flowgpt.com", icon: "https://flowgpt.com/favicon.ico" },
            { name: "PromptHero", desc: "面向绘画和多模态的提示词社区", link: "https://prompthero.com", icon: "https://prompthero.com/favicon.ico" },
            { name: "AIPRM", desc: "为 ChatGPT 等模型提供大量预设提示词模板", link: "https://www.aiprm.com", icon: "https://www.aiprm.com/favicon.ico" },
            { name: "Awesome ChatGPT Prompts", desc: "GitHub 上整理的高质量 ChatGPT 提示词集合", link: "https://github.com/f/awesome-chatgpt-prompts", icon: "https://github.githubassets.com/favicons/favicon.svg" },
            { name: "Learn Prompting", desc: "系统讲解提示工程知识的开源课程", link: "https://learnprompting.org", icon: "https://learnprompting.org/favicon.ico" },
            { name: "SnackPrompt", desc: "可收藏和分享的提示词小组件平台", link: "https://snackprompt.com", icon: "https://snackprompt.com/favicon.ico" },
            { name: "PromptingGuide", desc: "介绍最佳实践和范式的 Prompt 指南站点", link: "https://promptingguide.ai", icon: "https://promptingguide.ai/favicon.ico" }
        ]
    }
];
