### 1.说明

`DialogButton`主要为一个纯容器，兼容三种不同的窗口：

* `$mode = DIALOG`：「窗口模式」
* `$mode = POPOVER`：「浮游窗口模式」
* `$mode = DRAWER`：「抽屉模式」

这种组件一般用于在某个按钮中绑定一个窗口的操作执行二次提交。

### 2.代码

```js
    import React from 'react'
    import Ux from 'ux'
    import {DialogButton, PageCard} from 'web'

    const {zero} = Ux;

    const renderPanel = (config) => {
        const $config = Ux.clone(config);
        return (
            <DialogButton $button={$config.button}
                          $dialog={$config.dialog}
                          $mode={$config.mode}>
                BUTTON, {$config.mode}
            </DialogButton>
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
                    {Ux.aiGrid([8, 8, 8],
                        renderPanel(configuration[0]),
                        renderPanel(configuration[1]),
                        renderPanel(configuration[2])
                    )}
                </PageCard>
            )
        }
    }

    export default Component
```