### 1.说明

> 需要说明一点的是，添加模式/编辑模式可操作的数据有所区别；

#### 1.1.专用数据

* `$list`：（DataObject）列表数据；
* `$mockData`：（Object）模拟数据信息；
* `$query`：（DataObject）查询参数，从`grid.query`节点中读取；

#### 1.2.直接属性

* `$inited`：（Object）当前表单读取的记录数据，填充表单专用；
* `$items`：（DataObject）状态树上专用数据，连接到 list.items ；

#### 1.3.DialogList传入（Function）

* `fnClose`：关闭Tab页专用函数（关闭当前Tab页）；
* `fnMock`：Mock环境专用参数；
* `fnListItem`：更新 list.items 中的数据，调用rapitRecord数据；
* `fnClear`：清空DialogList组件的状态中的editKey，一般在关闭窗口时使用；

#### 1.4.特殊数据

* `$key`：【更新模式专用】当前窗口自己录的主键；
* `$parent`：更新模式和添加模式都可用，主记录的数据信息；

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op.Sub';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Form.Dialog")
        .bind(Op)
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldForm(this, {}, 1)
        }
    }

    export default Component
 ```