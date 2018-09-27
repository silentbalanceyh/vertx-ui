### 1.说明

#### 1.1.专用数据

* **$query**：（DataObject）查询参数，从`grid.query`节点中读取；

#### 1.2.直接属性

* **$cond**：（Array）数组类型，当前Filter专用的条件原始数据；
* **$inited**：（Object）Zero规范中Form专用的初始化数据；
* **$page**：计算布局修正值专用，当前Drawer抽屉组件的宽度；

#### 1.3.ComplexList传入（Function）

* **fnClose()**：【无参数】关闭Tab页专用函数（关闭当前Tab页）
* **fnQueryDefault()**`：【无参数】读取默认的Query过滤参数
* **fnTerm(term)**：设置基础设置中的输入框中的数据（清除按钮专用）
    * **term**：传入的值，该值将会更新基础搜索框中的搜索文字。

### 2.例子

```javascript
    import React from 'react'
    import Ux from 'ux';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Filter")
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldFilter(this, {...Ux.ai2FilterButton(1 / 3)}, 1)
        }
    }

    export default Component
```