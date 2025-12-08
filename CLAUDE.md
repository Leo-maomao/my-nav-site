# 项目开发规范

## 设计资源参考

### UI组件库
- **UIverse** - https://uiverse.io/buttons
  - 提供精美的前端组件（按钮、卡片、表单等）
  - 建议在开发UI时参考使用

### 设计系统
- 使用 Remix Icon 图标库
- 配色以蓝紫渐变为主调
- 圆角设计，保持现代感

## 51.la 埋点事件

本项目使用51.la进行数据统计，统计ID: `3OBuXueXb41ODfzv`

| 事件标识 | 事件名称 | 说明 |
|---------|---------|------|
| `page_view` | 页面访问 | 记录页面访问 |
| `tool_click` | 工具卡片点击 | 用户点击AI工具卡片 |
| `sidebar_menu_click` | 侧边菜单点击 | 左侧分类菜单点击 |
| `search_use` | 搜索功能使用 | 切换搜索引擎时触发 |
| `banner_click` | Banner点击 | 点击顶部新闻轮播 |
| `feedback_button_click` | 反馈按钮点击 | 点击反馈浮窗按钮 |
| `feedback_submit` | 反馈提交 | 提交反馈表单 |

## 技术栈

- 纯HTML/CSS/JavaScript（无框架）
- Supabase 云端数据库
- 51.la 数据统计
- GitHub Pages / Cloudflare Pages 部署
