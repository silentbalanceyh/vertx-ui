import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {Tabs} from "antd";
import U from 'underscore';

const LOG = {
    name: "OxTab",
    color: "#A52A2A"
};

class Component extends React.PureComponent {
    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            /*
             * inherit 处理
             */
            const inherit = Ex.yoDynamic(this);

            const {$tabs = {}} = this.state;
            const {items = [], ...rest} = $tabs;
            return (
                <Tabs {...rest}>
                    {items.map(item => {
                        const {fnRender, ...itemRest} = item;
                        return (
                            <Tabs.TabPane {...itemRest}>
                                {U.isFunction(fnRender) ? fnRender(inherit) : false}
                            </Tabs.TabPane>
                        )
                    })}
                </Tabs>
            );
        }, LOG)
    }
}

export default Component;