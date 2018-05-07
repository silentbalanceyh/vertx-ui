#!/usr/bin/env bash
export TARGET_FOLDER=/Users/lang/Develop/Work/Source/ima-app/src
# 北京一体化项目
cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
# Others
echo "${TARGET_FOLDER} Updated successfully!"
export TARGET_FOLDER=/Users/lang/Develop/Source/vie-ui/src
# cp -rf src/environment/* ${TARGET_FOLDER}/environment/
cp -rf src/economy/* ${TARGET_FOLDER}/economy/
cp -rf src/entity/* ${TARGET_FOLDER}/entity/
cp -rf src/ux/* ${TARGET_FOLDER}/ux/
echo "${TARGET_FOLDER} Updated successfully!"