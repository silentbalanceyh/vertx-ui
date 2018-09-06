### 1.说明

#### 1.1.专用数据

* `$list`：（DataObject）列表数据；
* `$mockData`：（Object）模拟数据信息；
* `$query`：（DataObject）查询参数，从`grid.query`节点中读取；

#### 1.2.ComplexList传入（Function）

* `fnClose`：关闭Tab页专用函数（关闭当前Tab页）；
* `fnMock`：MOck环境专用参数；

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Form")
        .bind(Op)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op)}, 1)
        }
    }

    export default Component
```