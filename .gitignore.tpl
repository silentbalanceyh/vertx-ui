# -------------------------------- 非Zero部分
# 依赖部分直接移除
/node_modules
# PNP部分不提交
/.pnp
.pnp.js

# 测试覆盖率
/coverage
# 生产环境构建
/build
dist
# 备份专用目录
backup
# 本地开发环境配置
.DS_Store
.env.local
.env.development.local
.env.test.local
.env.production.local
# 日志部分
npm-debug.log*
yarn-debug.log*
yarn-error.log*
# IDEA配置
.idea
# yarn.lock / package-lock.json
yarn.lock
package-lock.json
# Aw Cache专用
.awcache
.awcache/*
# 归档文件
.Archive/
# MarkEditor 配置相关
.markeditor
.configs/
# Zero Ai 工具箱移除
.zero/
# -------------------------------- Zero UI
# 此文件可直接从 .env.development.tpl 转换，所以此处不带
.env.development
# ---------- Zero分发脚本
run-ux-current.sh
run-ux-all.sh
# ---------- Zero生成代码
src/environment/routes.js
src/environment/datum.js
src/components/index.js
src/container/index.js
src/extension/components/index.js
src/extension/cerebration/index.js
# ---------- 框架同步代码，新版直接使用 run-init.sh 可直接同步
# ---- Webpack配置 / 自动化脚本部分 / 文档部分
document/
config/
scripts/
# ---------- （全）框架底层
# ----- 资源文件
src/cab/*/cerebration
src/cab/*/extension
src/cab/*/economy
src/cab/*/shared.json
# ----- 原始层
src/economy/
src/entity@em/
src/extension/
src/environment/
# ----- 风格
src/skin/index.d.ts
src/skin/index.entry.js
src/skin/index.js
src/skin/plot.fn.mix.attr.js
src/skin/plot.fn.of.document.js
src/skin/wait._.v.locale.definition.js
src/skin/wait.fn.skin.initialize.js
src/skin/aroma-library/index.js
src/skin/aroma-library/__.theme.shared

src/style/@old
src/style/connect
src/style/macrocosm/index.scss
src/style/macrocosm/mod.screen.scss
src/style/microcosm
src/style/uca
src/style/unstable
src/style/ux@legacy
# ----- Ui
src/ui
# ----- Ex
src/unfold/
src/upper/
src/utter/
# ----- Ux
src/ux/
src/zero/
src/zest@web/
src/zion/
src/zither@em/
src/zodiac/
src/zoe@em/
src/zone/
# ----- 入口
src/index.js