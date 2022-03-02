import Ux from "ux";
import {Card, Col, Icon, Row, Tooltip} from "antd";
import React from "react";
import UiForm from './UI.Form';
import Ex from 'ex';

const renderAction = (data, action = {}) => {
    const iconStyle = {fontSize: 18};
    if (data.uiKo) {
        const toolkit = [
            <Icon type={"check"} style={iconStyle}/>,
            <Icon type={"search"} style={iconStyle}/>
        ]
        if (data['uiAction']) {
            toolkit.push(
                <Icon type={"code"} style={iconStyle}/>
            )
        }
        return toolkit;
    } else {
        const toolkit = [
            <Tooltip title={action.connect}>
                <Icon type={"check"} style={iconStyle}/>
            </Tooltip>,
            <Tooltip title={action.view}>
                <Icon type={"search"} style={iconStyle}/>
            </Tooltip>
        ]
        if (data['uiAction']) {
            toolkit.push(
                <Tooltip title={data['uiAction']}>
                    <Icon type={"code"} style={iconStyle}/>
                </Tooltip>
            )
        }
        return toolkit;
    }
}

const renderDetail = (data, info) => {
    return (
        <div>
            <Row className={"item"}>
                <Col span={9} className={"item-right"}>
                    {info.status}
                </Col>
                <Col span={15} className={"item-status item-value"}>
                    {data.uiStatus}
                </Col>
            </Row>
            <Row className={"item"}>
                <Col span={9} className={"item-right"}>
                    {info.name}
                </Col>
                <Col span={15} className={"item-value"}>
                    {data.instance}
                </Col>
            </Row>
            <Row className={"item"}>
                <Col span={9} className={"item-right"}>
                    {info.category}
                </Col>
                <Col span={15} className={"item-value"}>
                    {data.category}
                </Col>
            </Row>
            <Row className={"item"}>
                <Col span={9} className={"item-right"}>
                    {info.hostname}
                </Col>
                <Col span={15} className={"item-value"}>
                    {data.hostname}
                </Col>
            </Row>
        </div>
    )
}

const renderDatabase = (reference, data = {}) => {
    const info = Ux.fromHoc(reference, "info")
    return (
        <div className={data.uiClass}>
            <Card cover={
                <div>
                    <Row>
                        <Col span={10} className={"item-icon"}>
                            <img src={data.uiImage} alt={data['uiTitle']}/>
                        </Col>
                        <Col span={14}>
                            {renderDetail(data, info)}
                        </Col>
                    </Row>
                </div>
            } actions={renderAction(data, info.action)}>
                <Card.Meta title={data['uiTitle']} description={data['uiDesc']}/>
            </Card>
        </div>
    );
}
const renderAtom = (reference, data = {}) => {
    const info = Ux.fromHoc(reference, "info");
    return (
        <div className={"running-form"}>
            <Card cover={
                <div className={"item-icon"}>
                    <img src={data.uiImage} alt={data['uiTitle']}/>
                </div>
            }>
                <Card.Meta title={data['uiTitle']}/>
                {renderDetail(data, info)}
            </Card>
        </div>
    )
}
const renderForm = (reference, data = {}) => {
    const inherits = Ex.yoAmbient(reference);
    inherits.$inited = data;
    return (
        <UiForm {...inherits}/>
    )
}
export default {
    renderDatabase,
    renderAtom,
    renderForm,
}