#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export JS_OUT=docs/api
export JS_PORT=5000
echo "[Zero UI] Start to generate Api documents!"
# 删除原始目录
rm -rf ${JS_OUT}/docs
yuidoc --config yuidoc.json
echo "[Zero UI] Generated document successfully! You can open http://localhost:$JS_PORT to see results."
serve -p ${JS_PORT} -s ${JS_OUT}
