#!/usr/bin/env bash
rm -rf node_modules/.cache/.eslintcache
rm -rf node_modules/.cache/babel-loader/*
ncu -u
node ./scripts/zrun-package.js
# npm install --no-optional
rm -rf yarn.lock
rm -rf yarn-error.log
yarn cache clean
yarn install
