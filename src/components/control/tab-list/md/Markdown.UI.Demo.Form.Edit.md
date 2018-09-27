### 1.说明

#### 1.1.直接属性

* **$inited**：（Object）当前表单读取的记录数据，填充表单专用；

#### 1.2.ComplexList传入（Function）

* **fnClose()**：【无参数】关闭Tab页专用函数（关闭当前Tab页）；
* **fnMock()**：Mock环境专用参数；

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Form")
        .bind(Op)
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op, true)}, 1)
        }
    }

    export default Component
```