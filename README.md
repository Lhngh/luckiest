# 星月赴约

一个面向双人协作的专属网页应用，基于 Next.js 14、Tailwind CSS 与 Supabase 构建，支持持续记录见面计划、共读、共赏、留言与心愿。

## 功能概览

- 首页夜空主场景，展示下次见面倒计时、本月共读与共赏摘要
- 六个核心页面：首页、见面、共读、共赏、留言、心愿
- Supabase PostgreSQL 数据持久化，刷新不丢失
- 双人专属编辑链接，无需注册，公开访问默认只读
- 使用 Supabase Realtime 订阅多表变更，跨设备即时同步
- Service Worker 缓存关键页面，弱网下可查看已加载内容

## 本地启动

1. 复制环境变量

```bash
cp .env.example .env.local
```

2. 填写 `.env.local`

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `LOVE_APP_ACCESS_XING`
- `LOVE_APP_ACCESS_YUE`

3. 在 Supabase SQL Editor 执行 `supabase/schema.sql`

4. 启动项目

```bash
npm install
npm run dev
```

## 专属编辑链接

- 星星编辑链接：`https://your-domain.vercel.app/?viewer=xing&token=LOVE_APP_ACCESS_XING_VALUE`
- 月月编辑链接：`https://your-domain.vercel.app/?viewer=yue&token=LOVE_APP_ACCESS_YUE_VALUE`
- 不带参数访问时默认只读，可选公开分享

首次通过链接进入后，会写入安全 Cookie，后续同一设备可直接编辑。

## Vercel 部署

1. 将仓库推送到 GitHub
2. 在 Vercel 中 `Add New Project`
3. 选择该仓库，Framework Preset 保持 `Next.js`
4. 填入全部环境变量
5. 点击 Deploy，部署完成后会自动生成 HTTPS 域名
6. 分别生成两条带 `viewer` 和 `token` 的专属编辑链接发送给两位用户

## Supabase 配置说明

- `schema.sql` 已创建全部表、种子用户、只读策略与 Realtime 表订阅
- 前端浏览器端通过匿名 Key 读取与订阅实时数据
- 所有写入、修改、删除走 Next.js API Route，并用服务端密钥执行
- 编辑权限由专属链接 Token 控制，留言删除额外限制为只能删除本人消息

## 目录结构

```text
src/
  app/
    api/
    book/
    enjoy/
    meet/
    message/
    wish/
  components/
    client-pages/
  hooks/
  lib/
supabase/
  schema.sql
public/
  service-worker.js
  manifest.webmanifest
```
