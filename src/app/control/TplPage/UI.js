import React from 'react';
import Ux from 'ux';
import Ex from 'ex';
import {Tabs} from 'antd';

@Ux.zero(Ux.rxEtat(require("./Cab"))
    .cab("UI")
    .ready(true)
    .to()
)
class Component extends React.PureComponent {

    render() {
        return Ex.yoRender(this, () => {
            const tabs = Ux.fromHoc(this, "tabs");
            const tabConfig = Ux.configTab(this, tabs);
            const {items = [], ...rest} = tabConfig;
            const {pages = {}} = this.props;
            return (
                <Tabs {...rest}>
                    {items.map(item => {
                        const render = pages[item.key];
                        return (
                            <Tabs.TabPane {...item}>
                                {Ux.isFunction(render) ? render() : `${item.key} 丢失`}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            )
        }, Ex.parserOfColor("TplPage").component())
    }
}

export default Component