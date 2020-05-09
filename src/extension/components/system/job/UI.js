import React from 'react'
import Ux from 'ux';
import Ex from 'ex';
import {Tabs} from 'antd';
import Op from './Op';
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
            /*
             * 列表
             */
            const {items = [], ...tabsAttrs} = $tabs;
            return (
                <Tabs {...tabsAttrs}
                      tabBarExtraContent={Rdr.pageExtra(this)}>
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