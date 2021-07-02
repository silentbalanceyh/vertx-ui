#!/usr/bin/env bash
ncu -u
node ./scripts/zrun-package.js
# npm install --no-optional
rm -rf yarn.lock
yarn install
