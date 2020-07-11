import React from 'react';
import {Col, Row, Select, Tag} from 'antd';
import Ux from 'ux';
import Op from './yo';

export default (reference) => {
    const {$tpl = [], $tplKey = "ALL"} = reference.state;
    const selected = Ux.fromHoc(reference, "selected");
    const $options = selected.option.concat($tpl);

    const attrSelected = {};
    attrSelected.onChange = Op.onSelected(reference);
    attrSelected.style = {
        minWidth: 180
    };
    attrSelected.value = $tplKey;

    const tips = Ux.fromHoc(reference, "tips");
    return (
        <Row style={{marginBottom: 8}}>
            <Col span={16}>
                {"ALL" !== $tplKey ? (
                    <Tag color={"geekblue"}>{tips.tag}</Tag>
                ) : false}
            </Col>
            <Col span={2} className={"drawer-selected"}>
                <label>{selected.prefix}</label>
            </Col>
            <Col span={6}>
                <Select {...attrSelected}>
                    {$options.map(option => (
                        <Select.Option key={option.key} value={option.value}>
                            {option.name}
                        </Select.Option>))}
                </Select>
            </Col>
        </Row>
    );
}