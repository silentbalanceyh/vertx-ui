#!/usr/bin/env bash
# 基础环境变量
export PORT=3002                                    # 当前用户使用的端口号
export APP_LANGUAGE=cn                              # 当前应用使用的语言，如果有多语言则需要在不同语言中启动不同应用进行切换，不建议单库多语言部署
export APP_ENDPOINT=http://localhost:7000           # 当前应用需要访问的远程EndPoint
export APP_NAME=vie.app.htl                         # 该应用名称
export APP_ROUTE=zui                                # 该应用的动态路由根路径地址
export KEY_SESSION=@@ZUI/                           # Session Key前缀
export KEY_EVENT=@@ZUI-ACT                          # Redux 中的Event对应的Key前缀
export DEV_DEBUG=true                               # 是否开启Debug模式
export UX_SHARED=app
# 第三方环境变量
export TP_BAIDU=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn
# 最终输出信息
echo "[ZERO-UI] Environment has been initialized successfully !"
# 启动App
node scripts/start.js
