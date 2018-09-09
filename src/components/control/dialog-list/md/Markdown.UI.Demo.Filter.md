### 1.说明

此处省略掉Filter的说明，直接参考ComplexList中的Filter的配置即可，Filter不会影响DialogList组件。
有一点需要说明的是Filter中实际上调用了`Ux.ai2FilterButton`方法，该方法会自动生成对应的Op信息，所以不用调用`bind(Op)`的方式去绑定额外的按钮，
而在ComplexList中的示例代码里，`UI.Demo.Filter.js`是直接绑定了导入「import」的`Op.ts`的——**实际上这是没有必要的**。

### 2.代码

```javascript
    import React from 'react'
    import Ux from 'ux';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo.Filter")
        .raft(1)
        .form().to()
    )
    class Component extends React.PureComponent {
        render() {
            return Ux.uiFieldFilter(this, {...Ux.ai2FilterButton(1 / 3)}, 1)
        }
    }

    export default Component
 ```