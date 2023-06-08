import React from 'react';
import {Button, Tabs} from "antd";
import ReactJson from 'react-json-view';

import __Zn from '../zero.uca.dependency';
import {uca} from 'zi';

const Page = {
    "tabPreview": (reference) => {
        return __Zn.aiForm(reference);
    },
    "tabConfig": (reference) => {
        const {data = {}} = reference.props;
        return (
            <div className={"content-json"}>
                <ReactJson src={data.form}/>
            </div>
        )
    }
}

const yiInternal = (reference) => {
    const {data = {}} = reference.props;
    __Zn.dgDebug(data, "预览表单专用");
    const state = {};
    const {form = {}} = data;
    state.raft = __Zn.configForm(form, {
        id: "SubForm-Preview",
        reference,                  // 引用数据
    });
    __Zn.of(reference).in(state).ready().done();
    // state.$ready = true;
    // reference.?etState(state);
}

@uca({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Preview",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return __Zn.xtReady(this, () => {
            const tabs = __Zn.fromHoc(this, "tabs");
            const tabConfig = __Zn.configTab(this, tabs);
            const {items = [], ...rest} = tabConfig;
            // v4
            const $items = __Zn.v4Items(items, {
                // itemFn
                childFn: (item, ref) => {
                    const executor = Page[item.key];
                    return executor(ref);
                }
            }, this);
            /*
                        {items.map(item => (
                            <Tabs.?abPane {...item}>
                                {(() => {
                                    const executor = Page[item.key];
                                    return executor(this);
                                })()}
                            </Tabs.?abPane>
                        ))}
             */
            return (
                <div>
                    <Tabs {...rest} items={$items}
                          className={"web-form-designer-preview"}/>
                    <Button id={"$opSavePreview"} className={"ux_hidden"}
                            onClick={event => {
                                const {data = {}} = this.props;
                                const raft = __Zn.clone(data);
                                __Zn.fn(this).rxSubmit(raft);
                            }}/>
                </div>
            );
        }, {
            name: "FormPreview",
            logger: true,
        })
    }
}

export default Component