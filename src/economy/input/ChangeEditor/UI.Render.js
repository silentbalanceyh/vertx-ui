import React from 'react';
import './Cab.less';
import {Col, Input, Row} from 'antd';
import Op from './Op';

const renderTitle = (reference) => {
    const {config = {}} = reference.props;
    const {from = {}, to = {}} = config;
    const fromTitle = from.title ? from.title : "";
    const toTitle = to.title ? to.title : "";
    return (
        <Row className={"web-change-editor-head"}>
            <Col span={7}/>
            <Col span={7}>{fromTitle}</Col>
            <Col span={3}/>
            <Col span={7}>{toTitle}</Col>
        </Row>
    );
};
const renderBody = (reference) => {
    const {config = {}, source = [], ...jsx} = reference.props;
    const {value, ...meta} = jsx;
    const {from = {}, to = {}} = config;
    return source.map(item => (
        <Row key={`row${item.key}`} className={"web-change-editor-row"}>
            <Col span={7}>{item.label}：</Col>
            <Col span={7}><Input {...meta} readOnly {...from}/></Col>
            <Col span={3}/>
            <Col span={7}><Input {...meta} {...to}
                                 onChange={Op.on2Change(reference, item.key)}/>
            </Col>
        </Row>
    ));
};
export default {
    renderTitle,
    renderBody,
};