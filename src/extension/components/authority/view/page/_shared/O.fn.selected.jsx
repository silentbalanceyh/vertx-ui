import React from 'react';
import {Col, Row, Tag} from 'antd';

export default (reference, info = {}) => {
    const {$selected} = reference.state;

    return (
        <Row className={"row-comment"}>
            <Col span={4} className={"title"}>
                {info.name}
            </Col>
            <Col span={6}>
                {$selected ? $selected.name : (
                    <Tag>
                        {info['unselected']}
                    </Tag>
                )}
            </Col>
            <Col span={4} className={"title"}>
                {info.identifier}
            </Col>
            <Col span={6}>
                {$selected ? $selected.identifier : (
                    <Tag>
                        {info['unselected']}
                    </Tag>
                )}
            </Col>
        </Row>
    )
}