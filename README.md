# 2014:我的十二年

从 2014 年高考开始的人生模拟器。设计文档见 [GAME_DESIGN.md](./GAME_DESIGN.md),技术架构见 [TECH_ARCHITECTURE.md](./TECH_ARCHITECTURE.md)。

## 结构

- `packages/core` — 游戏引擎(纯 TS,零平台依赖)
- `packages/content` — 游戏内容(纯数据)
- `packages/tools` — 校验与模拟 CLI
- `packages/web` — Web 前端(M1)

## 常用命令

```bash
pnpm install          # 安装依赖
pnpm test             # 引擎单元测试
pnpm typecheck        # 全仓类型检查
pnpm simulate -n 500  # 机器人自动打 500 局,输出结局分布
pnpm simulate -v      # 详细模式:完整打印一局(可加 --seed 42 复现)
```
