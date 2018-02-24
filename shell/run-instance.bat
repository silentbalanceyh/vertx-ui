set PORT=3001
set UI_LANGUAGE=cn
set UI_ENDPOINT=http://localhost:8083
set UI_APP=vie.app.htl
set URI_LOGIN=/login
set URI_MAIN=/main/index
set URI_CTX=htl
set KEY_SESSION=@@RTV/
set KEY_EVENT=@@VIE-UI
set DEV_DEBUG=true
# Baidu地图
set MAP_KEY=RVZSpq0MuZsxBIrUPdq4Za6McR21rQrn
echo "[EDO-UI] Environment has been initialized successfully !"
node scripts/start.js
