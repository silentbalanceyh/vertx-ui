#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export COLOR_GREEN="\033[32m[Zero UI]\033[0m" # 绿色

echo -e "${COLOR_GREEN} Start to generate Api documents!"
echo -e "${COLOR_GREEN} Be sure you have installed \"\033[34mjsdoc\033[0m\" and \"\033[34mlive-server\033[0m\" with npm install command"
rm -rf ${DOC_OUT}/doc-web
rm -rf ${DOC_OUT}/doc-web-extension
jsdoc -c ${DOC_OUT}/doc-config/jsdoc.json
jsdoc -c ${DOC_OUT}/doc-config/jsdoc-extension.json

echo -e "${COLOR_GREEN} Generated document successfully! "
echo -e "${COLOR_GREEN} You can execute \" \033[36m live-server ${DOC_OUT}/doc-web --port=${PORT}\033[0m \" for Zero Ui"
echo -e "${COLOR_GREEN} You can execute \" \033[36m live-server ${DOC_OUT}/doc-web-extension --port=${PORT_EXTENSION}\033[0m \" for Zero Extension"
echo -e "${COLOR_GREEN} Core Environment Variables are below:  "
echo -e "    \033[33mDOC_OUT\033[0m = \033[31m${DOC_OUT}\033[0m"
echo -e "    \033[33mPORT\033[0m = \033[31m${PORT}\033[0m"
echo -e "    \033[33mPORT_EXTENSION\033[0m = \033[31m${PORT_EXTENSION}\033[0m"
echo -e "${COLOR_GREEN} Then you can open http://localhost:$PORT to see \"\033[33mZero Ui\033[0m\" Doc"
echo -e "${COLOR_GREEN} Then you can open http://localhost:$PORT_EXTENSION to see \"\033[33mZero Extension\033[0m\" Doc"
# serve -p ${DOC_PORT} -s ${DOC_OUT}/doc-web
# live-server ${DOC_OUT}/doc-web --port
# open ${DOC_OUT}/doc-web/index.html
