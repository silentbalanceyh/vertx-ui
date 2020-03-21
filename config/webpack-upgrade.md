# 升级流程

## 1.变更 `scripts/start.js`中的内容

将 52 行改成

```js
// 旧代码 const compiler = createCompiler(webpack, config, appName, urls, useYarn);
const compiler = createCompiler({webpack, config, appName, urls, useYarn});
```

## 2.切换 HtmlWebpack

重新安装：

```shell
npm i html-webpack-plugin@next --save-dev
```

修改配置文件：`config/webpack.config.<env>.js`，363 行左右

```js
// 旧代码： new InterpolateHtmlPlugin(env.raw),
new InterpolateHtmlPlugin(HtmlWebpackPlugin, env.raw),
```

## 然后就可以直接运行了

目前有一个卡死的问题，会卡在：

```shell
ℹ ｢atl｣: Using typescript@3.8.3 from typescript
ℹ ｢atl｣: Using tsconfig.json from /Users/lang/Develop/Source/uniform-ui/vertx-ui/tsconfig.json (in a forked process)
```