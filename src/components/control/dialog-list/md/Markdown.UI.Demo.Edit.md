### 1.说明

> 在没有特殊说明的情况下，`UI.Demo.Add.js/UI.Demo.Edit.js`文件没有任何区别，都属于连接文件。

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';
    import {DialogList} from 'web';
    import Form from './UI.Demo.Dialog';
    import MajorForm from './UI.Demo.Edit.Major'

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Form")
        .to()
    )
    class Component extends React.PureComponent {
        render() {
            return (
                <div>
                    <MajorForm {...this.props}/>
                    <DialogList {...this.props} reference={this}
                                rxDelete={Op.opDeletePost(this)}
                                $formAdd={Form} $formEdit={Form}/>
                </div>
            )
        }
    }

    export default Component
```