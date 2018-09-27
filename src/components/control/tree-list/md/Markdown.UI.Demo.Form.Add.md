### 1.说明

参考：<a href="/zui/control/tab-list" target="_blank">TabList教程</a>

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
            return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op)}, 1)
        }
    }

    export default Component
```