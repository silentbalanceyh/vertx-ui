#!/usr/bin/env bash
# -- Edo UI
# 当前用户使用的端口号
export PORT=3001
# 该应用使用的语言
export UI_LANGUAGE=cn
# 该应用、访问的远程Endpoint
export UI_ENDPOINT=http://localhost:7000
# 该应用名称
export UI_APP=vie.app.htl

# URI地址 -> Login登陆入口
export URI_LOGIN=/login
# MAIN地址 -> Main主页地址
export URI_MAIN=/main/index
# Context地址
export URI_CTX=htl

# 该应用的Session Key对应前缀
export KEY_SESSION=@@RTV/
# 该应用对应Redux Event前缀
export KEY_EVENT=@@VIE-UI

# Debug模式
export DEV_DEBUG=true
# Baidu地图
export MAP_KEY=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn

echo "[ZERO-UI] Environment has been initialized successfully !"
# 启动App
node scripts/start.js
