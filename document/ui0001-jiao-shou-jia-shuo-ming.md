# UI0001 - 脚手架说明

本文对Zero UI脚手架进行拆解说明，让开发人员清楚该脚手架的内容以及相关细节，Zero UI脚手架采取了“组件化”方式对项目文件进行组织，使用了Ant-Design-Pro/Ant-Design中的组件，但并没使用分层结构，所有的`Reducer, Action`全部内置在当前组件自身的目录中。

## 1. 目录结构

> 只有标记为【开发】的目录会被开发人员自我管理，其他目录基本不用改变，标记为【Zero】部分为Zero提供的常用组件以及相关开发包，不提供给开发人员扩展。

| 主目录 | 子目录 | 特殊文件 | 说明 |
| :--- | :--- | :--- | :--- |
| config |  | variables.js | 环境变量连接文件，用于连接不同环境变量用于docker容器化和k8s集群专用。 |
| config |  | modules.js | 模块相对路径处理专用导入脚本，解决不同模块之间的import相对路径导入问题。 |
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
| typings |  |  | TypeScript专用 |
| **run-zero.sh/run-zero.bat** |  |  | 启动脚本 |

## 2. 包更新

目前的版本可使用ncu更新`package.json`的依赖包，在根目录运行该脚本：

```shell
> ncu
# 输出结果如下：
⸨░░░░░░░░░░░░░░░░░░⸩ ⠴ :
 rxjs                       ^5.5.10  →  ^6.0.0 
 webpack                     3.11.0  →   4.6.0 
 webpack-dev-server           3.0.0  →   3.1.3 
 awesome-typescript-loader   ^4.0.1  →  ^5.0.0 

Run ncu with -u to upgrade package.json
```

以上依赖包的版本为限制版本，不可更新到最新版，更新到最新版会出错，后期脚手架可以考虑升级版本，目前够用即可。

