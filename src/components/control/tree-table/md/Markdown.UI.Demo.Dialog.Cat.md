### 1.说明

表单基本代码。

### 2.代码

```js
    import React from 'react'
    import Ux from "ux";
    import Op from "./Op.Act";

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Dialog.Cat")
        .bind(Op.Rank).raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldForm(this, {}, 1)
        }
    }

    export default Component
```