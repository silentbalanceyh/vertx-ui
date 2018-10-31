本文主要介绍如何搭建`Zero UI`的开发环境，该环境不需要「后端」，示例程序和教程可直接
在纯`Node Js`环境中运行，代码下载地址：<https://github.com/silentbalanceyh/vertx-ui>

基本环境确认：

* `Node Js`：（ > 8.x ）推荐使用 11.0.0；
* `Git`：2.17.1（Apache Git）；

*Zero UI的教程使用的是所见即所得的模式，所以开发人员可直接在Zero UI的运行过程中查看相关文档。*

## 步骤

示例目录：`~/Runtime/zero/ui/`

1. 使用下边命令下载代码：
```bash
    git clone https://github.com/silentbalanceyh/vertx-ui
```

2. 下载代码过后进入到`vertx-ui`目录中，执行`npm install`安装依赖包：
```bash
    cd vertx-ui
    npm install
```

3. 运行根目录脚本：`run-zero.sh | run-zero.bat`

```bash
    ./run-zero.sh
```

4. 程序运行后，在浏览器中打开：<http://localhost:4000/zui/login/index>进入主界面。
5. 登录：账号和密码都是 lang.yu 。

## 自定义项目

完成上边的步骤过后，系统已经是一个可以运行的基础系统，如果要在自己的项目中使用该框架，则可以参考后续教程，
在初始化的脚手架中，则要完成下边步骤：

1. 删除资源目录中的多余资源：
    1. `src/cab/cn/container`中的资源：「自己定义了模板」
    2. `src/cab/cn/components`中的资源：「自己定义了入口页」
2. 根据上述资源文件路径，删除对应的组件目录：
    1. `src/container`中的模板，使用自己定义的模板。
    2. `src/components`中的页面，使用自己定义的页面。
3. 根据自己定义的模板和页面，在`src/route.json`中定义：模板 - 页面 的使用关系