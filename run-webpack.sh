#!/usr/bin/env bash
export PORT=4000
export Z_TITLE=Zero教程文档说明
export Z_LANGUAGE=cn
export Z_ENDPOINT=http://localhost:7000
export Z_APP=vie.app.htl
export Z_ROUTE=zui
export Z_SHARED=app
export Z_ENTRY_LOGIN=/login/index
export Z_ENTRY_ADMIN=/admin/index
export Z_K_SESSION=@@ZUI/
export Z_K_EVENT=@@ZUI-ACT
export REACT_APP_LESS_MODULES=true

export Z_DEV_DEBUG=true
export Z_DEV_MOCK=true
export Z_DEV_AJAX=false
export Z_DEV_FORM=true
export Z_DEV_MONITOR=false

export Z_CSS_COLOR="#3457e2"
export Z_CSS_PREFIX=zui

export SB_PORT=6006
export NODE_ENV=development
webpack --config config/webpack.config.dev.js --mode development