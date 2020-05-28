import Ux from 'ux';
import {Col, Icon, Row, Tag} from 'antd';
import React from "react";

const _renderCounter = (reference, field) => {
    const status = Ux.fromHoc(reference, "status");
    const {raft = {}} = reference.state;
    const {form = {}} = raft;
    let counter;
    const value = form[field];
    if (value) {
        if (Ux.isArray(value)) {
            counter = value.length;
        } else if (Ux.isObject(value)) {
            counter = Object.keys(value).length;
        } else {
            counter = 0;
        }
    } else {
        counter = 0;
    }
    return Ux.formatExpr(status.count, {counter}, true);
}

const renderCount = (title, counterJsx) => {
    return (
        <Col span={5}>
            <label>{title}</label>
            &nbsp;&nbsp;
            <Tag>
                {counterJsx}
            </Tag>
        </Col>
    )
}

export default (reference) => {
    let status = Ux.fromHoc(reference, "status");
    status = status ? status : {};
    const {raft = {}} = reference.state;
    const form = raft.form ? raft.form : {};
    const expr = status['windowValue'] ? status['windowValue'] : "";
    return (
        <Row className={"content-status"}>
            <Col span={4}>
                <Tag color={"geekblue"} style={{fontSize: 14}}>
                    {status.set}
                    &nbsp;
                    <Icon type={"arrow-right"}/>
                </Tag>
            </Col>
            {/* 隐藏字段报表 */}
            {renderCount(status.hidden, _renderCounter(reference, 'hidden'))}
            {/* 初始值 */}
            {renderCount(status.initial, _renderCounter(reference, 'initial'))}
            {/* 辅助数据源 */}
            {renderCount(status.assist, _renderCounter(reference, 'assist'))}
            <Col span={5} className={"window-default"}>
                <label>{status.window}</label>
                &nbsp;&nbsp;
                <Tag color={"red"} style={{fontSize: 14}}>
                    {(() => {
                        const columns = form.columns ? form.columns : 4;
                        return Ux.formatExpr(expr, {columns})
                    })()}
                </Tag>
            </Col>
        </Row>
    )
}