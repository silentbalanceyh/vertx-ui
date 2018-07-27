# Zero UI帮助文档

> _如果说组件是没有生命的驱壳，数据则是灵魂，而我们想要创造的是拥有灵魂的“精灵”。_

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

## 2. 创建项目

### 2.1.初始化

初始化工程需要依赖Zero AI工具，参考链接【[Reference](http://www.vertxai.cn/doc/gong-cheng-chu-shi-hua.html)】步骤如下：

```shell
## 1.安装vertx-ai工具
npm install -g vertx-ai

## 2.创建一个空目录
mkdir zero-demo

## 3.（依赖工具）初始化工程，初始化速度取决于你和Github站点的网速
ai zero -o zero-demo

################################# 输出 #################################
[Zero AI] Zero AI 代码生成器, GitHub : https://github.com/silentbalanceyh/vertx-ui
[Zero AI] 当前版本: 0.2.11  确认您的Node版本 ( >= 10.x ) 支持ES6.
[Zero AI] Zero AI 系统启动......
[Zero AI] 命令参数：
{
    "out": "zero-demo"
}
[Zero AI] 初始化项目：Cloning into 'zero-demo'...

[Zero AI] 删除文件：zero-demo/CNAME
[Zero AI] 删除文件：zero-demo/LICENSE
[Zero AI] 删除文件：zero-demo/_config.yml
[Zero AI] 删除文件：zero-demo/yarn.lock
[Zero AI] 删除文件：zero-demo/.git/HEAD
[Zero AI] 删除文件：zero-demo/.git/config
[Zero AI] 删除文件：zero-demo/.git/description
[Zero AI] 删除文件：zero-demo/.git/hooks/applypatch-msg.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/commit-msg.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/post-update.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/pre-applypatch.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/pre-commit.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/pre-push.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/pre-rebase.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/pre-receive.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/prepare-commit-msg.sample
[Zero AI] 删除文件：zero-demo/.git/hooks/update.sample
[Zero AI] 删除文件：zero-demo/.git/index
[Zero AI] 删除文件：zero-demo/.git/info/exclude
[Zero AI] 删除文件：zero-demo/.git/logs/HEAD
[Zero AI] 删除文件：zero-demo/.git/logs/refs/heads/master
[Zero AI] 删除文件：zero-demo/.git/logs/refs/remotes/origin/HEAD
[Zero AI] 删除文件：zero-demo/.git/objects/pack/pack-329f632bbbd2fd8acfa8acfaa37f60d8daef71d3.idx
[Zero AI] 删除文件：zero-demo/.git/objects/pack/pack-329f632bbbd2fd8acfa8acfaa37f60d8daef71d3.pack
[Zero AI] 删除文件：zero-demo/.git/packed-refs
[Zero AI] 删除文件：zero-demo/.git/refs/heads/master
[Zero AI] 删除文件：zero-demo/.git/refs/remotes/origin/HEAD
[Zero AI] 初始化完成，项目地址：zero-demo
```

初始化完成过后，就可以用WebStorm或者VSCode打开该项目。

### 2.2.运行

进入到初始化的`zero-demo`目录

```shell
cd zero-demo
```

安装依赖包（等待依赖安装完成后即可运行）

```shell
npm install
```

运行项目，由于有生成功能，所以启动项目的时候需要依赖启动脚本（`run-zero`），Windows/Mac都包含了该脚本。

```shell
./run-zero.sh（非Windows）
./run-zero.bat（Windows）
```

运行完成后会出现以下输出：



## 3. 整体架构

整个Zero框架的结构图如下：

![](/document/image/arch.png)

## 4. 文档列表

### 环境说明

* [UI0001 - 脚手架说明](/document/ui0001-jiao-shou-jia-shuo-ming.md)
* [UI0002 - 环境变量](/document/ui0002-huan-jing-bian-liang.md)
* [UI0003 - 路由/资源文件说明](/document/ui0003-ji-ben-kai-fa-gui-fan.md)
* [UI0007 - 编码规范——文件命名](/document/ui0007-jiao-shou-jia-tui-jian-bian-ma-gui-fan.md)
* [UI0008 - 编码规范——代码约定](/document/ui0008-bian-ma-gui-fan-2014-2014-dai-ma-yue-ding.md)
* [UI0006 - 模板/组件规范示例](/document/ui0006-mo-677f-zu-jian-kai-fa-gui-fan.md)

### 开发文档

* [UI0009 - StateIn中的r系列API](/document/2-kai-fa-wen-dang/ui0009-stateinzhong-de-r-xi-lie-api.md)
* [UI0010 - zero注解](/document/2-kai-fa-wen-dang/ui0010-zerozhu-jie.md)
* [UI0011 - TypeScript数据模型](/document/2-kai-fa-wen-dang/ui0011-typescriptshu-ju-mo-xing.md)
* [UI0013 - 页面代码结构说明](/document/2-kai-fa-wen-dang/ui0013-ye-mian-dai-ma-jie-gou-shuo-ming.md)
* [UI0016 - Form的复杂布局（Grid）](/document/2-kai-fa-wen-dang/ui0016-formde-fu-za-bu-ju-ff08-grid.md)
* [UI0015 - required，Form中的字段验证](/document/2-kai-fa-wen-dang/ui0015-formzhong-de-zi-duan-yan-zheng.md)
* [UI0019 - 按钮的connect机制](/document/2-kai-fa-wen-dang/ui0019-an-niu-de-connect-ji-zhi.md)

### 自定义组件

* [UC0001 - page/PageCard](/document/2-kai-fa-wen-dang/ui0017-ye-tou-ying-yong.md)

### 步步为营

* [UI0012 - 路由测试](/document/ui0012-lu-you-ce-shi.md)
* [UI0004 - 开发第一个模板](/document/ui0004-kai-fa-di-yi-ge-mo-ban.md)
* [UI0005 - 开发第一个页面](/document/ui0005-kai-fa-di-yi-ge-ye-mian.md)
* [UI0014 - 开发提交按钮事件](/document/ui0014-kai-fa-ti-jiao-an-niu-shi-jian.md)
* [UI0018 - 登录/注销跳转](/document/2-kai-fa-wen-dang/ui0018-deng-5f55-zhu-xiao-tiao-zhuan.md)

### 属性解析器

* [AI0001 - aiExpr属性解析器](/document/ai0001-aiexprshu-xing-jie-xi-qi.md)
* [AI0002 - aiExprButton属性解析器](/document/ai0002-aiexprbuttonshu-xing-jie-xi-qi.md)

### Ux工具包

参考UT0001，运行脚本`run-doc.sh`，则可以从浏览器查看文档：[http://localhost:5000/](http://localhost:5000/)

### 脚手架解析

* [UT0001 - yuidoc工具生成API文档](/document/3-jiao-shou-jia-jie-xi/ut0001-yuidocgong-ju-sheng-cheng-api-wen-dang.md)
* [UT0002 - storybook可重用组件文档](/document/3-jiao-shou-jia-jie-xi/ut0002-storybookke-zhong-yong-zu-jian-wen-dang.md)



