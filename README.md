# 星月赴约

一个面向双人协作的专属网页应用，基于 Next.js 14、Tailwind CSS 与 Supabase 构建，支持持续记录见面计划、异地小事、共享相册、共读、共赏、留言与心愿。

## 功能概览

- 首页手绘夜空主场景，展示下次见面倒计时、累计见面和星球树木数量。
- 八个核心页面：首页、见面、异地、相册、共读、共赏、留言、心愿。
- 共享相册使用 Supabase Storage 保存图片，并将照片说明、拍摄日期和上传人写入数据库。
- Supabase PostgreSQL 持久化数据，刷新不丢失。
- 双人专属编辑链接，无需注册；公开访问默认只读。
- 浏览器端使用 Supabase Realtime 订阅数据变化，跨设备即时同步。
- Service Worker 缓存关键页面，弱网下可查看已加载内容。

## 本地启动

1. 安装依赖：

```bash
npm install
```

2. 新建 `.env.local` 并填写：

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=
LOVE_APP_ACCESS_XING=
LOVE_APP_ACCESS_YUE=
```

3. 在 Supabase SQL Editor 执行 `supabase/schema.sql`。脚本会创建 `album_photos` 表和 `shared-album` 公开 Storage bucket。

4. 启动项目：

```bash
npm run dev
```

## 专属编辑链接

- 星星编辑链接：`https://your-domain.vercel.app/?viewer=xing&token=LOVE_APP_ACCESS_XING_VALUE`
- 月月编辑链接：`https://your-domain.vercel.app/?viewer=yue&token=LOVE_APP_ACCESS_YUE_VALUE`
- 不带参数访问时默认为只读模式，适合公开分享。

首次通过链接进入后，应用会写入安全 Cookie，后续同一设备可直接编辑。

## Vercel 部署

1. 将仓库推送到 GitHub。
2. 在 Vercel 中选择 `Add New Project`。
3. 选择该仓库，Framework Preset 保持 `Next.js`。
4. 填入全部环境变量。
5. 在 Supabase SQL Editor 执行最新的 `supabase/schema.sql`。
6. 点击 Deploy，部署完成后会自动生成 HTTPS 域名。
7. 分别生成两条带 `viewer` 和 `token` 的专属编辑链接发给两位用户。

## Supabase 配置

- `supabase/schema.sql` 已包含全部表、种子用户、只读策略与 Realtime 表订阅。
- `supabase/schema.sql` 会创建公开 bucket：`shared-album`，限制单张图片 4MB，允许 `image/jpeg`、`image/png`、`image/webp`、`image/gif`。
- 前端浏览器端通过匿名 Key 读取与订阅实时数据。
- 所有新增、修改、删除都走 Next.js API Route，并由服务端密钥执行。相册上传和删除走 `/api/photos`。
- 编辑权限由专属链接 Token 控制；留言删除额外限制为只能删除本人消息。
