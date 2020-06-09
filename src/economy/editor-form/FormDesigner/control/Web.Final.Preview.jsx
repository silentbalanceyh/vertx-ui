import React from 'react';
import {component} from "../../../_internal";
import {Form, Tabs} from "antd";
import Ux from 'ux';
import Op from '../op';

const Page = {
    "tabPreview": (reference) => {
        const ref = Ux.onReference(reference, 1);
        const data = Op.rxRequest(ref);
        return false;
    },
    "tabConfig": (reference) => {
        return false;
    }
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Preview",
})
class Component extends React.PureComponent {

    render() {
        const tabs = Ux.fromHoc(this, "tabs");
        const tabConfig = Ux.configTab(this, tabs);
        const {items = [], ...rest} = tabConfig;
        return (
            <Tabs {...rest}>
                {items.map(item => (
                    <Tabs.TabPane {...item}>
                        {(() => {
                            const key = item.key;
                            const executor = Page[item.key];
                            return executor(this);
                        })()}
                    </Tabs.TabPane>
                ))}
            </Tabs>
        );
    }
}

export default Form.create({})(Component)