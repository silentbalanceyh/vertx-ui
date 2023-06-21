#!/usr/bin/env bash
echo "配置还原……"
rm -rf config
rm -rf document
rm -rf scripts
echo "资源文件还原……"
rm -rf src/cab/*/cerebration
rm -rf src/cab/*/extension
rm -rf src/cab/*/economy
rm -rf src/cab/*/shared.json

echo "原始层文件还原……"
rm -rf src/economy
rm -rf src/entity@em
rm -rf src/extension
rm -rf src/environment

echo "风格还原 / 皮肤……"
rm -rf src/skin/index.d.ts
rm -rf src/skin/index.entry.js
rm -rf src/skin/index.js
rm -rf src/skin/plot.fn.mix.attr.js
rm -rf src/skin/plot.fn.of.document.js
rm -rf src/skin/wait._.v.locale.definition.js
rm -rf src/skin/wait.fn.skin.initialize.js
rm -rf src/skin/aroma-library/index.js
rm -rf src/skin/aroma-library/__.theme.shared

echo "风格还原 / SCSS……"
rm -rf src/style/function
rm -rf src/style/@old
rm -rf src/style/connect
rm -rf src/style/macrocosm/index.scss
rm -rf src/style/macrocosm/mod.screen.scss
rm -rf src/style/microcosm
rm -rf src/style/module
rm -rf src/style/uca
rm -rf src/style/unstable
rm -rf src/style/ux@legacy

rm -rf src/index.js
echo "库还原 / Ui……"
rm -rf src/ui
echo "库还原 / Ex……"
rm -rf src/unfold/
rm -rf src/upper/
rm -rf src/utter/
echo "库还原 / Ux……"
rm -rf src/ux/
rm -rf src/zero/
rm -rf src/zest@web/
rm -rf src/zion/
rm -rf src/zither@em/
rm -rf src/zodiac/
rm -rf src/zoe@em/
rm -rf src/zone/