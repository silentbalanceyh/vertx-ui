set PORT=3001
set APP_LANGUAGE=cn
set APP_ENDPOINT=http://192.168.31.120:7000
set APP_NAME=vie.app.htl
set APP_ROUTE=htl
set KEY_SESSION=@@RTV/
set KEY_EVENT=@@VIE-UI
set DEV_DEBUG=true
set DEV_MOCK=true
set UX_SHARED=app

set TP_BAIDU=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn
echo "[ZERO-UI] Environment has been initialized successfully !"
node scripts/start.js
