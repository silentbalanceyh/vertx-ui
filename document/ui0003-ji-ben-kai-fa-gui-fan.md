# UI0003 - 基本开发规范

本章节介绍Zero UI的基本开发规范，主要用于描述Zero UI的一些系统生成的连接文件，配合生成器生成对应组件文件，但是这些文件都遵循一定的命名规范，所以需要开发者注意。

## 1. 核心文件

### 1.1. 模板文件

文件路径：

```shell
src/container/index.js
```

该文件会在启动zero时自动生成，以二级目录中扫描到的路径为主，Console中输出如下：

```shell
[SUC] Successfully to write data to src/container/index.js
```

示例：



