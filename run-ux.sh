#!/usr/bin/env bash
export TARGET_FOLDER=$1
echo "[ Start ] 拷贝代码到：${TARGET_FOLDER}"
# 先删除目标内容
rm -rf ${TARGET_FOLDER}/src/economy/*
rm -rf ${TARGET_FOLDER}/src/entity/*
rm -rf ${TARGET_FOLDER}/src/ux/*
rm -rf ${TARGET_FOLDER}/src/extension/*
# rm -rf ${TARGET_FOLDER}/src/editor/*
echo "[ Proc ] 目标代码删除完成！"
# 拷贝
mkdir -p ${TARGET_FOLDER}/src/economy/
mkdir -p ${TARGET_FOLDER}/src/entity/
mkdir -p ${TARGET_FOLDER}/src/ux/
mkdir -p ${TARGET_FOLDER}/src/extension/
# mkdir -p ${TARGET_FOLDER}/src/editor/
cp -rf src/economy/* ${TARGET_FOLDER}/src/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/src/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/src/ux/
cp -rf src/extension/* ${TARGET_FOLDER}/src/extension/
# cp -rf src/editor/* ${TARGET_FOLDER}/src/editor/
echo "[ Proc ] 代码拷贝完成！"

# 固定文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/src/cab/cn/shared.json
cp -rf src/environment/zero.js ${TARGET_FOLDER}/src/environment/zero.js
cp -rf src/environment/zero.fn.js ${TARGET_FOLDER}/src/environment/zero.fn.js
# 脚本
cp -rf scripts/zrun-route.zt ${TARGET_FOLDER}/scripts/zrun-route.zt
cp -rf scripts/zrun-route.js ${TARGET_FOLDER}/scripts/zrun-route.js
cp -rf scripts/zrun-route-ready.js ${TARGET_FOLDER}/scripts/zrun-route-ready.js
cp -rf scripts/zrun-package.json ${TARGET_FOLDER}/scripts/zrun-package.json
# 其他
cp -rf tsconfig.json ${TARGET_FOLDER}/tsconfig.json
cp -rf src/style/common.less ${TARGET_FOLDER}/src/style/common.less
cp -rf src/style/zero.less ${TARGET_FOLDER}/src/style/zero.less
cp -rf run-update.sh ${TARGET_FOLDER}/run-update.sh
cp -rf run-ux.sh ${TARGET_FOLDER}/run-ux.sh
echo "[ Proc ] 框架核心文件！"

# Webpack 4.0
cp -rf scripts/start.js ${TARGET_FOLDER}/scripts/start.js
cp -rf scripts/build.js ${TARGET_FOLDER}/scripts/build.js
cp -rf scripts/test.js ${TARGET_FOLDER}/scripts/test.js
cp -rf config/env.js ${TARGET_FOLDER}/config/env.js
cp -rf config/getHttpsConfig.js ${TARGET_FOLDER}/config/getHttpsConfig.js
cp -rf config/modules.js ${TARGET_FOLDER}/config/modules.js
cp -rf config/paths.js ${TARGET_FOLDER}/config/paths.js
cp -rf config/pnpTs.js ${TARGET_FOLDER}/config/pnpTs.js
cp -rf config/webpack.config.js ${TARGET_FOLDER}/config/webpack.config.js
cp -rf config/webpackDevServer.config.js ${TARGET_FOLDER}/config/webpackDevServer.config.js

rm -rf ${TARGET_FOLDER}/src/cab/cn/economy/*
rm -rf ${TARGET_FOLDER}/src/cab/cn/extension/*
echo "[ Proc ] 目标资源删除完成！"

mkdir -p ${TARGET_FOLDER}/src/cab/cn/economy
mkdir -p ${TARGET_FOLDER}/src/cab/cn/extension
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/src/cab/cn/economy/
cp -rf src/cab/cn/extension/* ${TARGET_FOLDER}/src/cab/cn/extension/
echo "[ Proc ] 资源拷贝完成！"

rm -rf ${TARGET_FOLDER}/src/style/economy/*
rm -rf ${TARGET_FOLDER}/src/style/infix/*
echo "[ Proc ] 风格文件删除完成！"
mkdir -p ${TARGET_FOLDER}/src/style/economy/
mkdir -p ${TARGET_FOLDER}/src/style/infix/
cp -rf src/style/economy/* ${TARGET_FOLDER}/src/style/economy/
cp -rf src/style/infix/* ${TARGET_FOLDER}/src/style/infix/
echo "[ Proc ] 风格文件拷贝完成！"
echo "[ End ] ${TARGET_FOLDER}执行完成！"
