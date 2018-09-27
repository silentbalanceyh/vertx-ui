### 1.说明

这个表单除了Button部分，其他内容就是一个基本表单的流程。

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op.Tree';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Tree.Form.Add")
        .bind(Op)
        .raft(2)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldForm(this, {}, 2)
        }
    }

    export default Component
```