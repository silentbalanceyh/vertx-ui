#!/usr/bin/env bash

# export FOLDER="/Users/lang/Develop/Source/vie-ui"
# 拷贝
# cp -r src/entity/* ${FOLDER}/src/entity
# cp -r src/economy/* ${FOLDER}/src/economy
# cp -r src/ux/* ${FOLDER}/src/ux
# echo "[ ${FOLDER} ] 拷贝完成！"
# export FOLDER="/Users/lang/Develop/Work/Source/ima-app"
# 拷贝
# cp -r src/entity/* ${FOLDER}/src/entity
# cp -r src/economy/* ${FOLDER}/src/economy
# cp -r src/ux/* ${FOLDER}/src/ux
# echo "[ ${FOLDER} ] 拷贝完成！"
export TARGET_FOLDER=/Users/lang/Develop/Work/Source/ima-app/src
# 北京一体化项目
cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
# Others
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
export TARGET_FOLDER=/Users/lang/Develop/Source/vie-ui/src
# cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
echo "[ ${TARGET_FOLDER} ] 拷贝完成！"
