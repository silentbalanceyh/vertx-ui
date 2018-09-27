### 1.说明

#### 1.1.专用数据

* **$addKey**：（UUID）当前临时的Key信息，系统生成，只在窗口打开时使用；

#### 1.2.ComplexList传入（Function）

* **fnClose()**：【无参数】关闭Tab页专用函数（关闭当前Tab页）；
* **fnView()**:【无参数】直接从添加界面切换到编辑界面；
* **fnMock()**:【无参数】Mock环境专用函数，生成Mock数据用；

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