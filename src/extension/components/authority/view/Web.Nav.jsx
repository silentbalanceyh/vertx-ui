import Ux from 'ux';
import {Col, Row, Tag} from 'antd';
import React from 'react';

export default (reference) => {
    const info = Ux.fromHoc(reference, "info");
    const {$owner = {}} = reference.state;
    return (
        <Row className={"row"}>
            <Col span={3} className={"title"}>
                {info.type}：
            </Col>
            <Col span={4}>
                {(() => {
                    const {owner = {}} = info;
                    return (
                        <Tag color={"geekblue"} style={{fontSize: 13}}>
                            {owner[$owner.ownerType]}
                        </Tag>
                    )
                })()}
            </Col>
            <Col span={3} className={"title"}>
                {info.name}：
            </Col>
            <Col span={4}>
                <Tag color={"orange"} style={{fontSize: 13}}>
                    {$owner.name}
                </Tag>
            </Col>
        </Row>
    )
}