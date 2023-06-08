import React from 'react';
import {DatabaseOutlined} from '@ant-design/icons';
import {Col, Radio, Row} from 'antd';
import Op from './Op';
import __Zn from '../zero.uca.dependency';

const renderPrefix = (option = {}) => {
    if ("TABULAR" === option.value) {
        return (
            <DatabaseOutlined style={{
                fontSize: 18, color: "#008B00"
            }}/>
        );
    } else if ("CATEGORY" === option.value) {
        return __Zn.v4Icon("cluster", {
            style: {fontSize: 18, color: "#1E90FF"}
        });
    } else if ("ASSIST" === option.value) {
        return __Zn.v4Icon("setting", {
            style: {fontSize: 18, color: "#B03060"}
        });
    }
}
export default (reference) => {
    const {$selection = {}, $checked} = reference.state;
    return (
        <Row className={"op-select"}>
            <Col span={3} className={"header"}>
                {$selection.title}
            </Col>
            <Col span={21}>
                <Radio.Group onChange={Op.onCheck(reference)}
                             value={$checked}>
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