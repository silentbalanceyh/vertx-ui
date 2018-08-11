# UI0021 - rt按钮渲染代码

rt系列的新的API为按钮操作专用的代码部分，替换原始版本中的`ui`系、`btn`系、`op`系、`jsx`系的按钮操作，所有的rt系列的文档参考子文档信息。

* [UI0021-1 - rtLink（重定向专用按钮）](/document/2-kai-fa-wen-dang/ui0021-rtan-niu-xuan-ran-dai-ma/ui0021-1-rtlink.md)

## 1.rt系列方法限制

调用`rt`方法时需要在组件的最初绑定`Op.ts`中的方法：

```js
import React from 'react'
import Ux from 'ux';
import Op from './Op'

const {zero} = Ux;

// ....
@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Form.Item")
    .form().bind(Op)                            // bind方法用于和Op绑定
    .to())
class Component extends React.PureComponent {
    // ...
}

export default Component
```

## 2.Op基本规则

### 2.1.绑定/高阶

> Op绑定的基本规则：
>
> * `Op`绑定的方法只绑定以`$`开头的方法，Zero中的基本规则：**R-003-6**
> * 绑定的所有方法都是二阶函数；

```typescript
const $opLogin = (reference: any) => (values: any)
```

* 一阶参数`reference`：当前React组件引用
* 二阶参数`values`：Ant-Design的Form专用的提交过后的值

### 2.2.Fail自动绑定

除了上边的绑定以外，对于和当前操作相关的Op中可以定义“容错”绑定函数，如下：

```typescript
const $opLogin = (reference:any) => (values: any)
const $opLoginFailure = (reference:any) => (errors:any)

export default {
    $opLogin,
    $opLoginFailure
}
```

* 如果`$opLogin`返回一个`Promise`，在`Promise.reject`过后会触发`$opLoginFailure`函数；
* `$opLogin`可以返回两种值：
  * 异步调用：返回`Promise`；
  * 同步调用：直接JavaScript的函数返回；

## 3.关于防重复提交

按钮在防重复提交是默认完成的（loading）效果，主要有两种类型

* **React模式**：React直接模式会使用`reference.state.$loading`的值来绑定到按钮中实现防重复提交；
* **Connect模式**：这种模式由于无法直接用React交互，会调用React中的状态来实现，状态树：`out.status.submitting.loading`；

## 4.总结

设计新的按钮的API的目的是真正意义目的如下：

* 统一按钮的渲染操作；
* 和Connect连接架构相对应；
* 统一处理不同的按钮行为：
  * 重定向专用按钮；
  * 提交/重置双用按钮；
  * 提交专用按钮；
  * 重置专用按钮；



