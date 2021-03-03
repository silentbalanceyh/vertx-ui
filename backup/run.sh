#!/usr/bin/env bash
export PORT=4000
export Z_LANGUAGE=cn
export Z_ENDPOINT=http://localhost:7000
export Z_APP=vie.app.htl
export Z_ROUTE=zui
export Z_SHARED=app
export Z_ENTRY_LOGIN=/login/index
export Z_ENTRY_ADMIN=/admin/index
export Z_K_SESSION=@@ZUI/
export Z_K_EVENT=@@ZUI-ACT
export Z_DEV_DEBUG=true
export Z_DEV_MOCK=true
export Z_CSS_PREFIX=zui
serve -s build
