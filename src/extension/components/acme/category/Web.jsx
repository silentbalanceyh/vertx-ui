import {Col, Row} from "antd";
import Ux from "ux";
import {ExCategory, ExComplexList} from "ei";
import {LoadingAlert, PageCard} from "web";
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
    <PageCard reference={reference}>
        {/* 左边选择菜单专用 */}
        <Row>
            <Col span={span.left} style={{
                maxHeight: Ux.toHeight(102),
                overflow: "auto",
                paddingRight: 6
            }}>
                <ExCategory {...siderAttrs}/>
            </Col>
            <Col span={span.right}>
                {selected ? (
                    <ExComplexList {...listAttrs}/>
                ) : (
                    <LoadingAlert $alert={alert}/>
                )}
            </Col>
        </Row>
    </PageCard>
)