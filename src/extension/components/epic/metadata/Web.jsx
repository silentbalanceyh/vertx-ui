import {Col, Row} from "antd";
import Ux from "ux";
import {ExComplexList, ExTabular} from "ei";
import {HelpCard, LoadingAlert} from "web";
import React from "react";

export default (reference, {
    siderAttrs = {},
    listAttrs = {},
    alert = {},
    selected = false,
    span = {
        left: 4,
        right: 20,
    }
}) => (
    <HelpCard reference={reference}>
        {/* 左边选择菜单专用 */}
        <Row>
            <Col span={span.left} style={Ux.toHeight(148)}>
                <ExTabular {...siderAttrs}/>
            </Col>
            <Col span={span.right}>
                {selected ? (
                    <ExComplexList {...listAttrs}/>
                ) : (
                    <LoadingAlert $alert={alert}/>
                )}
            </Col>
        </Row>
    </HelpCard>
)