# 毛毛的导航站 (v1.0)

永远相信美好的事即将发生。

这是一个基于 HTML/CSS/JS 的纯静态导航/博客网站，设计风格参考了 Modern Web Aesthetics (Linear, Apple, Vercel)。

## 功能特性

*   **集成式仪表盘**：顶部包含翻页时钟、实时天气（自动定位）、访客统计（本地模拟 UV）。
*   **AI 资讯轮播**：自动抓取 TechCrunch、The Verge、Wired 的最新 AI 资讯。
*   **配置模式**：点击左下角齿轮，可在线添加/编辑/删除工具和分组（数据存储在本地浏览器）。
*   **最近访问**：自动记录并置顶显示最近使用的工具。
*   **响应式设计**：适配桌面端和移动端。

## 目录结构

*   `index.html`: **导航站首页** (入口文件)
*   `blog.html`: 博客文章列表页
*   `diary.html`, `work.html`, `experience.html`, `notes.html`: 文章分类归档页
*   `posts/`: 存放具体的博客文章 HTML 文件

## 部署指南 (GitHub Pages)

本项目非常适合部署在 GitHub Pages 上，完全免费且稳定。

### 第一步：准备仓库
1.  登录 [GitHub](https://github.com/)。
2.  创建一个新的仓库（Repository），例如命名为 `my-nav-site`。
3.  勾选 "Add a README file"。

### 第二步：上传代码
1.  在你的电脑上，将本项目所有文件（保留目录结构）上传到该 GitHub 仓库。
    *   你可以使用 GitHub Desktop 工具，或者直接在网页版点击 "Add file" -> "Upload files"。
    *   确保 `index.html` 在仓库的根目录下。

### 第三步：开启 Pages
1.  进入仓库的 **Settings** (设置) 选项卡。
2.  在左侧菜单找到 **Pages**。
3.  在 **Build and deployment** 下的 **Source** 选择 "Deploy from a branch"。
4.  在 **Branch** 下选择 `main` (或 `master`) 分支，文件夹选择 `/ (root)`。
5.  点击 **Save**。

### 第四步：访问网站
等待几分钟后，刷新页面，顶部会显示你的网站链接（通常是 `https://你的用户名.github.io/仓库名/`）。点击即可访问！

## 注意事项

*   **数据存储**：本站的配置数据（新增的工具链接）存储在浏览器的 `localStorage` 中。如果你清理浏览器缓存或更换设备，配置会重置为默认状态。建议定期通过配置模式手动备份重要数据。
*   **天气接口**：使用的是 Open-Meteo 免费接口，无需 Key。
*   **统计数据**：目前的“当前在线”和“访客统计”为前端模拟展示（基于本地存储去重）。如果需要真实的流量分析，建议注册并接入 [Google Analytics](https://analytics.google.com/) 或 [不蒜子](http://ibruce.info/)。

---
© 2025 毛毛的导航站

