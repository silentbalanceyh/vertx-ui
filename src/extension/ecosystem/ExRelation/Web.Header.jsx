import {Col, Row, Tag} from "antd";
import React from "react";
import './Cab.less';

export default (data = {}, header = {}) => (
    <Row className={"ex-relation-header"}>
        <Col span={6}>
            <span className={"prefix"}>{header.category}：</span>
            <Tag color={"geekblue"}
                 style={{fontSize: 15}}>
                {data.category}
            </Tag>
        </Col>
        <Col span={6}>
            <span className={"prefix"}>{header.identifier}：</span>
            <Tag color={"green"}
                 style={{fontSize: 15}}>
                {data.identifier}
            </Tag>
        </Col>
        <Col span={6}>
            <span className={"prefix"}>{header.code}：</span>
            {data.code}
        </Col>
        <Col span={6}>
            <span className={"prefix"}>{header.name}：</span>
            {data.name}
        </Col>
    </Row>
)