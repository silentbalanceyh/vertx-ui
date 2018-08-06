# UI0006 - 模板/组件开发规范

本文主要描述Zero UI中的模板和组件的基本开发规范，开发规范的设计遵循一下原则：

* 使用前缀法用于标识不同职责的组件；
* 特殊组件固定文件名（方便代码生成器自动编连）；

## 1. 命名法则

* UI组件在每个目录中使用`UI`前缀，并使用`.`分割不同职责组件；
* Action组件在每个目录中使用`Act`前缀，使用`.`分割不同职责组件；
* 事件组件在每个目录中使用`Op`前缀，表示UI中某个按钮触发、链接点击过后的专用组件，且事件脚本推荐使用TypeScript编写（开发人员容易出错的地方）；
* 资源和风格文件使用`Cab.json/Cab.less`两个核心文件；
* 固定组件连接文件：
  * `UI.js`：路由链接文件，当前页面的主组件文件；
  * `Act.Epic/Act.Types`：二者同时出现，当前组件若开启Redux则需要使用；
  * `Cab.json`：资源文件名，里面定义了当前组件的名空间，访问不同语种资源文件时必须使用；

## 2. 日志器

特殊命名法则会让框架产生系统自动化的行为，主要根据组件的文件名来判断当前组件会调用那种日志器，目前系统中的日志器主要包括：

```js
export default {
    control,        // 可重用控件日志器
    container,      // 布局专用日志器
    component,      // 页面内组件专用日志器
    page,           // 页面专用日志器
    form,           // 表单组件专用日志器
    stateless,      // 无状态页面专用日志器
    sign,           // 数字签名请求专用日志器
    request,        // Ajax请求专用日志器
    response,       // Ajax响应专员日志器
    error,          // 错误日志器
    debug,          // 调试日志器
    filters,        // 搜索时查询条件查询Form专用日志器
    mock            // Mock模拟数据专员日志器
}
```

每种日志器输出的颜色有所区别，并且分组了，所以最终日志呈现如下：

![](/document/image/UI0006-1.png)

## 3. 日志器的选择

日志器在@zero注解中可直接进行设置，用法如下

```js
import Ux from 'ux';


const {zero, Logger} = Ux;

@zero({
    "i18n.name": "UI",
    "i18n.cab": require("./Cab.json"),
    logger: Logger.page,
})
```

不同的日志影响了不同的console中日志的颜色，基本规则如下：

* 【开发人员定义】如果外部传入了日志器，则优先使用外部日志器；
* **container**：【容器日志】如果名空间（`Cab.json`）中的ns包含了`container/`路径，并且当前文件为`UI.json`的资源处理（入口文件），则使用`Logger.container`日志器；
* **page**：【页面日志】如果当前文件名绑定了`UI.json`（入口文件），则直接使用`Logger.page`日志器；
* **form**：【表单日志】如果文件名中包含了`Form`（表单专用命名），则直接使用`Logger.form`日志器，并且这个时候会默认设置`form`为true，启用Ant Design的表单功能；
* **stateless**：【无状态】如果文件名中包含了`Report`或`Chart`，一般用于做报表，则使用`Logger.stateless`日志器；
* **control**：【控件】如果文件名中包含了`Filter`或`List`，列表页、过滤器，则使用`Logger.control`日志器；
* **components**：其他所有不匹配的组件则直接使用`Logger.components`日志器；

> 日志器只有在开发模式中有用，生产模式中这些日志器全部都不会被打开，Ajax系列的日志器都是默认根据行为来的，前提是使用了Ux中的构造Promise的Api。

## 4. 示例

这里提供一个完整的模板 + 页面的例子，以后教程会逐一说明如何使用Zero UI开发复杂界面，还需要注意的是下边的这些文件并不是一个组件的最小子集，后边会说明如何开发一个最小的模板以及详情页，让读者更了解该脚手架的基本用途：

```shell
# 模板资源文件
src/cab/cn/container/main/hotel-admin/UI.json
src/cab/cn/container/main/hotel-admin/UI.Account.json
# 模板文件
src/container/main/hotel-admin/Act.Epic.js
src/container/main/hotel-admin/Act.Types.js
src/container/main/hotel-admin/Cab.json
src/container/main/hotel-admin/Op.Effect.ts
src/container/main/hotel-admin/Op.Jump.ts
src/container/main/hotel-admin/Op.ts
src/container/main/hotel-admin/UI.Account.js
src/container/main/hotel-admin/UI.Header.js
src/container/main/hotel-admin/UI.js
src/container/main/hotel-admin/UI.Notify.js
src/container/main/hotel-admin/UI.Sider.js
# ---------------- 模板可重用 -------------------------

# 页面资源文件
src/cab/cn/components/call/order/UI.json
src/cab/cn/components/call/order/UI.Form.Item.json
src/cab/cn/components/call/order/UI.Form.json
src/cab/cn/components/call/order/UI.List.json
# 页面组件专用文件
src/components/call/order/Cab.json
src/components/call/order/Cab.less
src/components/call/order/Op.Action.ts
src/components/call/order/Op.Depend.ts
src/components/call/order/Op.Effect.ts
src/components/call/order/Op.ts
src/components/call/order/UI.Form.Item.js
src/components/call/order/UI.Form.js
src/components/call/order/UI.js
src/components/call/order/UI.List.js
```



