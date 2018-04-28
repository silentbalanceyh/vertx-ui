# UT0002 - storybook可重用组件文档

Storybook在本框架中用来描述可重用组件的用法，官方文档参考【[Reference](https://storybook.js.org/)】：

## 1.环境准备

### 1.1.依赖环境变量

| 环境变量名 | 备注 |
| :--- | :--- |
| SB\_PORT | Storybook运行的端口号 |

### 1.2.基础环境

参考官方的教程，使用下边命令安装：

```shell
# Storybook命令行安装
npm install -g @storybook/cli
```

## 2.使用方法

### 2.1.脚本解析

项目根目录有`run-story.sh`的Shell脚本，该脚本内容如下：

```shell
#!/usr/bin/env bash
export SB_PORT=6006
npm run-script build-storybook
npm run-script storybook
```

### 2.2.执行

执行该脚本，它会先编译您的Storybook，并且生成最终的站点：

```shell
> start-storybook -p $SB_PORT

info @storybook/react v3.4.3
info 
info => Loading custom .babelrc
info => Loading custom webpack config (extending mode).
webpack built 9680b15a3708989b8aba in 3351ms                                            
info Storybook started on => http://localhost:6006/
info
```

### 2.3.用浏览器打开

![](/document/image/UT0002-1.png)

## 3.总结

最终可在开发可重用组件的过程中一边写相关文档以及Storybook，一边开发科重用组件库。

