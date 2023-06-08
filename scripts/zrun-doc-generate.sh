#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export COLOR_GREEN="\033[32m[Zero UI]\033[0m" # 绿色

echo -e "${COLOR_GREEN} 正在生成 Api 文档!"
echo -e "${COLOR_GREEN} 确认您已使用 npm 安装了命令工具 \"\033[34mjsdoc\033[0m\" 和 \"\033[34mlive-server\033[0m\"。"
rm -rf document/doc-web/*
mkdir -p ${DOC_OUT}/doc-web/zui
mkdir -p ${DOC_OUT}/doc-web/zextension
jsdoc -c ${DOC_OUT}/doc-config/jsdoc.json
jsdoc -c ${DOC_OUT}/doc-config/jsdoc-extension.json

# serve -p ${DOC_PORT} -s ${DOC_OUT}/doc-web
# live-server ${DOC_OUT}/doc-web --port
# open ${DOC_OUT}/doc-web/index.html
echo -e "${COLOR_GREEN} 拷贝资源文件……"
cp -rf ${DOC_OUT}/doc-config/asciidoc/* ${DOC_OUT}/doc-web
echo -e "${COLOR_GREEN} 正在生成 Asciidoc 文档! ( 标准/规范 )"
asciidoctor -a safe-mode=SECURE -a icons=font -a iconfont-remote! -a stylesdir=css -R ${DOC_OUT}/doc-source -D ${DOC_OUT}/doc-web '**/*.adoc'
echo -e "${COLOR_GREEN} 规范文档已成功生成! "
echo -e "${COLOR_GREEN} Successfully! 全站生成完成"