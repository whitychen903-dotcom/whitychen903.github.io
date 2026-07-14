# J-Pop Hub v2.0 — 产品需求文档 (PRD)

## 版本信息
- **版本号**: v2.0
- **发布日期**: 2026-07-08
- **部署地址**: https://whitychen903-dotcom.github.io/whitychen903.github.io/
- **技术栈**: Next.js 16 (App Router) + React 19 + TypeScript + Tailwind CSS 4 + SSG 静态导出

---

## 一、产品概述

J-Pop Hub 是一个日本音乐人信息聚合站，覆盖29组/位日本音乐人（含乐队、组合、单人艺人），提供巡演信息、社交媒体动态、粉丝热议、最新作品和经典作品的完整信息展示。支持中文、日本語、English三语言。

---

## 二、路由架构

| 路由 | 页面功能 | 状态 |
|------|----------|------|
| `/{locale}` | 首页 — Hero + Top 8 热门音乐人 | ✅ 完成 |
| `/{locale}/bands` | 音乐人列表 — 搜索 + 排序 (Billboard人气/A-Z) | ✅ 完成 |
| `/{locale}/bands/{slug}` | 音乐人详情页 — 6大模块完整展示 | ✅ 完成 |
| `/{locale}/bands/{slug}/{memberId}` | 成员详情页 — 个人信息+社交链接 | ✅ 完成 |
| `/{locale}/my-events` | 我的想看 — 收藏的巡演列表 | ⚠️ 需要登录，功能基础 |
| `/{locale}/auth/signin` | 登录页 — 邮箱登录 | ⚠️ 基础实现 |

---

## 三、导航栏

| 菜单项 | 中文 | 日本語 | English | 链接 | 状态 |
|--------|------|--------|---------|------|------|
| Logo | J-Pop Hub | J-Pop Hub | J-Pop Hub | `/{locale}` | ✅ |
| 首页 | 首页 | ホーム | Home | `/{locale}` | ✅ |
| 音乐人信息 | 音乐人信息 | アーティスト情報 | Artists | `/{locale}/bands` | ✅ |
| 我的想看 | 我的想看 | 見たいリスト | My List | `/{locale}/my-events` | ✅ |
| 语言切换 | 中文/日本語/EN | 中文/日本語/EN | 中文/日本語/EN | - | ✅ |
| 登录/退出 | 登录/退出登录 | ログイン/ログアウト | Sign In/Sign Out | - | ✅ |

**未建设项**:
- 「爱豆团」(idols) 和「大事件」(events) 在翻译文件中有定义，但导航栏中**未实现**对应链接，相关页面也**不存在**。

---

## 四、首页

