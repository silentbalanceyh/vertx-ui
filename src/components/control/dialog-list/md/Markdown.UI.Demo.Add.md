### 1.说明

#### 1.1.基本结构

该文件`UI.Demo.Add.js`是使用DialogList时的"添加"入口，该界面包含两部分：

1. **Form**：主Form表单；
2. **DialogList**：当前示例的"主角"，DialogList子列表组件；

#### 1.2.传递参数

实际上在整个组件树过程中，在出现DialogList之后，文件结构将在原始基础上发生了改变（右上角查看文件树）

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';
    import {DialogList} from 'web';
    import Form from './UI.Demo.Dialog';
    import MajorForm from './UI.Demo.Add.Major'

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