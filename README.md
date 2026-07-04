# 2014:我的十二年

从 2014 年高考开始的人生模拟器。**[▶ 在线试玩](https://sonnyhenry.github.io/life-simulator-2014/)**

设计文档见 [GAME_DESIGN.md](./GAME_DESIGN.md),技术架构见 [TECH_ARCHITECTURE.md](./TECH_ARCHITECTURE.md)。

推送到 main 会自动触发部署(`.github/workflows/deploy.yml`):质量门禁(typecheck/test/validate/simulate --check)通过后发布到 GitHub Pages。

当前开发交接记录见 [AGENT_HANDOFF.md](./AGENT_HANDOFF.md)。后续模型接手时建议先读它。

## 结构

- `packages/core` — 游戏引擎(纯 TS,零平台依赖)
- `packages/content` — 游戏内容(纯数据)
- `packages/tools` — 校验与模拟 CLI
- `packages/web` — Web 前端(M1)

## 本地启动 / 停止

```bash
pnpm install          # 首次运行前安装依赖
pnpm dev              # 启动 Web 开发服务器,浏览器打开 http://localhost:5173
```

停止:在运行 `pnpm dev` 的终端按 `Ctrl+C`。如果终端已经关掉、进程还占着端口,可以用:

```bash
lsof -ti:5173 | xargs kill   # 杀掉占用 5173 端口的进程
```

端口固定为 5173(`packages/web/vite.config.ts` 里 `strictPort: true`,被占用时会直接报错而不是换端口)。

预览生产构建:

```bash
pnpm --filter @life-sim/web build     # 构建到 packages/web/dist
pnpm --filter @life-sim/web preview   # 本地预览构建产物,同样 Ctrl+C 停止
```

## 微信小程序

Taro 小程序工程在 `apps/miniprogram`,复用同一份 `packages/core` 引擎和 `packages/content` 内容包。

```bash
pnpm --filter @life-sim/miniprogram typecheck
pnpm --filter @life-sim/miniprogram build:weapp
```

构建产物在 `apps/miniprogram/dist`。微信开发者工具导入项目时选择 `apps/miniprogram`,它的 `project.config.json` 已指向 `dist/`。

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm test             # 引擎单元测试
pnpm validate         # 内容静态校验
pnpm typecheck        # 全仓类型检查
pnpm simulate -n 500  # 机器人自动打 500 局,输出结局分布/分组统计/年度心态曲线
pnpm simulate -n 1000 --check    # 分布目标门禁(全覆盖/全可达/无>40%/兜底≤35%/提前≤10%)
pnpm simulate -n 500 --compare   # 随机/卷钱/保心态三种策略 bot 对比(测有无必胜解)
pnpm simulate --bot money -n 500 # 单独跑某种策略 bot(random/money/mindset)
pnpm simulate -v      # 详细模式:完整打印一局(可加 --seed 42 复现)
```
