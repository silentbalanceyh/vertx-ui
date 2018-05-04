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
  * ```js
    import Ux from 'ux'

    export default {
        fnOrderFromRoom: Ux.createAction("/RX/ORDER/FROM/ROOM")
    }
    ```
  * **R-004-2**：所有的Action名称都以`/`作为值前缀，并且全部大写，类似`Ux.createAction("/RX/BILL/FROM/ROOM");`；
  * **R-004-3**：Epic中调用远程API的Mock目录在当前的`mock`子目录中，且Mock数据的键和当前Epic的函数名相同；

* **R-005**：Redux中的State状态树相关规范

  * 由于Zero中写状态树使用了统一的数据结构，所以开发人员基本上不会碰到状态树的写相关API；
  * **R-005-1**：读取状态树的过程统一使用`Ux.dataIn`的API，并借用`TypeScript`中定义的`r`系列的API【[Reference](/document/2-kai-fa-wen-dang/ui0009-stateinzhong-de-r-xi-lie-api.md)】；

* **R-006**：统一的Action类名设置

  * **R-006-1**：Zero UI中的全局Type名称使用`Taper`名称，导入方式：
  * ```js
    import {Taper} from 'environment';
    ```
  * **R-006-2**：第三方应用（环境变量中配置的`Z_SHARED`设置的目录则使用`Tps`名称：
  * ```js
    import {Tps} from 'app';
    ```
  * **R-006-3**：当前组件的`Act.Types.js`中的文件则使用`Types`命名：
  * ```js
    import Types from './Act.Types';
    ```

## 3. 组件相关

* **R-007**：React组件相关命名规范
  * **R-007-1**：所有组件类名统一使用`Component`，并且从`React.PureComponent`中继承；
  * ```js
    @zero({
        "内容":"zero注解专用配置"
    })
    class Component extends React.PureComponent{
        // ....
    }
    export default Component
    ```
  * **R-007-2**：组件状态state只能从zero注解中注入，除非不使用zero注解；
  * ```js
    @zero({
        state: {
            $_show: false,
            $_dialogKey: undefined
        },
    })
    class Component extends React.PureComponent{
    }
    export default Component
    ```
* **R-008**：React属性相关命名规范

  * **R-008-1**：读取资源文件中的数据统一使用`Ux.fromHoc(this,"xxx")`，此处xxx表示绑定资源文件的键值；
  * **R-008-2**：在Jsx中传递属性到子组件中，统一调用下边两个方法；
    * `Ux.toDatum(this.props)`方法直接调用，将`Tabular`和`Assist`属性直接全部传递给子组件；
    * `Ux.toProp(this.props,"xxx","yyy")`方法调用，将指定属性传递下去，这里传递`$xxx、$yyy`两个属性；
  * ```jsx
    <div>
        {/** 专用PageList管理 **/}
        <PageList fnOut={this.props.fnOut}
                  {...Ux.toProp(this.props, "hotel", "data", "app")}
                  {...Ux.toDatum(this.props)}/>
    </div>
    ```

* **R-009**：React中的穿透属性

  * **R-009-1**：子组件调用父组件时，统一使用`reference`作为属性名引用父组件（不加$符号），该规则同样适用于高阶函数中；

  * **R-009-2**：父组件调用子组件引用，统一使用`rp`前缀在属性中引用子组件（子组件可能不唯一）；

## 4. 导入导出

* **R-010**：关于导入和导出的详细规范
  * **R-010-1**：所有的外联的组件（不在当前想对目录中的都不可使用想对路径导入）；
  * **R-010-2**：当前目录中的所有组件形成一个封闭组件，除了从包中导入以外，只能从想对路径`./`中导入；

## 5. 关于Less

* **R-011**：当前系统的Less文件都是用`Cab.less`资源包的导入
  * R-011-1：所有的`Cab.less`的文件都位于当前目录中，且基本格式如下：
  * ```css
    @import "../../../global";
    /** 引用全局的@app变量，不同应用的app变量不同 **/
    .@{app} {

    }
    ```
  * R-011-2：为了防止CSS污染，全部使用`@app`变量进行封闭设置；
  * R-011-3：所有颜色相关的风格文件放在固定的全局Less中，如果需要添加则修改全局色彩文件；
  * R-011-4：调用过程直接使用`Ux.toStyle`的API进行调用；

## 6. 总结

该规范作为前端工程师使用Zero UI的统一规范，主要是辅助前端工程师完成React组件和组件之间的相关开发，你可以不遵循，那么就只有自己按照原生的React-Redux的写法来处理所有的细节。

