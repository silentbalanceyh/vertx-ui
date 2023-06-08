#!/usr/bin/env bash
# 第三方环境变量
# export TP_BAIDU=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn
# 最终输出信息
echo "[Zero UI] Environment has been initialized successfully !"
# 启动App
node --max-semi-space-size=128 --max_old_space_size=4096 --unhandled-rejections=none scripts/start.js
