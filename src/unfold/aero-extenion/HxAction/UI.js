import React from 'react';
import {Checkbox, Col, Row, Tag} from 'antd';

import Op from './Op';
import __Zn from '../zero.aero.dependency';
import Sk from 'skin';
import "./Cab.norm.scss";

const UCA_NAME = "HxAction";

const renderAction = (reference, $node) => {
    // Button Filter
    const actions = Op.yoData(reference, $node.event);
    // Checkbox
    const {$keySet = new Set()} = reference.state;
    const checkAttrs = {};
    checkAttrs.value = Array.from($keySet);
    checkAttrs.onChange = __Zn.aclE.C.rxCheckFn(reference, {
        source: actions,
    });
    return (
        <Checkbox.Group {...checkAttrs}>
            {actions.map(action => (
                <Checkbox key={action.key} value={action.key}>
                    {action.text}
                </Checkbox>
            ))}
        </Checkbox.Group>
    );
}

const renderHeader = (reference) => {
    const {config = {}} = reference.props;
    const {webNode = {}} = config;
    const {$node} = reference.state;
    return (
        <div className={"hx-head"}>
            <Row className={"summary"}>
                <Col span={4} className={"title"}>
                    {webNode.name}：
                </Col>
                <Col span={6}>
                    {$node ? $node.name : false}
                </Col>
                <Col span={4} className={"title"}>
                    {webNode.event}：
                </Col>
                <Col span={6}>
                    {$node ? $node.event : false}
                </Col>
            </Row>
            <Row>
                <Col span={4} className={"title"}>
                    {webNode.action}：
                </Col>
                <Col span={20}>
                    {$node ? renderAction(reference, $node) :
                        (<Tag color={"orange"} style={{
                            fontSize: 14
                        }}>{webNode.empty}</Tag>)}
                </Col>
            </Row>
        </div>
    )
}

class Component extends React.PureComponent {
    displayName = UCA_NAME;
    state = {};

    componentDidMount() {
        Op.componentInit(this);
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        Op.componentUp(this, {state: prevState, props: prevProps});
    }

    render() {
        const {config = {}} = this.props;
        const {webCanvas = {}} = config;
        const {height = 200, offset = 3} = webCanvas;
        const style = {height};
        style.paddingLeft = `${offset}%`;
        const attrHx = Sk.mixHx(UCA_NAME);
        return (
            <div {...attrHx}>
                {renderHeader(this)}
                <Row>
                    <Col span={23} className={"hx-bpmn"}>
                        <div ref={"bpmnAction"}
                             style={style}
                             id={"bpmnAction"}>

                        </div>
                    </Col>
                </Row>
            </div>
        )
    }
}

export default Component