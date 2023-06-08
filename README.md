# Zero UI帮助文档

> _如果说组件是没有生命的驱壳，数据则是灵魂，而我们想要创造的是拥有灵魂的“精灵”。_
>
> _天行有常，不为尧存，不为桀亡。——《荀子·天论》_

## 1. 介绍

### 1.1. 基本介绍

Zero UI为[Vert.x Zero Up Framework](http://www.vertxup.cn)的前端脚手架，主要用于和Vert.x Zero Up微服务框架后端进行配合开发，该前端脚手架主要内容如下：

* 使用React, Redux, Rxjs, React-Router和Ant-Design/Ant-Design-Pro为核心库基础
* 使用TypeScript开发视图层以下的模型，React采用ES2017+的注解语法实现无配置的界面开发
* 提供企业系统中常用组件，以及Utility X的包完成通用功能的提取，简化开发人员流程
* 采用Storybook模式通过教程方式告诉开发人员如何使用Zero UI中提供的组件。
* 使用JSDoc生成`Ux`和`Ex`的专用API文档。

该项目中使用了两个项目作为参考Demo，一个项目为通用企业项目，另外一个项目则是Zero Up Framework的后端监控框架，统一采用Zero UI来完成，官方网址：

* Vert.x Zero Up Framework: [http://www.vertxup.cn](http://www.vertxup.cn)
* Zero UI Framework: [http://www.vertxui.cn](http://www.vertxui.cn)
* Zero AI Tool：[http://www.vertxai.cn](http://www.vertxai.cn)

文档参考：<http://www.origin-x.cn> 地址的 Zero UI文档，目前版本支持的模块：

![](/document/module.png)

### 1.2. 在线文档

* [文档首页](/document/doc-web/index.html)（该链接为应用首页，每个应用都可以打开，内置链接可直接进入到 `Ux` 和 `Ex` 部分）
* [Ux文档](/document/doc-web/zui/index.html)，ZeroUI核心框架
    
    ```js
    import Ux from 'ux';
    Ux.xxx          // 直接调用Ux中的方法
    ```
  
* [Ex文档](/document/doc-web/zextension/index.html)，ZeroUI扩展框架

    ```js
    import Ex from 'ex';
    Ex.xxx          // 直接调用Ex中的方法
    ```

## 2. 开始

初始化工程专用命令：`ai init -name <name>`（其中name为项目名称），参考文档：<http://www.vertxai.cn/document/doc-web/module-ai.html#.init>

### 2.1. 启动前端

1. 执行下边的命令下载代码：

    ```shell
    git clone https://github.com/silentbalanceyh/vertx-ui.git
    ```

2. 下载了该项目过后，直接进入该项目，安装依赖包

    ```shell
    cd vertx-ui
    yarn install
    ```

3. 安装完成过后执行脚本：`run-zero.sh / run-zero.bat` 启动前端框架。

### 2.2. 文档本地化

1. 确认系统中安装了`node, jsdoc, docdash, live-server, taffydb`模块，其中 `taffydb` 有可能需要本地化安装，追加到您的开发依赖项中。
2. 执行下边命令生成文档：

    ```shell
    ./run-doc.sh doc                      # 带 doc 参数
    ```
3. 执行命令启动文档服务器，默认端口：`30211`：

    ```shell
    ./run-doc.sh server                   # 启动文档服务器
    ```
4. 根据执行引导查看文档。


