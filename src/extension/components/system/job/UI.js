import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {Tabs} from 'antd';
import Op from './yi';
import Rdr from "./page";

const renderChild = (reference, item, $inited = {}) => {
    if ("tabTask" === item.key) {
        return Rdr.pageMain(reference, item, $inited);
    } else {
        return Rdr.pageForm(reference, item, $inited);
    }
};

@Ux.zero(Ux.rxEtat(require('./Cab'))
    .cab("UI")
    .to()
)
class Component extends React.PureComponent {

    componentDidMount() {
        Op.yiPage(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.yuPage(this);
    }

    render() {
        return Ex.ylCard(this, () => {
            const {$tabs = {}, $inited = {}} = this.state;
            const {items = [], ...tabsAttrs} = $tabs;
            return (
                <Tabs {...tabsAttrs} tabBarExtraContent={(() => {
                    /* extra */
                    let buttons = Ux.fromHoc(this, "extra");
                    if (Ux.isArray(buttons)) {
                        buttons = Ux.aiExprButtons(buttons);
                    }
                    return Rdr.pageExtra(this, buttons);
                })()}>
                    {items.map(item => (
                        <Tabs.TabPane {...item}>
                            {renderChild(this, item, $inited)}
                        </Tabs.TabPane>
                    ))}
                </Tabs>
            )
        }, Ex.parserOfColor("PxJob").page());
    }
}

export default Component