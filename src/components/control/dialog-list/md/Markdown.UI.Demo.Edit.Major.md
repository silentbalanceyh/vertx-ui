### 1.说明

在没有特殊说明的情况下，`UI.Demo.Add.Major.js/UI.Demo.Edit.Major.js`文件没有任何区别，
唯一的区别在于变量上，可参考ComplexList中的「编辑」表单中的代码。

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Edit.Major")
        .bind(Op.Act)
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {

        render() {
            return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op.Act, true)}, 1)
        }
    }

    export default Component
```