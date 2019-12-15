import React from 'react';
import Ex from 'ex';
import Op from './Op';
import {Tabs} from 'antd';
import U from 'underscore';

import renderPage from './Web.Search';
import renderDialog from "./Web.Dialog";
import renderDynamic from './Web.Dynamic';

/*
 * config: {
 *
 * }
 */
class Component extends React.PureComponent {
    state = {
        $ready: false
    };

    componentDidMount() {
        Op.yiPage(this);
    }

    render() {
        return Ex.yoRender(this, () => {
            const {$tabs = {}} = this.state;
            const fnRender = [
                () => renderPage(this),
                (item) => renderDynamic(this, item),
            ];
            const {items = [], ...rest} = $tabs;
            return (
                <div>
                    <Tabs {...rest}>
                        {items.map((item, index) => {
                            const fun = fnRender[index];
                            return (
                                <Tabs.TabPane {...item}>
                                    {U.isFunction(fun) ? fun(item) : false}
                                </Tabs.TabPane>
                            )
                        })}
                    </Tabs>
                    {renderDialog(this)}
                </div>
            )
        }, Ex.parserOfColor("ExWizard").component())
    }
}

export default Component;