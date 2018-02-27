# UI0006 - 模板/组件开发规范

本文主要描述Zero UI中的模板和组件的基本开发规范，开发规范的设计遵循一下原则：

* 使用前缀法用于标识不同职责的组件；
* 特殊组件固定文件名（方便代码生成器自动编连）；

## 1. 命名法则

* UI组件在每个目录中使用`UI`前缀，并使用`.`分割不同职责组件；
* Action组件在每个目录中使用`Act`前缀，使用`.`分割不同职责组件；
* 事件组件在每个目录中使用`Op`前缀，表示UI中某个按钮触发、链接点击过后的专用组件；
* 资源和风格文件使用`Cab.json/Cab.less`两个核心文件；
* 固定组件连接文件：
  * `UI.js`：路由链接文件，当前页面的主组件文件；
  * `Act.Epic/Act.Types`：二者同时出现，当前组件若开启Redux则需要使用；
  * `Cab.json`：资源文件名，里面定义了当前组件的名空间，访问不同语种资源文件时必须使用；

## 2. 示例

这里提供一个完整的开发文件，以后会逐一说明：

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



