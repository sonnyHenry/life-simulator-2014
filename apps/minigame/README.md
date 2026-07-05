# 微信小游戏

独立小游戏工程,复用 `@life-sim/core` 和 `@life-sim/content`。

```bash
pnpm --filter @life-sim/minigame typecheck
pnpm --filter @life-sim/minigame build
```

构建产物在 `apps/minigame/dist`。微信开发者工具导入 `apps/minigame`,项目配置会指向 `dist/`。
