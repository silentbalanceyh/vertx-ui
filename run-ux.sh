#!/usr/bin/env bash

export TARGET_FOLDER=/Users/lang/Develop/Source/uniform-ui/vie-ui/src
# 先删除
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
cp -rf src/extension/* ${TARGET_FOLDER}/extension/
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
# 资源文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js
cp -rf src/environment/zero.fn.js ${TARGET_FOLDER}/environment/zero.fn.js
cp -rf src/cab/cn/extension/* ${TARGET_FOLDER}/cab/cn/extension/


export TARGET_FOLDER=/Users/lang/Develop/Source/uniform-ui/ox-ui/src
# cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
# Zero扩展模块
cp -rf src/extension/* ${TARGET_FOLDER}/extension/
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
# 资源文件
cp -rf src/cab/cn/shared.json ${TARGET_FOLDER}/cab/cn/shared.json
cp -rf src/cab/cn/economy/* ${TARGET_FOLDER}/cab/cn/economy/
cp -rf src/environment/zero.js ${TARGET_FOLDER}/environment/zero.js
cp -rf src/environment/zero.fn.js ${TARGET_FOLDER}/environment/zero.fn.js
# Zero扩展模块
cp -rf src/cab/cn/extension/* ${TARGET_FOLDER}/cab/cn/extension/

