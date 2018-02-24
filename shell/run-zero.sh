#!/usr/bin/env bash
export PORT=3001                             # 当前用户使用的端口号
export APP_LANGUAGE=cn                       # 当前应用使用的语言，如果有多语言则需要在不同语言中启动不同应用进行切换，不建议单库多语言部署
export APP_ENDPOINT=http://localhost:7000    # 当前应用需要访问的远程EndPoint
export APP_NAME=vie.app.htl                  # 该应用名称
export APP_ROUTE=zui                         # 该应用的动态路由根路径地址
export KEY_SESSION=@@RTV/                    # Session Key前缀
# 该应用对应Redux Event前缀
export KEY_EVENT=@@VIE-UI

# Debug模式
export DEV_DEBUG=true
# Baidu地图
export MAP_KEY=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn

echo "[ZERO-UI] Environment has been initialized successfully !"
# 启动App
node scripts/start.js
