### 1.说明

标准Form处理。

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';
    import {PageCard} from 'web';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Left")
        .connect(state => Ux.dataIn(state)
            .radial([
                "model.credit"
            ], true)
            .to()
        )
        .loading("model.credit")
        .bind(Op)
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return (
                <PageCard reference={this}>
                    {Ux.uiFieldForm(this, {}, 2)}
                </PageCard>
            )
        }
    }

    export default Component
```