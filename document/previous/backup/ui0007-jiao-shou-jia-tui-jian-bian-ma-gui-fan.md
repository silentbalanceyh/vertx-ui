# UI0007 - 编码规范——文件命名

Zero UI为了保证开发人员的统一开发效率，文件命名规范如下：

## 1. 固定文件

### 1.1. UI组件文件

Zero UI中的固定文件名主要包含几个核心文件，注意的是暂时只支持二级路由：

```
1.模板/页面/组件的入口文件UI.js
# 模板文件，login表示模块名称，index表示页面名称
container/login/index/UI.js

# 页面文件
components/login/index/UI.js

# 可重用组件文件
econnomy/dialog/DynamicDialog/UI.js
```

> 上边规则需要注意的是可重用组件的倒数第二个目录名是“驼峰式”的，主要是方便查找可重用组件，而且属于UI组件研发中的规范，和开发项目不冲突，由Zero UI维护。

### 1.2. 资源/风格文件

Zero UI中每个组件目录下会包含资源文件和风格文件：

* 资源文件用于链接资源包`cab/${Z_LANGUAGE}/`中同目录下的资源配置文件，可支持多语言架构；
* 风格文件用于设置当前组件的基本风格；

这两个文件如下：

```shell
# 资源文件链接配置
container/login/index/Cab.json

# 风格文件专用
container/login/index/Cab.less
```

### 1.3. 操作/事件入口文件

Zero UI中对于当前页面组件的操作只需要一个入口文件，其他所有的操作都可以通过该入口文件进行链接：

```shell
# 使用TypeScript书写事件，防止程序过程中偏函数情况
container/login/index/Op.ts
```

### 1.4. Redux链接文件

Zero UI在开发和生产过程中会启用自动生成脚本生成所需要的Reducer/Action文件，所以每个组件中如果需要启用则必须保证下边两个链接文件存在：

```shell
## 模板链接
container/login/index/Act.Epic.js
container/login/index/Act.Types.js

## 页面链接
components/login/index/Act.Epic.js
components/login/index/Act.Types.js
```

## 2. 非固定文件

针对常用的非固定文件命名则采用下边几个原则：

* 由于ES6的导入支持导入带有`.`号的文件，所以当组件中需要使用子组件时，则直接开组件后缀，命名本身形成一棵树；
* 组件本身除非是特别复杂的交互才开子目录，对于常用的交互默认不创建目录来放组件相关文件；

常见的文件可以参考下表的示例（比如位于某个页面）：

| 文件名 | 类型 | 业务含义 |
| :--- | :--- | :--- |
| UI.js | UI组件 | 当前页面的入口，访问/xxx/yyy时的入口JS文件，会被直接链接到动态路由中。 |
| UI.Bill.js | UI组件 | 账单的Tab页专用组件 |
| UI.Bill.List.js | UI组件 | 账单的Tab页中的账单列表 |
| UI.Bill.Filter.js | UI组件 | 账单的Tab页中的搜索Form |
| UI.Bill.Dialog.js | UI组件 | 当前账单的Tab页需要弹出的对话框 |
| UI.Bill.Dialog.Form.js | UI组件 | 当前账单的Tab页弹出对话框中的对话框表单组件 |
| Op.ts | 操作/事件函数 | 操作/事件的入口组件 |
| Op.Action.ts | 操作/事件函数 | 提交/保存函数（Ajax访问） |
| Op.Depend.ts | 操作/事件函数 | 交互式控件的依赖函数，如某个Checkbox为true时可录入，为false不可录入 |
| Op.Init.ts | 操作/事件函数 | 对State中的数据读取过后，需要在Render中执行转换，一般该事件在初始化流程中 |
| Op.Dialog.ts | 操作/事件函数 | 当前页面有弹出框时，弹出框上的事件 |

## 3. 总结

文件命名在Zero UI中并非必须的东西，但推荐开发人员如此操作，而固定文件是必须的，按照这样操作才好借用后期的生成工具生成一堆配置信息，至于非固定文件，反正`UI.js`是入口，你可以直接写上该入口，其他的随意。