### 4.1 Hero区域
- 标题: "J-Pop Hub"
- 副标题: 中文「从这里，听见日本音乐」/ 日文「ここから、日本の音楽が聴こえる」/ 英文「Discover the sound of Japan」
- CTA按钮: 「探索音乐人」→ 跳转 `/bands`
- 背景: 渐变圆形光晕 (#E5D89E)

### 4.2 热门推荐
- 标题: 「热门推荐」/「人気アーティスト」/「Top Artists」
- 展示数量: Top 8 (按 Billboard Rank 排序)
- 排序规则: billboardRank 越小越靠前
- 右侧链接: 「查看全部 →」跳转 `/bands`

---

## 五、音乐人列表页 (`/bands`)

### 5.1 搜索功能
- 支持按名称（三语言）、流派、描述搜索
- 实时过滤

### 5.2 排序模式
- **Billboard 人气排行**（默认）: 按 billboardRank 升序
- **A-Z 字母排序**: 按当前语言名称排序

### 5.3 卡片展示
- 网格布局: 2-5列响应式
- 显示: 图片、名称、流派标签
- 链接到详情页

---

## 六、音乐人详情页 (`/bands/{slug}`)

### 6.1 页面结构（7大模块，按此顺序排列）

1. **Header** — 图片、名称、流派、描述、官网/社交媒体链接
2. **成员** (Members) — 成员卡片网格，链接到成员详情页
3. **巡演信息** (Tours) — 巡演列表，含售票状态、购票链接、收藏按钮
4. **最新动态** (Social Feeds) — 社交媒体动态卡片
5. **粉丝动态** (Fan Buzz) — 粉丝热议气泡卡片
6. **最新作品** (Latest Songs) — 作品列表，含YouTube嵌入播放器
7. **经典作品** (Representative Works) — 代表作品，含YouTube嵌入播放器

> **v2.0 更新**: 最新作品和经典作品模块已移至粉丝动态之后。

### 6.2 各模块详细要求

#### 6.2.1 Header
- 图片: 音乐人主图（1:1正方形）
- 名称: 三语言
- 流派标签: 圆角背景标签
- 描述: 三语言完整介绍
- 官网链接: 可跳转
- 社交媒体图标: X (Twitter)、Instagram、TikTok、Threads（如有）

#### 6.2.2 成员模块
- **每个成员必须包含正面真人图片**（不可用乐队团体照替代）
- 卡片信息: 头像、姓名、角色
- 悬停效果: 显示「查看成员详情 →」
- 点击跳转到成员详情页

#### 6.2.3 巡演信息模块
- 每场巡演显示: 日期、场地、地点、巡演名称
- 状态标签: 即将开始/进行中/已结束
- **若有可购票的巡演，必须附带可跳转的购票链接**，落地页必须是可购票的页面
- 售票状态: 显示当前售票阶段（抽签中/一般发售/已售罄等）
- 收藏功能: 「我想看」按钮（需登录）

#### 6.2.4 最新动态模块
- **必须包含四个平台的动态**:
  - **X (Twitter)** — 至少1条
  - **Instagram** — 至少1条
  - **TikTok** — 至少1条
  - **YouTube** — 至少1条
- 每条动态显示: 平台标签、作者、日期、内容摘要、外部链接

#### 6.2.5 粉丝动态模块
- **必须包含三个平台的热议内容**:
  - **X (Twitter)** — 至少1条
  - **Instagram** — 至少1条
  - **TikTok** — 至少1条
- 气泡卡片样式，按热度排序
- 显示: 平台标签、话题标签、内容、作者、互动量

#### 6.2.6 最新作品模块
- **必须是最新更新的单曲/专辑**
- 显示: 歌曲名、类型标签（单曲/专辑/EP）、发行日期
- 歌曲介绍（如有）
- **下设可播放的YouTube URL链接**（iframe嵌入）
- 高光歌词（如有，日文+中文对照）

#### 6.2.7 经典作品模块
- **必须是该音乐人播放量最高、知名度最广的代表歌曲**
- 显示: 歌曲名、描述
- **下设准确的、可播放的YouTube URL**
- 提示: "如无法播放，请使用VPN"

### 6.3 右侧索引导航（Scroll Spy）
- 固定定位（xl屏幕可见）
- 高亮当前滚动到的模块
- 点击平滑滚动到对应模块

### 6.4 背景特效
- 仅 Official髭男dism 和 Mrs. GREEN APPLE 有专辑封面拼贴背景

---

## 七、成员详情页 (`/bands/{slug}/{memberId}`)

### 7.1 信息展示
- 头像: **必须是真人正面照片**（不可用团体照或默认头像）
- 姓名、角色、所属音乐人
- 信息网格: 生日（含年龄计算）、出生地、血型、身高
- 加入故事

### 7.2 社交媒体链接
- **必须设置可跳转链接**
- **必须保证真实性和准确性**
- 支持的平台: X (Twitter)、Instagram、TikTok、YouTube
- 链接格式:
  - X: `https://x.com/{handle}`
  - Instagram: `https://instagram.com/{handle}`
  - TikTok: `https://tiktok.com/@{handle}`
  - YouTube: `https://youtube.com/{channel}`

### 7.3 关联动态
- 显示该成员相关的社交动态（按作者名匹配）

---

## 八、音乐人数据完整性总览

### 8.1 当前收录音乐人 (29组)

| # | 名称 | Billboard Rank | 类型 | 成员数 | 成员有真人图 | 社交动态四平台 | 粉丝热议三平台 | 巡演购票链接 | 代表作品YouTube |
|---|------|:---:|------|:---:|:---:|:---:|:---:|:---:|:---:|
| 1 | Mrs. GREEN APPLE | 1 | 乐队 | 3 | ✅ 全部 | ✅ X/IG/TikTok/缺YouTube | ✅ X/IG/TikTok | ✅ | ✅ |
| 2 | back number | 2 | 乐队 | 3 | ✅ 全部 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 3 | 米津玄師 | 3 | 单人 | 1 | ⚠️ 乐队图 | ⚠️ X/IG/TikTok/缺YouTube | ✅ X/IG/TikTok | ✅ | ✅ |
| 4 | Vaundy | 4 | 单人 | 1 | ✅ 真人图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 5 | Snow Man | 6 | 组合 | 9 | ✅ 全部 | ⚠️ X/IG/TikTok/缺YouTube | ✅ X/IG/TikTok | ✅ | ✅ |
| 6 | Official髭男dism | 7 | 乐队 | 4 | ✅ 全部 | ⚠️ X/IG/缺TikTok/缺YouTube | ⚠️ X/IG/缺TikTok | ✅ | ✅ |
| 7 | 藤井風 | 8 | 单人 | 1 | ✅ 真人图 | ⚠️ X/IG/TikTok/缺YouTube | ✅ X/IG/TikTok | ✅ | ✅ |
| 8 | YOASOBI | 9 | 组合 | 2 | ⚠️ ikura用乐队图 | ⚠️ X/IG/TikTok/缺YouTube | ✅ X/IG/TikTok | ✅ | ✅ |
| 9 | King Gnu | 11 | 乐队 | 4 | ✅ 全部 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 10 | Ado | 12 | 单人 | 1 | ⚠️ 乐队图 | ⚠️ X/IG/TikTok/缺YouTube | ✅ X/IG/TikTok | ✅ | ✅ |
| 11 | サカナクション | 13 | 乐队 | 1 | ✅ 山口一郎真人图 | ⚠️ 仅X/缺IG/TikTok/YouTube | ⚠️ 仅X/缺IG/TikTok | ⚠️ 无购票链接 | ⚠️ 仅1首 |
| 12 | Creepy Nuts | 14 | 组合 | 2 | ✅ 全部 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 13 | あいみょん | 15 | 单人 | 1 | ⚠️ 乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ⚠️ 无购票链接 | ✅ |
| 14 | ONE OK ROCK | 16 | 乐队 | 4 | ⚠️ Ryota用乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 15 | RADWIMPS | 18 | 乐队 | 3 | ⚠️ 桑原/武田用乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 16 | B'z | 19 | 组合 | 2 | ⚠️ 松本孝弘用乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 17 | 星野源 | 20 | 单人 | 1 | ✅ 真人图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 18 | 宇多田ヒカル | 21 | 单人 | 1 | ✅ 真人图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 19 | 嵐 | 22 | 组合 | 5 | ⚠️ 二宫和也用乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | N/A 无巡演 | ✅ |
| 20 | Superfly | 23 | 单人 | 1 | ⚠️ 乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 21 | BUMP OF CHICKEN | 24 | 乐队 | 1 | ⚠️ 乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 22 | sumika | 25 | 乐队 | 1 | ⚠️ 乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ⚠️ 仅1首 |
| 23 | SEKAI NO OWARI | 26 | 乐队 | 4 | ⚠️ Fukase/DJ LOVE用乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 24 | Aimer | 27 | 单人 | 1 | ✅ 真人图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 25 | LiSA | 28 | 单人 | 1 | ⚠️ 乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 26 | スピッツ | 29 | 乐队 | 1 | ⚠️ 乐队图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 27 | MISIA | 30 | 单人 | 1 | ✅ 真人图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 28 | 椎名林檎 | 31 | 单人 | 1 | ✅ 真人图 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |
| 29 | ゆず | 32 | 组合 | 2 | ✅ 全部 | ✅ X/IG/TikTok/YT | ✅ X/IG/TikTok | ✅ | ✅ |

### 8.2 已知问题清单

#### 高优先级（影响核心体验）
1. **最新动态缺YouTube平台**: Official髭男dism, 米津玄師, 藤井風, YOASOBI, Ado, サカナクション, Snow Man（7组）
2. **粉丝热议缺TikTok平台**: Official髭男dism, サカナクション（2组）
3. **成员图片用乐队图替代**: 米津玄師, YOASOBI ikura, Ado, あいみょん, ONE OK ROCK Ryota, RADWIMPS 桑原彰/武田祐介, B'z 松本孝弘, 嵐 二宫和也, Superfly, BUMP OF CHICKEN, sumika, SEKAI NO OWARI Fukase/DJ LOVE, LiSA, スピッツ（15个成员）
4. **サカナクション 数据严重不全**: 仅1条社交动态、1条粉丝热议、无购票链接、仅1首代表作品

#### 中优先级
5. **あいみょん 巡演无购票链接**
6. **嵐 无巡演**（团体活动休止中，合理）
7. **サカナクション 成员不全**（仅山口一郎）
8. **sumika 仅1首代表作品**

#### 低优先级
9. threadHandle 全部为 undefined（Threads 平台暂无数据）
10. 部分成员图片文件极小可能损坏

---

## 九、未建设功能

### 9.1 我的想看 (`/my-events`)
- 当前状态: 基础框架存在，需要登录后才能使用
- 功能: 查看已收藏的巡演列表
- **未建设**: 收藏功能的前端交互、更好的空状态设计、巡演详情链接

### 9.2 爱豆团 (`/idols`)
- 当前状态: 翻译文件中有定义，但**页面完全不存在**
- 目标: 独立展示日本偶像团体信息

### 9.3 大事件 (`/events`)
- 当前状态: 翻译文件中有定义，但**页面完全不存在**
- 目标: 展示日本音乐界重要事件/新闻

### 9.4 登录系统
- 当前状态: NextAuth + 邮箱登录，基础可用但功能简单
- 未建设: 更丰富的用户系统、个人资料、收藏同步

### 9.5 图片优化
- 当前状态: 部分成员仍使用乐队团体照，需下载更多真人照片

### 9.6 后台管理
- 当前状态: 数据手动维护在 `src/data/bands.ts`
- 未建设: CMS/管理后台

---

## 十、设计规范

### 10.1 颜色系统
- **主色调**: `#6F8436` (橄榄绿)
- **深色**: `#38460C` (深橄榄)
- **浅色**: `#E5D89E` (米黄)
- **背景**: `#F5F0E0` (奶油色)
- **白色**: `#FFFFFF` 配合 `backdrop-blur` 毛玻璃效果

### 10.2 排版
- 字体: 系统默认无衬线字体
- Hero标题: text-4xl ~ text-6xl, font-bold
- 模块标题: text-[13px], font-medium, text-neutral-400, uppercase
- 正文: text-[15px] 或 text-[13px]

### 10.3 组件风格
- 卡片: rounded-xl, bg-white/80, backdrop-blur-sm, border-neutral-200/60
- 按钮: rounded-full 或 rounded-lg
- 标签: rounded-full, text-[11px]
- 头像: rounded-full (成员) / rounded-2xl (详情页)

---

## 十一、多语言支持

| 语言 | 代码 | 翻译文件 |
|------|------|----------|
| 中文 | zh | `src/messages/zh/common.ts` |
| 日本語 | ja | `src/messages/ja/common.ts` |
| English | en | `src/messages/en/common.ts` |

翻译覆盖: nav (7个key)、home (4个key)、bands (24个key)、member (8个key)、auth (4个key)、common (4个key)，三语言完整。

---

## 十二、部署信息

- **仓库**: whitychen903-dotcom/whitychen903.github.io
- **部署方式**: GitHub Pages (静态导出)
- **构建命令**: `npm run build` (output: "export")
- **basePath**: `/whitychen903.github.io`
- **图片路径**: 通过 `withBasePath()` 函数处理 basePath

---

*本文档为 J-Pop Hub v2.0 的完整产品需求文档，记录了当前已实现的所有功能和已知问题。*
