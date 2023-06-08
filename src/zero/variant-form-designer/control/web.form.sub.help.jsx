import React from "react";
import {Tabs} from 'antd';
import pages from '../document';

import mdIntro from '../document/doc.intro.md';
import mdLayout from '../document/doc.layout.md';
import mdSource from '../document/doc.source.md';
import mdComponent from '../document/doc.component.md';
import mdRule from '../document/doc.rule.md';
import {uca} from 'zi';
import __Zn from '../zero.uca.dependency';

const yiInternal = (reference) => {
    const tabs = __Zn.fromHoc(reference, "tabs");
    const state = {};
    state.$ready = true;
    state.$tabs = __Zn.configTab(reference, tabs);
    __Zn.parallel([
            __Zn.ajaxResource(mdIntro),
            __Zn.ajaxResource(mdLayout),
            __Zn.ajaxResource(mdSource),
            __Zn.ajaxResource(mdComponent),
            __Zn.ajaxResource(mdRule),
        ],
        "tabIntro",
        'tabLayout',
        'tabSource',
        'tabComponent',
        'tabRule'
    ).then(source => {
        state.$source = source;

        __Zn.of(reference).in(state).done();
        // reference.?etState(state);
    }).catch(error => {
        console.error(error);
    })
}

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Help",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const {$tabs = {}} = this.state;
            const {items = [], ...rest} = $tabs;
            // v4
            const $items = __Zn.v4Items(items, {
                // itemFn 默认
                childFn: (item = {}, ref) => {
                    const fnRender = pages[item.key];
                    return __Zn.isFunction(fnRender) ?
                        fnRender(ref) : `No Page Found: ${item.key}`
                }
            }, this);
            /*
                        {items.map(item => {
                            const fnRender = pages[item.key];
                            return (
                                <Tabs.?abPane {...item}>
                                    {__Zn.isFunction(fnRender) ? fnRender(this) : `No Page Found: ${item.key}`}
                                </Tabs.?abPane>
                            )
                        })}
             */
            return (
                <div className={"web-form-designer-document"}>
                    <Tabs {...rest} items={$items}/>
                </div>
            );
        }, {
            name: "HelpPage",
            logger: true,
        })
    }
}

export default Component