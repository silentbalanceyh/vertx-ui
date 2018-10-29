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
