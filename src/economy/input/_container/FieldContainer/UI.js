import React from 'react';
import Op from './Op';
import Ux from 'ux';
import U from 'underscore';
import {Tabs} from 'antd';
import './Cab.less';

class Component extends React.PureComponent {
    state = {};

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ux.xtRender(this, () => {
            const {$tabs = {}, $activeKey} = this.state;
            const tabs = Op.yoExtra($tabs, this);
            const {items = [], ...rest} = tabs;
            const {$inited = {}} = this.props;
            return (
                <Tabs {...rest} activeKey={$activeKey}
                      className={"ux-field-container"}>
                    {items.map(item => {
                        const {fnChild, ...rest} = item;
                        return (
                            <Tabs.TabPane {...rest}>
                                {U.isFunction(fnChild) ? fnChild($inited) : false}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            );
        })
    }
}

export default Component;