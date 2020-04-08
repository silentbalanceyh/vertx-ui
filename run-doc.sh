#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export DOC_OUT=document
export PORT=1017
export PORT_EXTENSION=1231

echo -e "\033[32m[Zero UI]\033[0m Input command is \"\033[33m$1\033[0m\"!"
echo -e "Command List: "
echo -e "    \033[33mdoc\033[0m = \"\033[34mGenerate document of Zero Ui & Zero Extension\033[0m\""
echo -e "    \033[33mzero\033[0m = \"\033[34mRun Zero Ui on server ${PORT}\033[0m\""
echo -e "    \033[33mextension\033[0m = \"\033[34mRun Zero Extension on server ${PORT_EXTENSION}\033[0m\""
if [ "doc" == "$1" ]; then
  ./shell/run-doc-generate.sh
elif [ "extension" == "$1" ]; then
  ./shell/run-doc-server.sh ${PORT_EXTENSION} doc-web-extension
elif [ "zero" == "$1" ]; then
  ./shell/run-doc-server.sh ${PORT} doc-web
else
  echo "Invalid input command of $1"
fi
