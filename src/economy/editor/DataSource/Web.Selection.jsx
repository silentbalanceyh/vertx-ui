import React from 'react';
import {Col, Icon, Radio, Row} from 'antd';
import Op from './op';

const renderPrefix = (option = {}) => {
    if ("TABULAR" === option.value) {
        return (
            <Icon type="database" style={{
                fontSize: 18, color: "#008B00"
            }}/>
        )
    } else if ("CATEGORY" === option.value) {
        return (
            <Icon type={"cluster"} style={{
                fontSize: 18, color: "#1E90FF"
            }}/>
        )
    } else if ("ASSIST" === option.value) {
        return (
            <Icon type={"setting"} style={{
                fontSize: 18, color: "#B03060"
            }}/>
        )
    }
}
export default (reference) => {
    const {$selection = {}} = reference.state;
    return (
        <Row className={"op-select"}>
            <Col span={3} className={"header"}>
                {$selection.title}
            </Col>
            <Col span={21}>
                <Radio.Group onChange={Op.onCheck(reference)}>
                    {$selection.items.map(option => {
                        return (
                            <Radio key={option.value} value={option.value}>
                                {renderPrefix(option)}
                                &nbsp;
                                {option.label}
                            </Radio>
                        )
                    })}
                </Radio.Group>
            </Col>
        </Row>
    )
}