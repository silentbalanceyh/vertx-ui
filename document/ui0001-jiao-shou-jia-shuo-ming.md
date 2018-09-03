# UI0001 - 脚手架说明

本文对Zero UI脚手架进行拆解说明，让开发人员清楚该脚手架的内容以及相关细节，Zero UI脚手架采取了“组件化”方式对项目文件进行组织，使用了Ant-Design-Pro/Ant-Design中的组件，但并没使用分层结构，所有的`Reducer, Action`全部内置在当前组件自身的目录中。

## 1. 目录结构

> 只有标记为【开发】的目录会被开发人员自我管理，其他目录基本不用改变，标记为【Zero】部分为Zero UI提供的常用组件以及相关开发包，不提供给开发人员扩展。

| 主目录 | 子目录 | 特殊文件 | 说明 |
| :--- | :--- | :--- | :--- |
| .storybook |  |  | Storybook专用配置目录，包括webpack配置。 |
| build |  |  | 生产环境build的输出目录，可配置在服务器中运行。 |
| config |  | variables.js | 环境变量连接文件，用于连接不同环境变量用于docker容器化和k8s集群专用。 |
| config |  | modules.js | 模块相对路径处理专用导入脚本，解决不同模块之间的import相对路径导入问题。 |
| config |  | webpack.config.dev.js | 开发环境webpack配置 |
| config |  | webpack.config.prod.js | 生产环境webpack配置 |
| docs |  |  | API文档目录 |
| document |  |  | Gitbook文档目录 |
| public |  |  | 静态资源文件包 |
| scripts |  |  | 原生启动脚本 |
| shell |  |  | Zero专用启动脚本：环境变量初始化，代码链接，脚本执行，路由生成，容器配置检查，启动 |
| specification |  |  | 组件API文档 |
| src | app |  | 【开发】App专用目录 |
|  | cab |  | 【开发】多国语言包 |
|  | components |  | 【开发】Page页面组件 |
|  | container |  | 【开发】Layout模板组件 |
|  | econnomy |  | 【Zero】可重用组件 |
|  | entity |  | 【Zero】TypeScript数据对象 |
|  | environment |  | 核心环境文件 |
|  | style |  | css相关风格文件 |
|  | ux |  | 【Zero】Utility X包，纯函数主入口 |
| stories |  |  | Storybook专用包 |
| .babelrc |  |  | Babel配置文件 |
| .eslintrc.js |  |  | Eslint配置文件 |
| .gitignore |  |  | Git Ignore专用文件 |
| \_config.yml |  |  | GitPages配置文件 |
| CNAME |  |  | GitHub域名映射文件 |
| jsconfig.json |  |  | IDE警告移除文件 |
| package.json |  |  | NPM包配置 |
| package-lock.json |  |  | （略） |
| README.md |  |  | （略） |
| run-doc.bat、run-doc.sh |  |  | YUIDOC文档启动工具 |
| run-zero.bat、run-zero.sh |  |  | Zero UI启动脚本 |
| SUMMARY.md |  |  | （略） |
| tsconfig.json |  |  | TypeScript配置文件 |
| yarn.lock |  |  | （略） |
| yuidoc.json |  |  | YUIDOC配置文件 |

虽然上边文件和目录结构复杂，但实际上开发人员仅需要关注标记了【开发】的目录即可。

## 2. 包更新

目前的版本可使用ncu更新`package.json`的依赖包，在根目录运行该脚本：

```shell
> ncu
# 输出结果如下：
⸨░░░░░░░░░░░░░░░░░░⸩ ⠸ :
 redux-observable           ^0.19.0  →  ^1.0.0 
 rxjs                       ^5.5.11  →  ^6.3.1 
 awesome-typescript-loader   ^4.0.1  →  ^5.2.0 
 babel-eslint                ^8.2.6  →  ^9.0.0 
 babel-loader                 7.1.5  →   8.0.2 
 webpack                     3.12.0  →  4.17.2 
 webpack-dev-server           3.0.0  →   3.1.7 

Run ncu with -u to upgrade package.json
```

以上依赖包的版本为限制版本，不可更新到最新版，更新到最新版会出错，后期脚手架可以考虑升级这几个依赖库的版本，目前够用即可。

