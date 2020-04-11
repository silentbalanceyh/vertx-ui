# UT0001 - yuidoc工具生成API文档

## 1.环境准备

### 1.1.依赖环境变量

| 环境变量名 | 备注 |
| :--- | :--- |
| JS\_OUT | 文档输出主目录 |
| JS\_PORT | 当前API文档运行的服务器地址 |

### 1.2.基础环境

该API服务器依赖工具`yuidoc`和`serve`，使用下边命令安装：

```shell
# API文档工具
npm install -g yuidocjs
# HTTP静态服务器
npm install -g serve
```

### 1.3.配置文件yuidoc.json

配置文件默认值为：

```json
{
    "name": "Zero UI Doc",
    "description": "Zero UI前端文档工具",
    "version": "0.1.0",
    "options": {
        "paths": "./src",
        "outdir": "./docs/api"
    }
}
```

## 2.使用方法

### 2.1.脚本解析

根目录下有`run-doc.sh`的脚本，该脚本用于生成`src`源代码目录下的API，该脚本的内容如下：

```cmd
#!/usr/bin/env bash
# 两个环境变量，生成API文档的目录和API文档服务器的端口
export JS_OUT=docs/api
export JS_PORT=5000
echo "[Zero UI] Start to generate Api documents!"
# 删除原始目录
rm -rf ${JS_OUT}/docs
yuidoc --config yuidoc.json
echo "[Zero UI] Generated document successfully! You can open http://localhost:$JS_PORT to see results."
serve -p ${JS_PORT} -s ${JS_OUT}
```

### 2.2.执行

在环境中执行`run-doc.sh`脚本，你将在控制台得到下边输出，默认端口`5000`：

```shell
[Zero UI] Generated document successfully! You can open http://localhost:5000 to see results.

   ┌───────────────────────────────────────────────┐
   │                                               │
   │   Serving!                                    │
   │                                               │
   │   - Local:            http://localhost:5000   │
   │   - On Your Network:  http://10.0.0.7:5000    │
   │                                               │
   │   Copied local address to clipboard!          │
   │                                               │
   └───────────────────────────────────────────────┘
```

### 2.3.浏览器中访问

![](/document/previous/backupus/backup/image/UT0001-1.png)

## 3.总结

关于API服务器能识别的注释部分的内容，可以参考yuidoc工具的官方文档【[Reference](http://yui.github.io/yuidoc/#user-guides)】。

