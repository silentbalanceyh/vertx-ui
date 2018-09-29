### 1.说明

`DialogMenu`为一个比`DialogButton`想对复杂一点的下拉菜单容器，它可用于更多的选择处理。
菜单项主要分为以下几种类型：

* 「弹窗」：直接弹出一个对话框。
    * $mode = DIALOG：对话框模式
    * $mode = DRAWER：浮游对话框模式
* 「函数」：直接运行一个回调函数

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux'
    import U from 'underscore'
    import {DialogMenu, PageCard} from 'web'
    import Op from './Op.Delete'
    import $formAdd from './UI.Form.Add'
    import $formEdit from './UI.Form.Edit'

    const {zero} = Ux;

    const renderPanel = (reference, config) => {
        const $config = Ux.clone(config);
        const $op = {};
        Object.keys(Op).filter(item => U.isFunction(Op[item]))
            .forEach(key => $op[key] = Op[key](reference));
        const form = {
            $formAdd,
            $formEdit
        };
        return (
            <DialogMenu $button={$config.button}
                        $items={$config.items}
                        $functions={$op}
                        $components={form}
                        $mode={$config.mode}/>
        )
    };

    @zero(Ux.rxEtat(require('./Cab'))
        .cab("UI.Demo")
        .to()
    )
    class Component extends React.PureComponent {
        render() {
            const configuration = Ux.fromHoc(this, "configuration");
            return (
                <PageCard reference={this}>
                    {Ux.aiGrid([12, 12],
                        renderPanel(this, configuration[0]),
                        renderPanel(this, configuration[1])
                    )}
                </PageCard>
            )
        }
    }

    export default Component
```