#!/usr/bin/env bash
export TARGET_FOLDER=$1
echo "[ Start ] 拷贝代码到：${TARGET_FOLDER}"
# 目录重名面
mv ${TARGET_FOLDER}/src/entity ${TARGET_FOLDER}/src/entity@em/
mv ${TARGET_FOLDER}/src/mock ${TARGET_FOLDER}/src/app@mock
mv ${TARGET_FOLDER}/src/plugin ${TARGET_FOLDER}/src/app@plugin
# 先删除目标内容
rm -rf ${TARGET_FOLDER}/src/economy/*
rm -rf ${TARGET_FOLDER}/src/entity@em/*
rm -rf ${TARGET_FOLDER}/src/extension/*
rm -rf ${TARGET_FOLDER}/src/style/*
rm -rf ${TARGET_FOLDER}/src/ui/*
rm -rf ${TARGET_FOLDER}/src/unfold/*
rm -rf ${TARGET_FOLDER}/src/upper/*
rm -rf ${TARGET_FOLDER}/src/utter/*
rm -rf ${TARGET_FOLDER}/src/ux/*
rm -rf ${TARGET_FOLDER}/src/zero/*
rm -rf ${TARGET_FOLDER}/src/zest@web/*
rm -rf ${TARGET_FOLDER}/src/zion/*
rm -rf ${TARGET_FOLDER}/src/zither@em/*
rm -rf ${TARGET_FOLDER}/src/zodiac/*
rm -rf ${TARGET_FOLDER}/src/zoe@em/*
rm -rf ${TARGET_FOLDER}/src/zone/*
# rm -rf ${TARGET_FOLDER}/src/editor/*
echo "[ Proc ] 目标代码删除完成！"
# 拷贝
mkdir -p ${TARGET_FOLDER}/src/economy/
mkdir -p ${TARGET_FOLDER}/src/entity@em/
mkdir -p ${TARGET_FOLDER}/src/extension/
mkdir -p ${TARGET_FOLDER}/src/skin/
mkdir -p ${TARGET_FOLDER}/src/style/
mkdir -p ${TARGET_FOLDER}/src/ui/
mkdir -p ${TARGET_FOLDER}/src/unfold/
mkdir -p ${TARGET_FOLDER}/src/upper/
mkdir -p ${TARGET_FOLDER}/src/utter/
mkdir -p ${TARGET_FOLDER}/src/ux/
mkdir -p ${TARGET_FOLDER}/src/zero/
mkdir -p ${TARGET_FOLDER}/src/zest@web/
mkdir -p ${TARGET_FOLDER}/src/zion/
mkdir -p ${TARGET_FOLDER}/src/zither@em/
mkdir -p ${TARGET_FOLDER}/src/zodiac/
mkdir -p ${TARGET_FOLDER}/src/zoe@em/
mkdir -p ${TARGET_FOLDER}/src/zone/
# mkdir -p ${TARGET_FOLDER}/src/editor/
cp -rf src/economy/* ${TARGET_FOLDER}/src/economy/
cp -rf src/entity@em/* ${TARGET_FOLDER}/src/entity@em/
cp -rf src/extension/* ${TARGET_FOLDER}/src/extension/
cp -rf src/skin/* ${TARGET_FOLDER}/src/skin/
cp -rf src/style/* ${TARGET_FOLDER}/src/style/
cp -rf src/ui/* ${TARGET_FOLDER}/src/ui/
cp -rf src/unfold/* ${TARGET_FOLDER}/src/unfold/
cp -rf src/upper/* ${TARGET_FOLDER}/src/upper/
cp -rf src/utter/* ${TARGET_FOLDER}/src/utter/
cp -rf src/ux/* ${TARGET_FOLDER}/src/ux/
cp -rf src/zero/* ${TARGET_FOLDER}/src/zero/
cp -rf src/zest@web/* ${TARGET_FOLDER}/src/zest@web/
cp -rf src/zion/* ${TARGET_FOLDER}/src/zion/
cp -rf src/zither@em/* ${TARGET_FOLDER}/src/zither@em/
cp -rf src/zodiac/* ${TARGET_FOLDER}/src/zodiac/
cp -rf src/zoe@em/* ${TARGET_FOLDER}/src/zoe@em/
cp -rf src/zone/* ${TARGET_FOLDER}/src/zone/
# cp -rf src/editor/* ${TARGET_FOLDER}/src/editor/
echo "[ Proc ] 代码拷贝完成！"

# 固定文件
cp -rf src/index.js ${TARGET_FOLDER}/src/index.js
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/src/cab/cn/shared.json
cp -rf src/environment/store.js ${TARGET_FOLDER}/src/environment/store.js
cp -rf src/environment/state.js ${TARGET_FOLDER}/src/environment/state.js
cp -rf src/environment/index.js ${TARGET_FOLDER}/src/environment/index.js
# cp -rf src/environment/zero.js ${TARGET_FOLDER}/src/environment/zero.js
# cp -rf src/environment/zero.fn.js ${TARGET_FOLDER}/src/environment/zero.fn.js
# 自动化脚本
cp -rf scripts/zrun-route.zt ${TARGET_FOLDER}/scripts/zrun-route.zt
cp -rf scripts/zrun-route.js ${TARGET_FOLDER}/scripts/zrun-route.js
cp -rf scripts/zrun-update.js ${TARGET_FOLDER}/scripts/zrun-update.js
cp -rf scripts/zrun-route-ready.js ${TARGET_FOLDER}/scripts/zrun-route-ready.js
cp -rf scripts/zrun-package.json ${TARGET_FOLDER}/scripts/zrun-package.json
cp -rf scripts/zrun-package.js ${TARGET_FOLDER}/scripts/zrun-package.js
# 环境文件
cp -rf tsconfig.json ${TARGET_FOLDER}/tsconfig.json
cp -rf .babelrc ${TARGET_FOLDER}/.babelrc
cp -rf .eslintignore ${TARGET_FOLDER}/.eslintignore
cp -rf .gitignore ${TARGET_FOLDER}/.gitignore
cp -rf run-update.sh ${TARGET_FOLDER}/run-update.sh
cp -rf run-ux.sh ${TARGET_FOLDER}/run-ux.sh
cp -rf run-zero-dependency.sh ${TARGET_FOLDER}/run-zero-dependency.sh
echo "[ Proc ] 框架核心文件！"

# Webpack 5.0
cp -rf scripts/start.js ${TARGET_FOLDER}/scripts/start.js
cp -rf scripts/build.js ${TARGET_FOLDER}/scripts/build.js
cp -rf scripts/test.js ${TARGET_FOLDER}/scripts/test.js
cp -rf config/env.js ${TARGET_FOLDER}/config/env.js
cp -rf config/getHttpsConfig.js ${TARGET_FOLDER}/config/getHttpsConfig.js
cp -rf config/modules.js ${TARGET_FOLDER}/config/modules.js
cp -rf config/paths.js ${TARGET_FOLDER}/config/paths.js
cp -rf config/webpack.config.js ${TARGET_FOLDER}/config/webpack.config.js
cp -rf config/webpack.config.style.js ${TARGET_FOLDER}/config/webpack.config.style.js
cp -rf config/webpackDevServer.config.js ${TARGET_FOLDER}/config/webpackDevServer.config.js
cp -rf config/jest ${TARGET_FOLDER}/config
cp -rf config/webpack ${TARGET_FOLDER}/config


# 资源文件
rm -rf ${TARGET_FOLDER}/src/cab/cn/economy/*
rm -rf ${TARGET_FOLDER}/src/cab/cn/extension/*
echo "[ Proc ] 目标资源删除完成！"

mkdir -p ${TARGET_FOLDER}/src/cab/cn/economy
mkdir -p ${TARGET_FOLDER}/src/cab/cn/extension
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/src/cab/cn/economy/
cp -rf src/cab/cn/extension/* ${TARGET_FOLDER}/src/cab/cn/extension/
echo "[ Proc ] 资源拷贝完成！"

# Development 技术平台专用开发
# 平台层和业务层分离，构造新的 DEV-MENU 专用开发菜单
rm -rf ${TARGET_FOLDER}/src/cab/cn/cerebration/*
mkdir -p ${TARGET_FOLDER}/src/cab/cn/cerebration
cp -rf src/cab/cn/cerebration/* ${TARGET_FOLDER}/src/cab/cn/cerebration/
echo "[ Proc ] 平台开发资源拷贝完成！"

node scripts/zrun-update.js . ${TARGET_FOLDER}

# Document 文档生成平台专用
mkdir -p ${TARGET_FOLDER}/document/doc-config/
cp -rf document/doc-config/* ${TARGET_FOLDER}/document/doc-config/
rm -rf ${TARGET_FOLDER}/document/doc-source/
mkdir -p ${TARGET_FOLDER}/document/doc-source
cp -rf document/doc-source/* ${TARGET_FOLDER}/document/doc-source/
echo "[ Proc ] 文档平台资源拷贝完成！"


echo "[ End ] ${TARGET_FOLDER}执行完成！"
