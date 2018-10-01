### 1.说明

#### 1.1.呈现模式

`TreeTable`为比较特殊的一个组件，用于生成一个多级树形菜单专用，它包含两种呈现模式：

* **视图模式**：仅呈现树形表格；
* **编辑模式**：可开启树形表格中的编辑信息；

#### 1.2.单元格组件

每个单元格目前支持两个组件：`DialogMenu/DialogButton`。

* <a href="/zui/control/dialog-button" target="_blank">DialogButton教程</a>
* <a href="/zui/control/dialog-menu" target="_blank">DialogMenu教程</a>

#### 1.3.组件位置

每一列的编辑模式中组件分为三种：

* 标题组件——上述组件位于标题中「仅支持DialogButton」；
* 单元格空渲染——单元格没有数据时的渲染流程；
* 单元格渲染——单元格中的普通渲染；

#### 1.4.核心参数

当前组件支持两个核心参数：`$component/$functions`，主要用于内置组件用于绑定行为而使用。

### 2.代码

```js
    import React from 'react'
    import {TreeTable} from 'web';
    import FormCat from './UI.Demo.Dialog.Cat';
    import FormProd from './UI.Demo.Dialog.Procedure';
    import Op from './Op';
    import Ux from 'ux';
    import {Tps} from 'app';

    const Components = {
        $formCatFirst: FormCat,
        $formCatSecond: FormCat,
        $formCatThird: FormCat,
        $formProcedure: FormProd,
    };

    const {zero} = Ux;

    @zero(Ux.rxEtat(require("./Cab"))
        .cab("UI.Demo")
        .tree(Tps.fnTreeData)
        .state({})
        .to()
    )
    class Component extends React.PureComponent {
        render() {
            const functions = Ux.valueFunction(Op.Functions)(this);
            const attrs = {};
            attrs.reference = this;
            attrs.$components = Components;
            attrs.$functions = functions;
            attrs.$inited = {key: "501c4240-aff2-4949-aca7-b15408840f8b"};
            return (
                <TreeTable {...this.props}
                           {...attrs}/>
            )
        }
    }

    export default Component
```