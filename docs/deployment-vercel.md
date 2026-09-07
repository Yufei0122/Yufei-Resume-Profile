# Vercel 部署说明

当前网站可以作为静态站点部署。页面内容、图片、PDF、地图概览数据随 Vite 打包；不需要启动 FastAPI、MySQL，也不需要填写环境变量。

## 1. 本地确认

使用 Node.js **24.x**，在仓库根目录运行：

```bash
npm run setup
npm run build
npm run preview
```

预览地址为 `http://localhost:4173`。`setup` 使用锁文件安装依赖；`build` 会依次检查资源路径大小写、运行测试、生成 `frontend/dist`，最后检查产物中的资源引用及本地开发地址。

桌面 3D 和地图模块按需加载，构建时的大文件提示不影响部署。移动端沿用现有卡片方案。

## 2. 提交代码

将修改和新增文件提交并推送到 GitHub，特别是源代码、图片/PDF、`scripts/`、前端测试、`frontend/package-lock.json`、`vercel.json` 和 `.nvmrc`。只保存在本地的未跟踪文件不会出现在 Vercel 构建中。

不要提交 `.env`、`node_modules`、`frontend/dist` 或 `.vercel`。部署时会重新安装依赖并生成产物。

## 3. 导入 Vercel

在 Vercel 选择 **Add New → Project**，导入 GitHub 仓库 `Yufei0122/Yufei-Resume-Profile`。

| 配置项 | 值 |
| --- | --- |
| Root Directory | 保留仓库根目录 `.`，不要选 `frontend` |
| Framework Preset | Vite |
| Node.js Version | 24.x |
| Install Command | `npm run setup` |
| Build Command | `npm run build` |
| Output Directory | `frontend/dist` |
| Environment Variables | 无需配置 |

根目录 `vercel.json` 已设置安装、构建和产物目录，`package.json` 的 `engines.node` 固定为 24.x。确认以上设置后点击 **Deploy**。绑定 Git 仓库后，后续推送由 Vercel 自动构建。

本次准备部署配置不会自动提交代码、推送仓库或创建线上项目。

## 4. 部署后检查

- 在桌面和手机查看 Home、Projects、Experience、Contact。
- 直接打开 `/#projects`、`/#experience`、`/#/lens/gis`、`/#/lens/it`、`/#/lens/integrated`，确认对应内容正常；刷新页面后应回到首页 Hero 顶部。
- 检查项目图片和 PDF 链接，滚动到经历区域检查地图。
- 确认手机展示原有移动版 Hero，桌面按需加载 3D 场景。
- 检查浏览器控制台和 Network，没有本地资源 404 或指向 localhost 的请求。

Google Fonts 和 OpenStreetMap 图块由浏览器向外部服务请求，加载情况取决于访问者的网络；无需为它们配置密钥。

### 导航状态

当前首页没有独立的 Skills 内容区域，因此已按要求隐藏桌面版和手机版共用的 `Skills` 导航入口。

## 本次验证记录

- Node.js 24 下使用锁文件在独立目录重新安装依赖，生产构建通过。
- 61 处本地引用通过大小写检查；现有 5 项测试通过；安装时的依赖审计为 0 个已知漏洞。
- Chrome 生产预览检查 390×844 和 1440×900 两种尺寸：移动端卡片切换、桌面 WebGL、地图加载与筛选均正常；检查的 hash 页面可以打开和刷新。
- 全部项目筛选下的 9 张图片解码正常，3 份 PDF 返回 HTTP 200；最终浏览器检查没有 JavaScript 错误或资源请求失败。
- 部署准备修正了图片引用大小写，并在 HTML 头部增加空 favicon 声明，避免请求不存在的 `/favicon.ico`；随后按要求隐藏 Skills 导航入口。

以上是本地生产构建和浏览器验证结果；尚未创建 Vercel 线上部署。上线后的域名、缓存响应头和外部资源访问需按上述步骤确认。

## 路由与缓存

当前采用 hash 路由。`/#projects` 等链接在服务器看来仍然访问 `/`，因此无需把所有路径重写到 `index.html`。错误的图片或脚本地址应返回 404，以便发现资源缺失。

`index.html` 在页面解析早期关闭浏览器自动滚动位置恢复，并在刷新时清除 URL hash；`src/main.js` 在刷新初始化首页后立即滚动到网页顶部。普通导航点击和首次打开深链接仍按原有目标跳转。

`/assets/` 下的文件名由内容生成哈希，配置为一年不可变缓存；首页配置为每次重新验证。更改资源后，Vite 生成新文件名，浏览器会获取新版本。

## 常见问题

- **找不到 package.json 或 scripts**：Root Directory 应为仓库根目录。
- **图片在本地可用，线上构建失败**：Linux 区分大小写。按构建提示修正路径，并确认文件已提交。本次已修正 `Human-centered-design.png` 的引用。
- **npm ci 报锁文件不一致**：本地运行 `npm --prefix frontend install`，检查并提交更新后的 `frontend/package-lock.json`，再运行完整构建。
- **输出目录不存在**：使用 `npm run build`，Output Directory 填 `frontend/dist`。
- **地图测试失败**：检查经历条目的 placeId 与地点数据是否一致；有意调整数据时同步相关断言。
- **字体或图块加载失败**：检查浏览器中 Google Fonts/OpenStreetMap 请求与访问网络。

## 官方参考

- [Vercel 的 Vite 部署文档](https://vercel.com/docs/frameworks/frontend/vite)
- [vercel.json 配置](https://vercel.com/docs/project-configuration/vercel-json)
- [Vercel 支持的 Node.js 版本](https://vercel.com/docs/functions/runtimes/node-js/node-js-versions)
- [Vercel 缓存响应头](https://vercel.com/docs/caching/cache-control-headers)
