#!/usr/bin/env bash
export FOLDER="/Users/lang/Develop/Source/vie-ui"
# 拷贝
cp -r src/entity/* ${FOLDER}/src/entity
cp -r src/economy/* ${FOLDER}/src/economy
cp -r src/ux/* ${FOLDER}/src/ux
echo "[ ${FOLDER} ] 拷贝完成！"
export FOLDER="/Users/lang/Develop/Work/Source/ima-app"
# 拷贝
cp -r src/entity/* ${FOLDER}/src/entity
cp -r src/economy/* ${FOLDER}/src/economy
cp -r src/ux/* ${FOLDER}/src/ux
echo "[ ${FOLDER} ] 拷贝完成！"