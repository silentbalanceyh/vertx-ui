import React from 'react'
import {MarkdownViewer, PageCard} from "web";
import Ux from 'ux';
import {Collapse} from 'antd';
import ReactJson from 'react-json-view';
import Immutable from 'immutable';

const demoPage = (reference, ...children) => {
    return (
        <PageCard reference={reference}>
            {Ux.auiTab(reference)
                .to(
                    children[0],
                    children[1]
                )}
        </PageCard>
    )
};
const _removed = Immutable.fromJS([
    "_button",
    "_dialog",
    "_loading",
    "_placeholder",
    "_logicals",
    "_demo"
]);
const demoSingle = (reference, jsx) => {
    // 当前演示组件
    const current = reference.state.$hoc;
    const json = current.to();
    const jsonView = Immutable.fromJS(json).toJS();
    for (const field in jsonView) {
        if (_removed.contains(field)) {
            delete jsonView[field];
        }
    }
    return (
        <div className={"demo-window"}>
            <Collapse className={"page-card-collapse"} defaultActiveKey={"clpComponent"}>
                <Collapse.Panel header={"Component"} key={"clpComponent"}>
                    {jsx}
                </Collapse.Panel>
                <Collapse.Panel header={"Config"}>
                    <ReactJson src={jsonView} name={null} enableClipboard={false}/>
                </Collapse.Panel>
            </Collapse>
        </div>
    )
};
const demoComponent = (reference, jsx, md = "", jsonDirect) => {
    const hoc = reference.props.reference.state.$hoc;
    const titleStr = hoc._("subjson").config;
    const fileStr = hoc._("subjson").source;
    // 当前演示组件
    const current = reference.state.$hoc;
    const title = current.name() + ".json";
    const expr = new RegExp(`cab/${Ux.Env['LANGUAGE']}/`, 'g');
    const file = current.name().replace(expr, '') + ".js";
    const configTitle = Ux.formatExpr(titleStr, {title});
    const jsTitle = Ux.formatExpr(fileStr, {file});
    const json = current.to();
    const jsonView = Immutable.fromJS(json).toJS();
    for (const field in jsonView) {
        if (_removed.contains(field)) {
            delete jsonView[field];
        }
    }
    return (
        <div className={"demo-window"}>
            {jsx}
            <Collapse className={"page-card-collapse"}>
                <Collapse.Panel header={configTitle}>
                    <ReactJson src={jsonDirect ? jsonDirect : jsonView} name={null} enableClipboard={false}/>
                </Collapse.Panel>
                <Collapse.Panel header={jsTitle}>
                    <MarkdownViewer $source={md}/>
                </Collapse.Panel>
            </Collapse>
        </div>
    )
};
export default {
    demoSingle,
    demoPage,
    demoComponent,
}