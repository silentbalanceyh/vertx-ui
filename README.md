# Zero UI帮助文档

> _如果说组件是没有生命的驱壳，数据则是灵魂，而我们想要创造的是拥有灵魂的“精灵”。_
>
> _天行有常，不为尧存，不为桀亡。——《荀子·天论》_

## 1. 介绍

Zero UI为[Vert.x Zero Up Framework](http://www.vertxup.cn)的前端脚手架，主要用于和Vert.x Zero Up微服务框架后端进行配合开发，该前端脚手架主要内容如下：

* 使用React, Redux, Rxjs, React-Router和Ant-Design/Ant-Design-Pro为核心库基础
* 使用TypeScript开发视图层以下的模型，React采用ES2017+的注解语法实现无配置的界面开发
* 提供企业系统中常用组件，以及Utility X的包完成通用功能的提取，简化开发人员流程
* 采用Storybook模式通过教程方式告诉开发人员如何使用Zero UI中提供的组件。

该项目中使用了两个项目作为参考Demo，一个项目为通用企业项目，另外一个项目则是Zero Up Framework的后端监控框架，统一采用Zero UI来完成，官方网址：

* Vert.x Zero Up Framework: [http://www.vertxup.cn](http://www.vertxup.cn)
* Zero UI Framework: [http://www.vertxui.cn](http://www.vertxui.cn)
* Zero AI Tool：[http://www.vertxai.cn](http://www.vertxai.cn)

文档基本前缀说明。

* `UI`文档为开发文档，提供给开发人员使用来开发项目专用；
* `UT`文档为研发文档，提供给研发人员开发Zero UI专用；
* `UC`文档位自定义组件专用文档，用于描述目前系统中存在的自定义组件；
* `AI`文档为自动化组件专用文档，用于一些目前自定义的解析规则相关；

## 2. 开始

由于Zero UI已经使用了“所见即所得”的模式来介绍，所以读者可以直接下载代码，在本地运行（确保您的系统中安装了node）：

执行下边的命令下载代码：

```
git clone https://github.com/silentbalanceyh/vertx-ui.git
```

下载了该项目过后，直接进入该项目，安装依赖包

```
cd vertx-ui
npm install
```

安装完成过后执行脚本：`run-zero.sh / run-zero.bat`

```
run-zero.bat
```

然后在浏览器中打开地址：[http://localhost:4000/zui/login/index](http://localhost:4000/zui/login/index)，则可以看到下边界面

![](/document/image/login.png)

默认账号和密码：lang.yu/lang.yu

## 3. 教程

新版不再提供在线的Markdown文档，所有的教程文档都会在vertx-ui运行过程中陆续开放，直接运行了可以在系统中直接查看“所见即所得”的基础教程。

![](/document/image/main-page.png)

