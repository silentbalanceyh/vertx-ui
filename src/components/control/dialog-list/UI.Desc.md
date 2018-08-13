### 示例

由于UI.Demo.Form.js是ComplexList中传入的Form引用，所以这里的示例代码直接从Form节点开始。

#### ------------------------------------------------------ UI.Demo.Form.js

```javascript
import React from 'react'
import Ux from 'ux';
// 注意这里调入的是Op.Sub，并非Op
import Op from './Op.Sub';
import {DialogList} from 'web';
// 导入的为弹出框中的Form组件
import Form from './UI.Demo.Form.Sub';
// MajorForm为原来的Form组件（主记录专用）
import MajorForm from './UI.Demo.Form.Update'

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form").to()
)
class Component extends React.PureComponent {
    render() {
        return (
            <div>
                <MajorForm {...this.props}/>
                <DialogList {...this.props} 
                            reference={this}
                            rxDelete={Op.opSubDeletePost(this)}
                            $formAdd={Form} 
                            $formEdit={Form}/>
            </div>
        )
    }
}

export default Component
```

#### ------------------------------------------------------ UI.Demo.Form.Update.js

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

#### ------------------------------------------------------ UI.Demo.Form.Sub.js

```javascript
import React from 'react'
import Ux from 'ux';
import Op from './Op.Sub';

const {zero} = Ux;

@zero(Ux.rxEtat(require('./Cab.json'))
    .cab("UI.Demo.Form.Sub")
    .bind(Op)
    .form().to()
)
class Component extends React.PureComponent {
    render() {
        return Ux.uiFieldForm(this, {}, 1)
    }
}

export default Component
```

### ------------------------------------------------------ Op.ts

```typescript
import Ux from 'ux';
import Mock from './mock';

const $opSave = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    console.info(values);
});
const $opAdd = (reference: any) => Ux.ai2Event(reference, (values, mockData) => {
    console.info(values);
});
// 注意这个地方的onEditPost方法必须要将记录数据写入到list.items中，lite.items是一个DataObject
const opEditPost = (reference: any) => (record: any, id: any) => {
    // 在编辑点击过后操作，将数据写入到items
    const mockData = Mock.fnUsers;
    let dataArray = mockData.mock ? mockData.data : (
        record["users"] ? record["users"] : []
    );
    // 读取当前记录中的子列表
    dataArray = dataArray.filter(item => item.deptId === id);
    // 从$items（DataObject）中更新id = dataArray的子列表
    const {$items} = reference.props;
    const dataRecord = Ux.rapitRecord($items, id, dataArray);
    // 将最终生成的Record写入到状态树 list.items
    Ux.writeTree(reference, {
        "list.items": dataRecord
    })
};
export default {
    $opSave,
    $opAdd,
    opEditPost
}
```

上边的opEditPost绑定的位置在ComplexList使用的地方。

```javascript
                    <ComplexList 
                             reference={this}
                             rxEditPost={Op.opEditPost(this)}
                             $mockData={Mock.fnDeptList}
                             $formFilter={Filter}
                             $formAdd={FormAdd}
                             $formEdit={FormEdit}
                             {...this.props}/>
```

### ------------------------------------------------------ Op.Sub.ts

```typescript
import Ux from 'ux';

const $opSubSave = (reference: any) => (values) => {
    // 更新窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    Ux.rdxListItem(reference, values);
};
const $opSubAdd = (reference: any) => (values) => {
    // 添加窗口回调
    console.info(values, reference.props);
    // 关闭窗口
    Ux.closeWindow(reference);
    // 更新数据
    Ux.rdxListItem(reference, values);
};
const opSubDeletePost = (reference: any) => (id: any) => {
    // 列表删除回调
    console.info(id, reference)
};
export default {
    $opSubSave,
    $opSubAdd,
    opSubDeletePost
}
```