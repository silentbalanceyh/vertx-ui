import React from 'react';
import Ux from 'ux';
import {Col, Row, Spin, Tag} from 'antd';
import {LoadingAlert} from 'web';
import Op from './Op';
import __Zn from '../zero.aero.dependency';

import HxAction from '../HxAction/UI';
import HxMenu from '../HxMenu/UI';
import HxQueue from '../HxQueue/UI';

import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "HxFlow";

const componentInit = (reference) => {
    Ux.dgAdmit(reference.props, UCA_NAME);
    const {config = {}} = reference.props;
    // 维度数据提取
    const {group = []} = config;
    const state = {};
    state.$gData = group;
    // aclRegionInit:
    __Zn.aclRegionInit(reference).then((response = {}) => {

        Object.assign(state, response);
        Ux.of(reference).in(state).ready().done();
        // reference.?etState(state);
        Ux.dgAdmit(state, UCA_NAME, false);
    });
}

const renderHeader = (reference, $selected, header) => {
    return (
        <Row className={"hx-head"}>
            {Object.keys(header).map(field => [
                <Col span={4} key={`field-${field}`} className={"hx-head-title"}>
                    {header[field]}：
                </Col>,
                <Col span={6} key={`value-${field}`}>
                    {"label" === field ? (
                        <Tag color={"#EEB422"} style={{
                            fontSize: 14
                        }}>
                            {$selected[field]}
                        </Tag>
                    ) : $selected[field]}
                </Col>
            ])}
        </Row>
    )
}

const renderChildren = (reference) => {
    const {$selected, $loading = false} = reference.state;
    const {
        config = {}
    } = reference.props;
    const {webWelcome = {}, webChildren = []} = config;
    if ($selected) {
        const {header = {}} = webWelcome;
        return (
            <Spin spinning={$loading}>
                {/* Header */}
                {renderHeader(reference, $selected, header)}
                {/* children */}
                {webChildren.map(child => {
                    const childConfig = Op.yoChild(reference, child, $selected, HI);
                    if (childConfig) {
                        const {
                            container = {},
                            UI, inherit = {}
                        } = childConfig;
                        return (
                            <div key={container.key} className={"hx-body"}>
                                <div className={"ux_title"}>{container.label}</div>
                                <UI {...inherit}/>
                            </div>
                        )
                    } else return false;
                })}
            </Spin>
        )
    } else {
        const {alert} = webWelcome;
        return (
            <LoadingAlert $alert={alert}/>
        )
    }
}

class Component extends React.PureComponent {

    displayName = UCA_NAME;

    componentDidMount() {
        componentInit(this);
    }

    render() {
        return __Zn.yoRender(this, () => {
            const {config = {}} = this.props;
            const {webTag = {}} = config;
            const attrHx = Sk.mixHx(UCA_NAME, () => {
                const maxHeight = Ux.toHeight(270);
                return {minHeight: maxHeight}
            });
            return (
                <div {...attrHx}>
                    <Row>
                        <Col span={5} className={"hx-tag"}>
                            {__Zn.webTag(this, webTag, {
                                rxTag: Op.jsxTag,
                                rxSelect: Op.rxSelect,
                            })}
                        </Col>
                        <Col span={19} className={"hx-content"}>
                            {renderChildren(this)}
                        </Col>
                    </Row>
                    {__Zn.webAnchor(this, [
                        __Zn.aclE.C.rxSendFn,    // `Save Action`
                    ])}
                </div>
            )
        }, __Zn.parserOfColor(UCA_NAME).internal({off: true}))
    }
}

const HI = {
    HxAction,
    HxMenu,
    HxQueue,
    HxFlow: Component,
}

export default Component