### 1.说明

#### 1.1.专用数据

* `$list`：（DataObject）列表数据；
* `$mockData`：（Object）模拟数据信息；
* `$query`：（DataObject）查询参数，从`grid.query`节点中读取；

#### 1.2.直接属性

* `$inited`：（Object）当前表单读取的记录数据，填充表单专用；
* `$items`：（DataObject）状态树上专用数据，连接到 list.items ；

#### 1.3.ComplexList传入（Function）

* `fnClose`：关闭Tab页专用函数（关闭当前Tab页）；
* `fnMock`：Mock环境专用参数；

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op.Sub';
    import {DialogList} from 'web';
    import Form from './UI.Demo.Form.Dialog';
    import MajorForm from './UI.Demo.Form.Edit'

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
                                rxDelete={Op.opSubDeletePost(this)}
                                $formAdd={Form} $formEdit={Form}/>
                </div>
            )
        }
    }

    export default Component
 ```