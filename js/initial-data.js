// 默认工具数据 (Seed Data)
var DEFAULT_TOOLS_DATA = [
    {
        key: "text",
        name: "AI文本工具",
        icon: '<i class="ri-file-text-line"></i>',
        items: [
            { name: "ChatGPT", desc: "OpenAI 官方的多语言对话与写作助手", link: "https://chatgpt.com", icon: "https://chatgpt.com/favicon.ico" },
            { name: "Claude", desc: "Anthropic 出品的大语言模型，对话体验自然、长文能力强", link: "https://claude.ai", icon: "https://claude.ai/favicon.ico" },
            { name: "Gemini", desc: "Google 推出的 Gemini 模型，对话、搜索和办公一体", link: "https://gemini.google.com", icon: "https://gemini.google.com/favicon.ico" },
            { name: "通义千问", desc: "阿里云出品的中文友好大模型，对话、代码、办公一站式", link: "https://tongyi.aliyun.com/qianwen", icon: "https://tongyi.aliyun.com/favicon.ico" },
            { name: "文心一言", desc: "百度文心大模型的对话入口，支持搜索增强和创作", link: "https://yiyan.baidu.com", icon: "https://yiyan.baidu.com/static/favicon.ico" },
            { name: "智谱清言", desc: "智谱 AI 的对话产品，基于 GLM 系列模型", link: "https://chatglm.cn", icon: "https://chatglm.cn/favicon.ico" },
            { name: "讯飞星火", desc: "科大讯飞推出的大模型产品，擅长中文问答和办公场景", link: "https://xinghuo.xfyun.cn", icon: "https://xinghuo.xfyun.cn/favicon.ico" },
            { name: "Kimi", desc: "Moonshot AI 的长文助手，支持阅读和总结超长内容", link: "https://kimi.moonshot.cn", icon: "https://kimi.moonshot.cn/favicon.ico" },
            { name: "豆包", desc: "字节跳动推出的智能助理，支持对话、写作和办公", link: "https://www.doubao.com", icon: "https://www.doubao.com/favicon.ico" },
            { name: "Poe", desc: "Quora 出品的多模型聚合聊天平台，集成多家大模型", link: "https://poe.com", icon: "https://poe.com/favicon.ico" }
        ]
    },
    {
        key: "image",
        name: "AI图像工具",
        icon: '<i class="ri-image-line"></i>',
        items: [
            { name: "Midjourney", desc: "高质量 AI 作画社区，通过 Discord 使用", link: "https://www.midjourney.com", icon: "https://www.midjourney.com/favicon.ico" },
            { name: "DALL·E", desc: "OpenAI 的图片生成模型，支持 DALL·E 3", link: "https://labs.openai.com", icon: "https://labs.openai.com/favicon.ico" },
            { name: "Stable Diffusion", desc: "开源图像生成模型生态，支持本地和云端部署", link: "https://stability.ai", icon: "https://stability.ai/favicon.ico" },
            { name: "文心一格", desc: "百度出品的中文 AI 绘画平台", link: "https://yige.baidu.com", icon: "https://yige.baidu.com/favicon.ico" },
            { name: "通义万相", desc: "阿里通义系列的图像生成平台", link: "https://wanxiang.aliyun.com", icon: "https://wanxiang.aliyun.com/favicon.ico" },
            { name: "Civitai", desc: "Stable Diffusion 模型与作品分享社区", link: "https://civitai.com", icon: "https://civitai.com/favicon.ico" },
            { name: "OpenArt", desc: "多模型在线生图与作品社区", link: "https://openart.ai", icon: "https://openart.ai/favicon.ico" },
            { name: "NightCafe", desc: "支持多种模型的在线 AI 作画网站", link: "https://creator.nightcafe.studio", icon: "https://creator.nightcafe.studio/favicon.ico" },
            { name: "Lexica", desc: "基于 Stable Diffusion 的图库和提示词搜索网站", link: "https://lexica.art", icon: "https://lexica.art/favicon.ico" },
            { name: "Adobe Firefly", desc: "Adobe 推出的生成式图像与设计工具", link: "https://firefly.adobe.com", icon: "https://firefly.adobe.com/favicon.ico" }
        ]
    },
    {
        key: "video",
        name: "AI视频工具",
        icon: '<i class="ri-movie-line"></i>',
        items: [
            { name: "Runway", desc: "集剪辑、特效和文生视频于一体的 AI 视频平台", link: "https://runwayml.com", icon: "https://runwayml.com/favicon.ico" },
            { name: "Pika", desc: "支持文生视频、图生视频的创意视频平台", link: "https://pika.art", icon: "https://pika.art/favicon.ico" },
            { name: "HeyGen", desc: "数字人和口播视频生成平台", link: "https://www.heygen.com", icon: "https://www.heygen.com/favicon.ico" },
            { name: "Synthesia", desc: "企业级数字人视频生成工具", link: "https://www.synthesia.io", icon: "https://www.synthesia.io/favicon.ico" },
            { name: "Descript", desc: "集剪辑、配音、转写于一体的音视频编辑工具", link: "https://www.descript.com", icon: "https://www.descript.com/favicon.ico" },
            { name: "Opus Clip", desc: "长视频智能切片成多条短视频", link: "https://www.opus.pro", icon: "https://www.opus.pro/favicon.ico" },
            { name: "Veed.io", desc: "在线视频编辑与字幕、特效工具", link: "https://www.veed.io", icon: "https://www.veed.io/favicon.ico" },
            { name: "CapCut 剪映", desc: "字节出品的短视频剪辑工具，内置多种 AI 能力", link: "https://www.capcut.com", icon: "https://www.capcut.com/favicon.ico" }
        ]
    },
    {
        key: "audio",
        name: "AI音频工具",
        icon: '<i class="ri-headphone-line"></i>',
        items: [
            { name: "ElevenLabs", desc: "高质量多语种 TTS 配音平台", link: "https://elevenlabs.io", icon: "https://elevenlabs.io/favicon.ico" },
            { name: "Suno", desc: "输入一句话就能生成完整歌曲的 AI 音乐平台", link: "https://suno.ai", icon: "https://suno.ai/favicon.ico" },
            { name: "Udio", desc: "专注音乐创作的生成式 AI 工具", link: "https://www.udio.com", icon: "https://www.udio.com/favicon.ico" },
            { name: "Adobe Podcast", desc: "Adobe 出品的播客录制与音频增强工具", link: "https://podcast.adobe.com", icon: "https://podcast.adobe.com/favicon.ico" },
            { name: "AIVA", desc: "面向配乐和影视的 AI 作曲平台", link: "https://www.aiva.ai", icon: "https://www.aiva.ai/favicon.ico" },
            { name: "Krisp", desc: "会议场景的 AI 降噪工具", link: "https://krisp.ai", icon: "https://krisp.ai/favicon.ico" },
            { name: "Murf AI", desc: "配音和多语言旁白生成平台", link: "https://murf.ai", icon: "https://murf.ai/favicon.ico" },
            { name: "Voicemod", desc: "变声与实时语音效果工具", link: "https://www.voicemod.net", icon: "https://www.voicemod.net/favicon.ico" }
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
            { name: "GitHub Copilot", desc: "GitHub 与 OpenAI 联合推出的 AI 编程助手", link: "https://github.com/features/copilot", icon: "https://github.githubassets.com/favicons/favicon.svg" },
            { name: "Cursor", desc: "基于大模型的下一代编程 IDE", link: "https://cursor.sh", icon: "https://cursor.sh/favicon.ico" },
            { name: "Codeium", desc: "支持多种编辑器的免费 AI 补全与重构工具", link: "https://codeium.com", icon: "https://codeium.com/favicon.ico" },
            { name: "Replit", desc: "在线开发环境，支持 AI 生成和补全代码", link: "https://replit.com", icon: "https://replit.com/favicon.ico" },
            { name: "Tabnine", desc: "老牌 AI 代码补全插件，支持本地与云端模型", link: "https://www.tabnine.com", icon: "https://www.tabnine.com/favicon.ico" },
            { name: "AWS CodeWhisperer", desc: "亚马逊推出的云原生 AI 编程助手", link: "https://aws.amazon.com/codewhisperer/", icon: "https://aws.amazon.com/favicon.ico" },
            { name: "JetBrains AI", desc: "JetBrains 全系列 IDE 的内置 AI 助手", link: "https://www.jetbrains.com/ai/", icon: "https://www.jetbrains.com/favicon.ico" },
            { name: "CodeGeeX", desc: "面向中文和多语言的开源代码大模型工具链", link: "https://codegeex.cn", icon: "https://codegeex.cn/favicon.ico" }
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
            { name: "Diagram", desc: "Figma 生态中的 AI 设计助手", link: "https://diagram.com", icon: "https://diagram.com/favicon.ico" }
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
