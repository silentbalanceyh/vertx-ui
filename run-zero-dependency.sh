#!/usr/bin/env bash
# Development
# Warning Message
# @testing-library/user-event@13.5.0" has unmet peer dependency "@testing-library/dom@>=7.21.4"
# "eslint-config-react-app > eslint-plugin-flowtype@8.0.3" has unmet peer dependency "@babel/plugin-syntax-flow@^7.14.5"
# "eslint-config-react-app > eslint-plugin-flowtype@8.0.3" has unmet peer dependency "@babel/plugin-transform-react-jsx@^7.14.9"
# > tailwindcss@3.0.7" has unmet peer dependency "autoprefixer@^10.0.2"
# > less-loader@7.3.0" has unmet peer dependency "less@^3.5.0 || ^4.0.0"
yarn add \
  prop-types \
  @testing-library/dom \
  @babel/plugin-syntax-flow \
  @babel/plugin-transform-react-jsx \
  autoprefixer \
  --dev
# TypeScript
yarn add typescript \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  --dev
# Less
yarn add less-loader@7.3.0 less@3.13.0 --dev
# babel-plugin-import
yarn add babel-plugin-import \
  babel-plugin-named-asset-import \
  @babel/runtime \
  @babel/runtime-corejs2 \
  @babel/plugin-proposal-function-bind \
  @babel/plugin-proposal-export-default-from \
  @babel/plugin-proposal-pipeline-operator \
  @babel/plugin-proposal-do-expressions \
  @babel/plugin-proposal-function-sent \
  @babel/plugin-proposal-throw-expressions \
  --dev
# Eslint
yarn add eslint \
  eslint-loader \
  eslint-plugin-jsx-a11y --dev
# Ant Design
yarn add customize-cra --dev
# Fix issue:
# BREAKING CHANGE: webpack < 5 used to include polyfills for node.js core modules by default.
  #This is no longer the case. Verify if you need this module and configure a polyfill for it.
  #
  #If you want to include a polyfill, you need to:
  #	- add a fallback 'resolve.fallback: { "crypto": require.resolve("crypto-browserify") }'
  #	- install 'crypto-browserify'
  #If you don't want to include a polyfill, you can use an empty module like this:
  #	resolve.fallback: { "crypto": false }
yarn add crypto-browserify --dev
yarn add buffer --dev
yarn add stream-browserify --dev
yarn add util --dev
yarn add inversify --dev
# ------------------------------------------------------------------------
# Runtime
yarn add immutable underscore
# AntD/AntV
yarn add antd ant-design-pro \
  @antv/g2 @antv/g2plot \
  @antv/g6 @antv/graphin @antv/x6 @antv/x6 @antv/x6-react-components
# rxjs
yarn add rxjs@6.6.7
# random/crypto-js
yarn add random-js crypto-js
# redux/redux-observable
yarn add redux react-redux redux-act redux-observable@1.2.0 redux-logger react-router-redux
# react-router/react-highlight-words
yarn add react-router-dom@5.3.0 react-highlight-words
# context menu
yarn add react-contextmenu
# file-saver/file-size
yarn add file-saver file-size
# js-pinyin/deep-object-diff
yarn add js-pinyin deep-object-diff
# react dnd
yarn add react-dnd-html5-backend react-dnd react-render-html
# json view / braft-editor / marked
yarn add react-json-view braft-editor marked highlight.js react-json-editor-ajrm
# bpmn-js
yarn add bpmn-js
# React: 16.14.0
yarn add react@16.14.0 react-dom@16.14.0
# core-js new version
yarn add core-js q
# @babel/eslint-parser instead
yarn add @babel/eslint-parser --dev