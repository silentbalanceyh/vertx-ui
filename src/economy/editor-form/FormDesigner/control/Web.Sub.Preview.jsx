import React from 'react';
import {component} from "../../../_internal";
import {Button, Form, Tabs} from "antd";
import ReactJson from 'react-json-view';
import Ux from 'ux';
import '../Cab.less';

const Page = {
    "tabPreview": (reference) => {
        return Ux.aiForm(reference);
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
    Ux.dgDebug(data, "预览表单专用");
    const state = {};
    const {form = {}} = data;
    const raft = Ux.configForm(form, {
        id: "SubForm-Preview",
        reference,                  // 引用数据
    });
    state.raft = raft;
    state.$ready = true;
    reference.setState(state);
}

@component({
    "i18n.cab": require('../Cab.json'),
    "i18n.name": "UI.Sub.Preview",
})
class Component extends React.PureComponent {
    componentDidMount() {
        yiInternal(this);
    }

    render() {
        return Ux.xtReady(this, () => {
            const tabs = Ux.fromHoc(this, "tabs");
            const tabConfig = Ux.configTab(this, tabs);
            const {items = [], ...rest} = tabConfig;
            return (
                <div>
                    <Tabs {...rest} className={"web-form-designer-preview"}>
                        {items.map(item => (
                            <Tabs.TabPane {...item}>
                                {(() => {
                                    const executor = Page[item.key];
                                    return executor(this);
                                })()}
                            </Tabs.TabPane>
                        ))}
                    </Tabs>
                    <Button id={"$opSavePreview"} className={"ux-hidden"}
                            onClick={event => {
                                const {data = {}} = this.props;
                                const raft = Ux.clone(data);
                                Ux.fn(this).rxSubmit(raft);
                            }}/>
                </div>
            );
        }, {
            name: "FormPreview",
            logger: true,
        })
    }
}

export default Form.create({})(Component)