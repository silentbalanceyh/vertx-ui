### 1.说明

`PageCard`一般用于主体页面中的内容页，分上下两个区域：Header和Body。

* Header部分包含：左边标题、左边操作按钮、右边辅助按钮、返回按钮；
* Body部分可随意放置其他组件——根据开发人员具体需求而定；
* 顶部的操作按钮（左/右）都支持Zero UI中的Connect机制，可直接绑定到Body页面中的某个按钮；

### 2.代码

```javascript
    import React from 'react'
    import Ux from "ux";
    import {PageCard} from 'web';

    const {zero} = Ux;

    @zero(Ux.rxEtat(require('./Cab.json'))
        .cab("UI.Demo")
        .to()
    )
    class Component extends React.PureComponent {

        render() {
            // 1.children为当前PageCard中的子控件
            // 2.$status则是传入的可调整的属性信息，规范：R-001
            const {children, $status = {}} = this.props;
            return (
                <PageCard reference={this} {...$status}>
                    {/** 子控件区域 **/}
                    {children}
                </PageCard>
            )
        }
    }

    export default Component
```