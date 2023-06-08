#!/usr/bin/env bash
ncu -u
node ./scripts/zrun-package.js
# npm install --no-optional
rm -rf yarn.lock
rm -rf yarn-error.log
yarn cache clean
yarn install
