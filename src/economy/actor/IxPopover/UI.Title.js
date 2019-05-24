import React from "react";
import {Button, Col, Row} from "antd";
import Fx from '../Fx';

export default (reference, config) => {
    return (
        <Row>
            <Col span={23}>
                <h3>{config.title}</h3>
            </Col>
            <Col span={1}>
                <Button shape={"circle"} icon={"close"}
                        size={"small"} className={"ux-red"}
                        onClick={event => {
                            event.preventDefault();
                            Fx.doClose(reference);   // 关闭
                        }}/>
            </Col>
        </Row>
    )
};