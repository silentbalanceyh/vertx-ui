### 2.代码

```javascript
import React from 'react'
import Ux from 'ux';
import Op from './Op';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form.Update")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op, true)}, 1)
    }
}

export default Component
```