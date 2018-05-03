# UI0008 - 编码规范——代码约定

Zero UI定义了一套框架本身的命名约定，该约定提供给开发人员统一编程。

## 1. 基本命名

* **R-001**：所有的自定义变量都用`$`前缀进行标识
  * **R-001-1**：其中属性`Prop`中是用`$`作为直接变量前缀；
  * **R-001-2**：而状态`State`中则是用`$_`作为直接变量前缀；
* **R-002**：辅助数据主要包含两部分：数据字段（Tabular）和依赖数据（Assist）
  * **R-002-1**：其中`Tabular`的变量则使用`$t_`前缀；
  * **R-002-2**：而`Assist`的变量则使用`$a_`前缀；
  * 不需要担心的是这两种变量有专用的`Ux`的API进行数据提取，可直接调用API读取对应数据；
* **R-003**：所有的函数统一命名规范如下：
  * **R-003-1**：私有函数使用`_`作为前缀，不调用`export`暴露出来；
  * **R-003-2**：对于**依赖组件**的函数命名则使用`depend`前缀进行组件的渲染（一般位于`Op.Depend.ts`中）；
  * **R-003-3**：初始化生命周期过程中的函数使用`init`前缀执行代码（一般位于`Op.Init.ts`中）；
  * **R-003-4**：所有的**事件绑定**（如`onChange、onFocus、onBlur`）中的函数使用`on`前缀；
  * **R-003-5**：剩余所有的函数统一使用`fn`前缀，如`fnSave`，`fnSaveOrder`等（包括Redux中的函数）；

## 2. Redux命名

* **R-004**：Redux命名规范
  * **R-004-1**：所有的Action统一使用`Ux.createAction`的API创建（使用该API创建的Action会使用`Z_EVENT`环境变量）；
  * **R-004-2**：所有的Action名称都以`/`作为值前缀，并且全部大写，类似`Ux.createAction("/RX/BILL/FROM/ROOM");`；
  * **R-004-3**：Epic中调用远程API的Mock目录在当前的`mock`子目录中，且Mock数据的键和当前Epic的函数名相同；
* **R-005**：Redux中的State状态树相关规范
  * 由于Zero中写状态树使用了统一的数据结构，所以开发人员基本上不会碰到状态树的写相关API；
  * **R-005-1**：读取状态树的过程统一使用`Ux.dataIn`的API，并借用`TypeScript`中定义的`r`系列的API【[Reference](/document/2-kai-fa-wen-dang/ui0009-stateinzhong-de-r-xi-lie-api.md)】；



