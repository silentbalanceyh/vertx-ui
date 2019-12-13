#!/usr/bin/env bash

export TARGET_FOLDER=/Users/lang/Develop/Source/uniform-ui/vie-ui/src

echo "[ Start ] 拷贝代码到：${TARGET_FOLDER}"
# 先删除目标内容
rm -rf ${TARGET_FOLDER}/economy/*
rm -rf ${TARGET_FOLDER}/entity/*
rm -rf ${TARGET_FOLDER}/ux/*
rm -rf ${TARGET_FOLDER}/extension/*
echo "[ Proc ] 目标代码删除完成！"
# 拷贝
mkdir -p ${TARGET_FOLDER}/economy/
mkdir -p ${TARGET_FOLDER}/entity/
mkdir -p ${TARGET_FOLDER}/ux/
mkdir -p ${TARGET_FOLDER}/extension/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
cp -rf src/extension/* ${TARGET_FOLDER}/extension/
echo "[ Proc ] 代码拷贝完成！"

# 固定文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js
cp -rf src/environment/zero.fn.js ${TARGET_FOLDER}/environment/zero.fn.js
echo "[ Proc ] 框架核心文件！"

rm -rf ${TARGET_FOLDER}/cab/cn/economy/*
rm -rf ${TARGET_FOLDER}/cab/cn/extension/*
echo "[ Proc ] 目标资源删除完成！"
mkdir -p ${TARGET_FOLDER}/cab/cn/economy
mkdir -p ${TARGET_FOLDER}/cab/cn/extension
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/cab/cn/extension/* ${TARGET_FOLDER}/cab/cn/extension/
echo "[ Proc ] 资源拷贝完成！"

rm -rf ${TARGET_FOLDER}/style/economy/*
rm -rf ${TARGET_FOLDER}/style/infix/*
echo "[ Proc ] 风格文件删除完成！"
mkdir -p ${TARGET_FOLDER}/style/economy/
mkdir -p ${TARGET_FOLDER}/style/infix/
cp -rf src/style/economy/* ${TARGET_FOLDER}/style/economy/
cp -rf src/style/infix/* ${TARGET_FOLDER}/style/infix/
echo "[ Proc ] 风格文件拷贝完成！"
echo "[ End ] ${TARGET_FOLDER}执行完成！"

export TARGET_FOLDER=/Users/lang/Develop/Source/uniform-ui/ox-ui/src

echo "[ Start ] 拷贝代码到：${TARGET_FOLDER}"
# 先删除目标内容
rm -rf ${TARGET_FOLDER}/economy/*
rm -rf ${TARGET_FOLDER}/entity/*
rm -rf ${TARGET_FOLDER}/ux/*
rm -rf ${TARGET_FOLDER}/extension/*
echo "[ Proc ] 目标代码删除完成！"
# 拷贝
mkdir -p ${TARGET_FOLDER}/economy/
mkdir -p ${TARGET_FOLDER}/entity/
mkdir -p ${TARGET_FOLDER}/ux/
mkdir -p ${TARGET_FOLDER}/extension/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
cp -rf src/extension/* ${TARGET_FOLDER}/extension/
echo "[ Proc ] 代码拷贝完成！"

# 固定文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js
cp -rf src/environment/zero.fn.js ${TARGET_FOLDER}/environment/zero.fn.js
echo "[ Proc ] 框架核心文件！"

rm -rf ${TARGET_FOLDER}/cab/cn/economy/*
rm -rf ${TARGET_FOLDER}/cab/cn/extension/*
echo "[ Proc ] 目标资源删除完成！"
mkdir -p ${TARGET_FOLDER}/cab/cn/economy
mkdir -p ${TARGET_FOLDER}/cab/cn/extension
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/cab/cn/extension/* ${TARGET_FOLDER}/cab/cn/extension/
echo "[ Proc ] 资源拷贝完成！"

rm -rf ${TARGET_FOLDER}/style/economy/*
rm -rf ${TARGET_FOLDER}/style/infix/*
echo "[ Proc ] 风格文件删除完成！"
mkdir -p ${TARGET_FOLDER}/style/economy/
mkdir -p ${TARGET_FOLDER}/style/infix/
cp -rf src/style/economy/* ${TARGET_FOLDER}/style/economy/
cp -rf src/style/infix/* ${TARGET_FOLDER}/style/infix/
echo "[ Proc ] 风格文件拷贝完成！"
echo "[ End ] ${TARGET_FOLDER}执行完成！"
