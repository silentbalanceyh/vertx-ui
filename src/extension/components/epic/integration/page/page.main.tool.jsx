import {Col, Input, Row} from 'antd';
import React from 'react';
import Ux from 'ux';
import Event from '../event';

const renderSearch = (reference, tool = {}) => {
    const {search} = tool;
    const {$condText} = reference.state;
    if (search) {
        return (
            <Input.Search placeholder={search.placeholder} allowClear
                          value={$condText}
                          onChange={Event.onSearchChange(reference)}
                          onSearch={Event.onSearch(reference)}/>
        )
    } else return false;
}

export default (reference) => {
    let tool = Ux.fromHoc(reference, "tool");
    if (!tool) tool = {};
    return (
        <Row className={"job-tool"}>
            <Col span={5} offset={19}>
                {renderSearch(reference, tool)}
            </Col>
        </Row>
    )
}