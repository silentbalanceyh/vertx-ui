import React from 'react';
import {Col, Row, Tag} from 'antd';

export default (reference, target = {}) => {
    const {title, sort = {}} = target;
    const {config = {}} = reference.props;
    const isSort = !!config.sort;
    return () => (
        <Row>
            <Col span={20}>
                {title}
            </Col>
            <Col span={4} className={"ix-sort"}>
                <Tag color={`${isSort ? "#f50" : "#87d068"}`} style={{
                    fontSize: 14
                }}>
                    {sort[`${isSort}`]}
                </Tag>
            </Col>
        </Row>
    );
};