# Nav 项目规范

> **⚠️ 重要提醒：每次 git commit 后必须更新本文档底部的「提交记录」！**

---

## 规范依赖

本项目遵循 `../rules/CLAUDE.md` 及其索引的所有规范文档。

开发前请先阅读总纲，根据当前任务阅读对应的子文档。

---

## 项目架构

### 技术栈
- **前端**：HTML5 + CSS3 + ES6（原生，无框架）
- **后端**：Supabase（数据库 + Auth）
- **部署**：Cloudflare Workers + Pages
- **统计**：51.la

### 核心模块

| 模块 | 文件 | 职责 |
|------|------|------|
| 配置中心 | `config.js` | Supabase 客户端初始化 |
| 数据服务 | `services/data-service.js` | 工具数据、反馈的 CRUD |
| 埋点服务 | `services/analytics.js` | 51.la 事件追踪 |
| 弹窗组件 | `components/modal.js` | 通用 Modal 封装 |
| 默认数据 | `initial-data.js` | 工具种子数据（含版本号） |
| 主逻辑 | `script.js` | UI 渲染、交互、天气等 |

### 数据版本机制

工具数据支持版本控制，确保更新时自动覆盖云端旧数据：

1. `initial-data.js` 中定义 `DEFAULT_TOOLS_VERSION`
2. 页面加载时检测云端数据的 `_version` 字段
3. 若版本落后，自动用最新默认数据覆盖云端
4. **更新工具数据时，务必递增版本号**

---

## 项目特有配置

### 51.la 埋点

统计 ID: `3OBuXueXb41ODfzv`

| 事件标识 | 事件名称 | 说明 |
|---------|---------|------|
| `page_view` | 页面访问 | 记录页面访问 |
| `tool_click` | 工具卡片点击 | 用户点击AI工具卡片 |
| `sidebar_menu_click` | 侧边菜单点击 | 左侧分类菜单点击 |
| `search_use` | 搜索功能使用 | 切换搜索引擎时触发 |
| `banner_click` | Banner点击 | 点击顶部新闻轮播 |
| `feedback_button_click` | 反馈按钮点击 | 点击反馈浮窗按钮 |
| `feedback_submit` | 反馈提交 | 提交反馈表单 |

### Supabase 表结构

| 表名 | 用途 | RLS 策略 |
|------|------|----------|
| `config` | 存储工具数据等配置 | anon 可读，authenticated 可写 |
| `feedback` | 用户反馈 | anon 可写，authenticated 可读 |
| `nav_ai_tools` | AI 工具排名数据 | Worker 写入，前端读取 |

---

## 提交记录

| 日期 | Commit | 说明 |
|-----|--------|------|
| 2026-01-05 | `0dcd1d5` | style: 统一 FAB 悬浮按钮样式 |
| 2026-01-05 | `bcdbfd4` | style: 基于 rules 设计系统重构 UI 风格 |
| 2026-01-04 | `b5978be` | style: 补充组件交互状态 (active, focus-visible, disabled) |
| 2026-01-04 | `78246f2` | fix: 工具数据版本控制、登录表单优化、链接修正 |
| 2025-12-10 | `816de2f` | docs: 更新提交记录 |
| 2025-12-10 | `f36f75e` | 修复榜单：使用正确的 Supabase 配置读取排名数据 |
| 2025-12-10 | `98cb5a5` | docs: 更新提交记录 |
| 2025-12-10 | `a27e59e` | 改用串行请求避免Tranco限流 |
| 2025-12-10 | `51127ad` | 减少工具列表至32个以避免Worker超时 |
| 2025-12-10 | `0dc54a6` | 修复 Supabase upsert: 添加 on_conflict=domain 参数 |
| 2025-12-10 | `44eba8e` | 更新 Supabase URL 和 API Key |
| 2025-12-10 | `0f5f91f` | 添加快速测试接口用于调试数据库写入 |
| 2025-12-10 | `dfb691d` | 添加 Cron 定时触发器支持每日自动更新 |
| 2025-12-10 | `382a0cd` | 优化：改用批量并行请求加速Tranco API调用 |
| 2025-12-10 | `0bd69b6` | 扩展工具候选列表至60个（每分类15个） |
| 2025-12-10 | `a3bd975` | fix: 恢复 Worker 格式，修复部署 |
| 2025-12-10 | `fa0ba78` | fix: 改用 Cloudflare Pages Functions 格式 |
| 2025-12-10 | `7d11240` | fix: 改用 Worker 脚本实现更新 API |
| 2025-12-10 | `5696995` | refactor: 榜单改为从 Supabase 读取预存排名 |
| 2025-12-10 | `7224cb3` | fix: 确保榜单显示完整5个工具 |
| 2025-12-10 | `4ca362b` | fix: 改用 Cloudflare Pages Functions 实现 API 代理 |
| 2025-12-10 | `d4aa75b` | feat: 添加 Cloudflare Worker 代理解决 Tranco API CORS 问题 |
| 2025-12-10 | `385750a` | refactor: 简化榜单数据源，使用内置工具列表 |
| 2025-12-10 | `8852b69` | chore: 代码规范化 - 清理console.log、升级Remix Icon |
