### 1.说明

#### 1.1.专用数据

* **$addKey**：（UUID）当前临时的Key信息，系统生成，只在窗口打开时使用；
* **$items**：（DataObject）状态树上专用数据，连接到 list.items ；

#### 1.3.ComplexList传入（Function）

* **fnClose**：关闭Tab页专用函数（关闭当前Tab页）；
* **fnView()**:【无参数】直接从添加界面切换到编辑界面；
* **fnMock**：Mock环境专用参数；

需要特别注意的是，为了防止"子表单/主表单重复绑定问题"，所以在同时提供了ComplexList的主表单
和DialogList弹出表单的过程中，Op需要执行分流

* Op.ts
    * Op.Act.ts
    * Op.Sub.ts

其中Op中的核心函数：`opEditPost/opDeletePost`提供函数用于传入rxEditPost和rxDeletePost函数，
而`Op.Act`用于和主表单执行绑定，本教程中的`bind`处理；`Op.Sub`用于和子表单执行绑定。

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';
    import Op from './Op';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Add.Major")
        .bind(Op.Act)
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldForm(this, {...Ux.ai2FormButton(Op.Act)}, 1)
        }
    }

    export default Component
 ```