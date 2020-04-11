# UI0000 - 项目初始化

## 1.初始化

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

## 2.运行

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

```shell
Compiled successfully!

You can now view vertx-zero in the browser.

  Local:            http://localhost:4000/
  On Your Network:  http://10.0.0.6:4000/

Note that the development build is not optimized.
To create a production build, use yarn build.
```

### 3.打开

使用浏览器打开：[http://localhost:4000/zui/login/index](http://localhost:4000/zui/login/index)，则您可以看到如下界面

![](/document/previous/backupus/backup/image/homepage.png)使用默认账号和密码进入主界面：

```
用户名：lang.yu
密码：lang.yu
```

主界面如下：

![](/document/previous/backup/image/mainpage.png)

