#!/usr/bin/env bash
export JS_OUT=specification/api
export JS_PORT=6060
echo "[VIE-UI] Start to generate Api documents!"
rm -rf $JS_OUT/docs
yuidoc --config yuidoc.json
echo "[VIE-UI] Generated document successfully! You can open http://localhost:$JS_PORT to see results."
http-server -p $JS_PORT $JS_OUT 
