import {component} from "../../../_internal";
import React from "react";
import Ux from 'ux';
import {Tabs} from 'antd';
import pages from './help';

import mdIntro from './help/intro.md';
import mdLayout from './help/layout.md';
import mdSource from './help/source.md';
import mdComponent from './help/component.md';
import mdRule from './help/rule.md';

const yiInternal = (reference) => {
    const tabs = Ux.fromHoc(reference, "tabs");
    const state = {};
    state.$ready = true;
    state.$tabs = Ux.configTab(reference, tabs);
    Ux.parallel([
            Ux.ajaxResource(mdIntro),
            Ux.ajaxResource(mdLayout),
            Ux.ajaxResource(mdSource),
            Ux.ajaxResource(mdComponent),
            Ux.ajaxResource(mdRule),
        ],
        "tabIntro",
        'tabLayout',
        'tabSource',
        'tabComponent',
        'tabRule'
    ).then(source => {
        state.$source = source;
        reference.setState(state);
    }).catch(error => {
        console.error(error);
    })
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Help",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const {$tabs = {}} = this.state;
            const {items = [], ...rest} = $tabs;
            return (
                <div className={"web-form-designer-help"}>
                    <Tabs {...rest}>
                        {items.map(item => {
                            const fnRender = pages[item.key];
                            return (
                                <Tabs.TabPane {...item}>
                                    {Ux.isFunction(fnRender) ? fnRender(this) : `No Page Found: ${item.key}`}
                                </Tabs.TabPane>
                            )
                        })}
                    </Tabs>
                </div>
            );
        }, {
            name: "HelpPage",
            logger: true,
        })
    }
}

export default Component