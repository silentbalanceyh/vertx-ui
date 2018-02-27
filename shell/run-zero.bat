set PORT=3001
set UI_LANGUAGE=cn
set UI_ENDPOINT=http://192.168.31.120:7000
set UI_APP=vie.app.htl
set URI_LOGIN=/login
set URI_MAIN=/main/index
set URI_CTX=htl
set KEY_SESSION=@@RTV/
set KEY_EVENT=@@VIE-UI
set DEV_DEBUG=true
set MAP_KEY=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn
set UX_SHARED=app
echo "[ZERO-UI] Environment has been initialized successfully !"
node scripts/start.js
